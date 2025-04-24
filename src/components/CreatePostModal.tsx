import { ChangeEvent, useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaGlobe,
  FaImage,
  FaTimes,
  FaLock,
  FaUsers,
  FaRegSmile,
} from "react-icons/fa";
import { useCreatePostMutation } from "../mutations";
import { PostVisibility } from "../types";
import {
  useCommunitiesQuery,
  useGetCreatedByCommunities,
  useJoinedCommunitiesQuery,
} from "../queries";
import useApp from "../hooks/useApp";
import EmojiPicker, { EmojiStyle } from "emoji-picker-react";
import useAuth from "../hooks/useAuth";

interface Props {
  communityId?: string;
  onClose: () => void;
}

const CreatePostModal = ({ communityId, onClose }: Props) => {
  const { showToast } = useApp();
  const { user, isAdmin, isSuperAdmin } = useAuth();

  const createPostMutation = useCreatePostMutation();
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const emojiPickerRef = useRef<HTMLDivElement>(null);
  const emojiButtonRef = useRef<HTMLButtonElement>(null);

  // State
  const [content, setContent] = useState("");
  const [selectedCommunityId, setSelectedCommunityId] = useState(
    communityId ?? ""
  );
  const [visibility, setVisibility] = useState<PostVisibility>(
    communityId ? "community_only" : "public"
  );
  const [mediaFiles, setMediaFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [showEmojis, setShowEmojis] = useState(false);
  const [charCount, setCharCount] = useState(0);
  const MAX_CHARS = 500;

  const { data: communities } = useCommunitiesQuery();
  const { data: joinedCommunities } = useJoinedCommunitiesQuery(user?.id ?? "");
  const { data: createdByCommunities } = useGetCreatedByCommunities(
    user?.id ?? ""
  );

  const communitiesToDisplay =
    isAdmin || isSuperAdmin
      ? communities
      : [...(joinedCommunities ?? []), ...(createdByCommunities ?? [])];

  // Auto-resizing textarea
  const adjustTextareaHeight = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  };

  // Update character count and resize textarea
  useEffect(() => {
    setCharCount(content.length);
    adjustTextareaHeight();
  }, [content]);

  // Handle clicks outside emoji picker
  useEffect(() => {
    if (!showEmojis) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (
        emojiPickerRef.current &&
        !emojiPickerRef.current.contains(e.target as Node) &&
        !emojiButtonRef.current?.contains(e.target as Node)
      ) {
        setShowEmojis(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showEmojis]);

  // Handlers
  const handleMediaChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);

    // Limit to 4 images total
    const totalFiles = mediaFiles.length + files.length;
    if (totalFiles > 4) {
      showToast({
        type: "info",
        title: "Maximum 4 images allowed",
        message: "Please remove some images before adding more",
      });
      return;
    }

    setMediaFiles((prev) => [...prev, ...files]);

    // Create preview URLs
    const newPreviewUrls = files.map((file) => URL.createObjectURL(file));
    setPreviewUrls((prev) => [...prev, ...newPreviewUrls]);
  };

  const removeMedia = (index: number) => {
    setMediaFiles((prev) => prev.filter((_, i) => i !== index));
    setPreviewUrls((prev) => {
      URL.revokeObjectURL(prev[index]);
      return prev.filter((_, i) => i !== index);
    });
  };

  const onEmojiClick = (emojiObject: { emoji: string }) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const cursorStart = textarea.selectionStart ?? content.length;
    const cursorEnd = textarea.selectionEnd ?? content.length;

    const newContent =
      content.slice(0, cursorStart) +
      emojiObject.emoji +
      content.slice(cursorEnd);

    setContent(newContent);

    // Move cursor after the inserted emoji
    setTimeout(() => {
      const newCursorPos = cursorStart + emojiObject.emoji.length;
      textarea.focus();
      textarea.setSelectionRange(newCursorPos, newCursorPos);
    }, 0);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!content.trim() && mediaFiles.length === 0) {
      showToast({
        type: "error",
        title: "Post cannot be empty",
        message: "Please add some text or media to your post",
      });
      return;
    }

    // Validate community selection for community posts
    if (visibility === "community_only" && !selectedCommunityId) {
      showToast({
        type: "error",
        title: "Please select a community",
        message: "A community is required for community-only posts",
      });
      return;
    }

    try {
      await createPostMutation.mutateAsync({
        content,
        visibility,
        communityId: selectedCommunityId,
        mediaFiles,
      });
      onClose();
    } catch (error) {
      // Error handling is managed by the mutation
      console.error(error);
    }
  };

  // Animation variants
  const backgroundVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.2 } },
    exit: { opacity: 0, transition: { duration: 0.2 } },
  };

  const modalVariants = {
    hidden: { scale: 0.9, opacity: 0, y: 20 },
    visible: {
      scale: 1,
      opacity: 1,
      y: 0,
      transition: { type: "spring", damping: 25, stiffness: 300 },
    },
    exit: { scale: 0.9, opacity: 0, y: 20, transition: { duration: 0.2 } },
  };

  return (
    <motion.div
      variants={backgroundVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}>
      <motion.div
        variants={modalVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[95dvh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <motion.h2
            initial={{ x: -10, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="text-xl font-bold text-gray-900">
            Create Post
          </motion.h2>
          <motion.button
            whileHover={{ scale: 1.1, rotate: 90 }}
            whileTap={{ scale: 0.9 }}
            aria-label="Close"
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-500 rounded-lg hover:bg-gray-50 transition-colors">
            <FaTimes className="w-5 h-5" />
          </motion.button>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="p-6 space-y-6">
          {/* Content */}
          <div className="relative">
            <textarea
              ref={textareaRef}
              value={content}
              onChange={(e) => setContent(e.target.value.slice(0, MAX_CHARS))}
              name="content"
              placeholder="What's on your mind?"
              className="w-full min-h-32 p-4 border border-gray-200 rounded-xl resize-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all placeholder:text-gray-400"
            />
            <div className="absolute bottom-3 right-3 text-xs text-gray-400 bg-white px-2 py-1 rounded-full">
              {charCount}/{MAX_CHARS}
            </div>
          </div>

          {/* Media Preview */}
          <AnimatePresence>
            {previewUrls.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ staggerChildren: 0.05 }}
                className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {previewUrls.map((url, index) => (
                  <motion.div
                    key={url}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="relative aspect-square group">
                    <img
                      src={url}
                      alt=""
                      className="w-full h-full object-cover rounded-xl shadow-md"
                    />
                    <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl" />
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      type="button"
                      onClick={() => removeMedia(index)}
                      className="absolute top-2 right-2 bg-black/50 text-white w-8 h-8 flex items-center justify-center rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                      <FaTimes className="w-4 h-4" />
                    </motion.button>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Settings Grid */}
          <div className="grid gap-6 md:grid-cols-2">
            {/* Visibility Selection */}
            <div className="space-y-3">
              <label
                htmlFor="visibility-select"
                className="block text-sm font-medium text-gray-700">
                Who can see your post?
              </label>
              <div className="flex flex-wrap gap-2">
                {!communityId && (
                  <>
                    <motion.button
                      whileHover={{ y: -2 }}
                      whileTap={{ y: 0 }}
                      type="button"
                      onClick={() => setVisibility("public")}
                      className={`flex items-center gap-2 px-4 py-2 rounded-xl border transition-all ${
                        visibility === "public"
                          ? "bg-indigo-50 border-indigo-200 text-indigo-600 shadow-sm"
                          : "border-gray-200 hover:bg-gray-50 text-gray-700"
                      }`}>
                      <FaGlobe className="w-4 h-4" />
                      Public
                    </motion.button>
                    <motion.button
                      whileHover={{ y: -2 }}
                      whileTap={{ y: 0 }}
                      type="button"
                      onClick={() => setVisibility("private")}
                      className={`flex items-center gap-2 px-4 py-2 rounded-xl border transition-all ${
                        visibility === "private"
                          ? "bg-indigo-50 border-indigo-200 text-indigo-600 shadow-sm"
                          : "border-gray-200 hover:bg-gray-50 text-gray-700"
                      }`}>
                      <FaLock className="w-4 h-4" />
                      Private
                    </motion.button>
                  </>
                )}

                {(isAdmin ||
                  isSuperAdmin ||
                  (joinedCommunities?.length ?? 0) > 0) && (
                  <motion.button
                    whileHover={{ y: -2 }}
                    whileTap={{ y: 0 }}
                    type="button"
                    onClick={() => setVisibility("community_only")}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl border transition-all ${
                      visibility === "community_only"
                        ? "bg-indigo-50 border-indigo-200 text-indigo-600 shadow-sm"
                        : "border-gray-200 hover:bg-gray-50 text-gray-700"
                    }`}>
                    <FaUsers className="w-4 h-4" />
                    Community
                  </motion.button>
                )}
              </div>
            </div>

            {/* Community Selection */}
            {visibility === "community_only" &&
              (isAdmin ||
                isSuperAdmin ||
                (joinedCommunities?.length ?? 0) > 0) && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-3">
                  <label
                    htmlFor="community-select"
                    className="block text-sm font-medium text-gray-700">
                    Select Community
                  </label>
                  <select
                    id="community-select"
                    aria-label="Select a community"
                    value={selectedCommunityId}
                    onChange={(e) => {
                      if (!communityId) {
                        setSelectedCommunityId(e.target.value);
                      }
                    }}
                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                    required={visibility === "community_only"}>
                    <option
                      value=""
                      disabled={Boolean(communityId)}>
                      Select a community
                    </option>
                    {communitiesToDisplay?.map((community) => (
                      <option
                        key={community.id}
                        value={community.id}
                        disabled={Boolean(
                          communityId && community.id !== communityId
                        )}>
                        {community.name}
                        {createdByCommunities?.some(
                          (c) => c.id === community.id
                        ) && " (Creator)"}
                      </option>
                    ))}
                  </select>
                </motion.div>
              )}
          </div>

          {/* Actions */}
          <div className="flex gap-3 flex-wrap items-center justify-between pt-4 border-t border-gray-100">
            <div className="flex gap-2">
              <motion.label
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl cursor-pointer transition-colors min-w-[fit-content]">
                <FaImage className="w-5 h-5" />
                Add Photos
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleMediaChange}
                  className="hidden"
                  disabled={previewUrls.length >= 4}
                  aria-label="Add photos"
                />
              </motion.label>

              <div className="relative">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="button"
                  ref={emojiButtonRef}
                  onClick={() => setShowEmojis(!showEmojis)}
                  className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-colors">
                  <FaRegSmile className="w-5 h-5" />
                  Emoji
                </motion.button>

                <AnimatePresence>
                  {showEmojis && (
                    <div
                      ref={emojiPickerRef}
                      className="absolute bottom-full left-0 mb-2 z-50">
                      <motion.div
                        initial={{ opacity: 0, scale: 0.8, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.8, y: 10 }}
                        className="shadow-lg rounded-xl overflow-hidden border border-gray-100">
                        <EmojiPicker
                          onEmojiClick={onEmojiClick}
                          width={320}
                          height={400}
                          searchDisabled={false}
                          lazyLoadEmojis={true}
                          emojiStyle={EmojiStyle.APPLE}
                        />
                      </motion.div>
                    </div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-xl transition-colors">
                Cancel
              </motion.button>
              <motion.button
                whileHover={
                  !createPostMutation.isPending ? { scale: 1.05 } : {}
                }
                whileTap={!createPostMutation.isPending ? { scale: 0.95 } : {}}
                type="submit"
                disabled={
                  (!content.trim() && mediaFiles.length === 0) ||
                  createPostMutation.isPending
                }
                className="px-6 py-2 text-white font-medium bg-gradient-to-r from-indigo-500 to-pink-500 rounded-xl hover:shadow-lg hover:shadow-indigo-500/25 disabled:opacity-50 disabled:cursor-not-allowed transition-all">
                {createPostMutation.isPending ? "Posting..." : "Post"}
              </motion.button>
            </div>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default CreatePostModal;
