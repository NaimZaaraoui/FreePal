import { useState } from "react";
import { motion } from "motion/react";
import { Mail, X } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { supabase } from "../../config/supabaseClient";
import useApp from "../../hooks/useApp";

interface Props {
  communityId: string;
  onClose: () => void;
}

const InviteMembersModal = ({ communityId, onClose }: Props) => {
  const [emails, setEmails] = useState<string[]>([]);
  const [currentEmail, setCurrentEmail] = useState("");
  const { showToast } = useApp();

  const { mutate: sendInvites, isPending } = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.functions.invoke("send-invites", {
        body: { emails, communityId },
      });
      if (error) throw error;
    },
    onSuccess: () => {
      showToast({
        type: "success",
        title: "Invites sent successfully",
        message: "The invites have been sent to the provided email addresses.",
      });
      onClose();
    },
  });

  const handleAddEmail = () => {
    if (currentEmail && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(currentEmail)) {
      setEmails((prev) => [...prev, currentEmail]);
      setCurrentEmail("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddEmail();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}>
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-lg bg-white rounded-2xl shadow-xl">
        <div className="p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Invite Members
          </h2>
          <div className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-1">
                Email Addresses
              </label>
              <div className="flex gap-2">
                <input
                  type="email"
                  id="email"
                  value={currentEmail}
                  onChange={(e) => setCurrentEmail(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Enter email address"
                  className="flex-1 px-4 py-2 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                />
                <button
                  type="button"
                  onClick={handleAddEmail}
                  className="px-4 py-2 text-indigo-600 font-medium bg-indigo-50 rounded-xl hover:bg-indigo-100 transition-colors">
                  Add
                </button>
              </div>
            </div>

            {/* Email Tags */}
            <div className="flex flex-wrap gap-2">
              {emails.map((email) => (
                <motion.div
                  key={email}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.8, opacity: 0 }}
                  className="flex items-center gap-1 px-3 py-1 bg-gray-100 rounded-full text-sm">
                  <Mail className="w-3 h-3 text-gray-500" />
                  <span>{email}</span>
                  <button
                    type="button"
                    onClick={() =>
                      setEmails((prev) => prev.filter((e) => e !== email))
                    }
                    className="p-0.5 hover:bg-gray-200 rounded-full" aria-label="Remove email">
                    <X className="w-3 h-3 text-gray-500" />
                  </button>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2 px-6 py-4 border-t border-gray-100">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-gray-700 font-medium hover:bg-gray-50 rounded-xl transition-colors">
            Cancel
          </button>
          <button
            type="button"
            disabled={emails.length === 0 || isPending}
            onClick={() => sendInvites()}
            className="px-4 py-2 text-white font-medium bg-gradient-to-r from-indigo-500 to-pink-500 rounded-xl
                     hover:shadow-lg hover:shadow-indigo-500/25 disabled:opacity-50 disabled:cursor-not-allowed transition-all">
            {isPending ? "Sending..." : "Send Invites"}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default InviteMembersModal;
