import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import {
  AlertTriangle,
  Clock,
  MessageSquareOff,
  Trash2,
  MoreVertical,
} from "lucide-react";
import { useModeratorActionMutation } from "../../mutations/communities";
import useApp from "../../hooks/useApp";

interface Props {
  readonly communityId: string;
  readonly targetUserId: string;
  readonly contentId?: string;
  readonly type: "post" | "comment" | "user";
}

export default function ModeratorActions({
  communityId,
  targetUserId,
  contentId,
  type,
}: Props) {
  const [showMuteDialog, setShowMuteDialog] = useState(false);
  const [showReasonDialog, setShowReasonDialog] = useState(false);
  const [actionType, setActionType] = useState<
    "warn" | "mute" | "remove_post" | "remove_comment"
  >();
  const [duration, setDuration] = useState(24); // Default 24 hours
  const [reason, setReason] = useState("");

  const { mutate: takeAction, isPending } = useModeratorActionMutation();
  const { showToast } = useApp();

  const handleAction = () => {
    if (!reason.trim()) {
      showToast({
        type: "error",
        title: "Error",
        message: "Please provide a reason for this action",
      });
      return;
    }

    takeAction({
      communityId,
      targetUserId,
      actionType: actionType!,
      reason,
      duration: actionType === "mute" ? duration : undefined,
      contentId,
    });

    setShowMuteDialog(false);
    setShowReasonDialog(false);
    setReason("");
  };

  const startAction = (type: typeof actionType) => {
    setActionType(type);
    if (type === "mute") {
      setShowMuteDialog(true);
    } else {
      setShowReasonDialog(true);
    }
  };

  return (
    <>
      <Menu
        as="div"
        className="relative">
        <MenuButton className="p-1 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100">
          <MoreVertical className="w-4 h-4" />
        </MenuButton>

        <MenuItems className="absolute right-0 mt-1 w-56 bg-white rounded-xl shadow-lg border border-gray-100 py-1 z-10">
          {type !== "user" && (
            <MenuItem>
              {({ active }) => (
                <button
                  onClick={() =>
                    startAction(
                      type === "post" ? "remove_post" : "remove_comment"
                    )
                  }
                  className={`flex items-center gap-2 w-full px-4 py-2 text-left text-sm text-red-600 ${
                    active ? "bg-red-50" : ""
                  }`}>
                  <Trash2 className="w-4 h-4" />
                  Remove {type}
                </button>
              )}
            </MenuItem>
          )}

          <MenuItem>
            {({ active }) => (
              <button
                onClick={() => startAction("warn")}
                className={`flex items-center gap-2 w-full px-4 py-2 text-left text-sm ${
                  active ? "bg-gray-50" : ""
                }`}>
                <AlertTriangle className="w-4 h-4" />
                Issue Warning
              </button>
            )}
          </MenuItem>

          <MenuItem>
            {({ active }) => (
              <button
                onClick={() => startAction("mute")}
                className={`flex items-center gap-2 w-full px-4 py-2 text-left text-sm ${
                  active ? "bg-gray-50" : ""
                }`}>
                <MessageSquareOff className="w-4 h-4" />
                Mute User
              </button>
            )}
          </MenuItem>
        </MenuItems>
      </Menu>

      {/* Mute Duration Dialog */}
      <AnimatePresence>
        {showMuteDialog && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowMuteDialog(false)}>
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md bg-white rounded-2xl shadow-xl">
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Mute Duration
                </h3>
                <div className="space-y-4">
                  <div>
                    <label
                      className="block text-sm font-medium text-gray-700 mb-1"
                      htmlFor="duration">
                      Duration (hours)
                    </label>
                    <div className="flex items-center gap-2">
                      <Clock className="w-5 h-5 text-gray-400" />
                      <input
                        id="duration"
                        type="number"
                        min="1"
                        value={duration}
                        onChange={(e) => setDuration(parseInt(e.target.value))}
                        className="flex-1 px-4 py-2 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                      />
                    </div>
                  </div>
                  <div>
                    <label
                      className="block text-sm font-medium text-gray-700 mb-1"
                      htmlFor="reason">
                      Reason
                    </label>
                    <textarea
                      id="reason"
                      value={reason}
                      onChange={(e) => setReason(e.target.value)}
                      rows={3}
                      className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                      placeholder="Provide a reason for muting this user..."
                    />
                  </div>
                </div>
              </div>
              <div className="flex justify-end gap-2 px-6 py-4 border-t border-gray-100">
                <button
                  onClick={() => setShowMuteDialog(false)}
                  className="px-4 py-2 text-gray-700 font-medium hover:bg-gray-50 rounded-xl transition-colors">
                  Cancel
                </button>
                <button
                  onClick={handleAction}
                  disabled={isPending || !reason.trim()}
                  className="px-4 py-2 text-white font-medium bg-indigo-500 rounded-xl hover:bg-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
                  {isPending ? "Muting..." : "Mute User"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Reason Dialog */}
      <AnimatePresence>
        {showReasonDialog && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowReasonDialog(false)}>
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md bg-white rounded-2xl shadow-xl">
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  {actionType === "warn"
                    ? "Issue Warning"
                    : actionType === "remove_post"
                    ? "Remove Post"
                    : "Remove Comment"}
                </h3>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Reason
                  </label>
                  <textarea
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    rows={3}
                    className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                    placeholder="Provide a reason for this action..."
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2 px-6 py-4 border-t border-gray-100">
                <button
                  onClick={() => setShowReasonDialog(false)}
                  className="px-4 py-2 text-gray-700 font-medium hover:bg-gray-50 rounded-xl transition-colors">
                  Cancel
                </button>
                <button
                  onClick={handleAction}
                  disabled={isPending || !reason.trim()}
                  className="px-4 py-2 text-white font-medium bg-indigo-500 rounded-xl hover:bg-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
                  {isPending ? "Processing..." : "Confirm"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
