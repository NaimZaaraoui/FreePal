import {
  Camera,
  Loader2,
  SendHorizontal,
  Smile,
  X,
} from "lucide-react";
import { useMediaFiles } from "../hooks/useMediaFiles";
import { useAddCommentMutation, useUpdateCommentMutation } from "../mutations";
import { motion, AnimatePresence } from "framer-motion";
import React, { useEffect, useRef, useState } from "react";
import EmojiPicker, { EmojiStyle } from "emoji-picker-react";

interface Props {
  postId: string;
  commentId?: string | null;
  parentCommentId?: string | null;
  className?: string;
  onSuccess?: () => void;
  replyingTo?: string;
  initialContent?: string;
  initialMediaUrls?: string[];
}

const CommentForm = ({
  postId,
  commentId = null,
  parentCommentId = null,
  className,
  onSuccess,
  replyingTo,
  initialContent = "",
  initialMediaUrls = [],
}: Props) => {
  const [content, setContent] = useState(
    replyingTo ? `@${replyingTo} ` : initialContent
  );
  const [showEmojis, setShowEmojis] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const emojiPickerRef = useRef<HTMLDivElement>(null);
  const emojiButtonRef = useRef<HTMLButtonElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  // Add an effect to handle clicks outside
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

  const onEmojiClick = (emojiObject: { emoji: string }) => {
    const input = inputRef.current;
    if (!input) return;

    const cursorStart = input.selectionStart ?? 0;
    const cursorEnd = input.selectionEnd ?? 0;

    const text =
      content.slice(0, cursorStart) +
      emojiObject.emoji +
      content.slice(cursorEnd);
    setContent(text);
    setShowEmojis(false);

    // Set cursor position after emoji
    setTimeout(() => {
      const newCursorPos = cursorStart + emojiObject.emoji.length;
      input.focus();
      input.setSelectionRange(newCursorPos, newCursorPos);
    }, 0);
  };

  const handleEmojiButtonClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setShowEmojis(!showEmojis);
  };

  const {
    handleMediaChange,
    mediaFiles,
    previewUrls,
    removeMediaFile,
    keptInitialUrls,
  } = useMediaFiles(initialMediaUrls);

  const { mutate: addComment, isPending } = useAddCommentMutation();
  const { mutate: updateComment, isPending: isUpdating } =
    useUpdateCommentMutation();

  const addCommentAction = () => {
    // Don't add empty comments
    if (!content.trim() && !mediaFiles.length) return;

    if (commentId) {
      updateComment(
        {
          postId,
          commentId,
          content,
          mediaFiles,
          keptInitialUrls,
        },
        {
          onSuccess: () => {
            setContent("");
            onSuccess?.();
          },
        }
      );
      return;
    }

    addComment(
      {
        postId,
        content,
        mediaFiles,
        parentCommentId,
      },
      {
        onSuccess: () => {
          setContent("");
          onSuccess?.();
        },
      }
    );
  };

  // Calculate if button should be disabled
  const isDisabled =
    (!content.trim() && previewUrls.length === 0) || isPending || isUpdating;

  return (
    <div className="space-y-2 max-w-full">
      {replyingTo && (
        <motion.div
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-xs text-gray-500 mb-1 pl-2">
          Replying to{" "}
          <span className="font-medium text-indigo-600">@{replyingTo}</span>
        </motion.div>
      )}

      {previewUrls.length > 0 && (
        <div className="flex flex-wrap gap-2 pl-2 pt-1">
          <AnimatePresence>
            {previewUrls.map((url, index) => (
              <motion.div
                key={url}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.2 } }}
                className="relative group">
                <div className="w-12 h-12 rounded-lg ring-2 ring-white overflow-hidden shadow-sm">
                  <img
                    src={url}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                </div>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  aria-label="remove media"
                  type="button"
                  onClick={() => removeMediaFile(index)}
                  className="absolute -top-1 -right-1 w-5 h-5 bg-gray-900/80 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <X className="w-3 h-3 text-white" />
                </motion.button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      <motion.form
        ref={formRef}
        onSubmit={(e) => {
          e.preventDefault();
          addCommentAction();
        }}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className={`flex items-center gap-2 p-2 w-full ${className} relative`}>
        <motion.div
          animate={{
            boxShadow: isFocused
              ? "0 4px 12px rgba(99, 102, 241, 0.12)"
              : "0 1px 2px rgba(0, 0, 0, 0.05)",
          }}
          className={`
            flex-1 flex items-center gap-2 rounded-full 
            bg-white px-4 py-2 border 
            ${
              isFocused
                ? "border-indigo-400 ring-2 ring-indigo-100"
                : "border-gray-200"
            } 
            transition-all duration-200
          `}>
          <input
            type="text"
            placeholder={replyingTo ? "Write a reply..." : "Write a comment..."}
            className="flex-1 text-sm outline-none w-full min-w-0"
            ref={inputRef}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
          />
          <div className="flex items-center gap-2 flex-shrink-0">
            <label
              className={`cursor-pointer p-1.5 rounded-full ${
                previewUrls.length >= 4
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:bg-gray-100 text-gray-400 hover:text-indigo-500"
              } transition-colors`}
              aria-label="add media">
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleMediaChange}
                className="hidden"
                disabled={previewUrls.length >= 4}
              />
              <Camera className="w-4 h-4" />
            </label>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              aria-label="add emoji"
              type="button"
              onClick={handleEmojiButtonClick}
              ref={emojiButtonRef}
              className="p-1.5 rounded-full hover:bg-gray-100 text-gray-400 hover:text-indigo-500 transition-colors">
              <Smile className="w-4 h-4" />
            </motion.button>
            <AnimatePresence>
              {showEmojis && (
                <div
                  ref={emojiPickerRef}
                  className="absolute bottom-full right-0 mb-2 z-50">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.8, y: 10 }}
                    className="shadow-lg rounded-xl overflow-hidden border border-gray-100">
                    <EmojiPicker
                      onEmojiClick={onEmojiClick}
                      width={260}
                      height={340}
                      searchDisabled
                      lazyLoadEmojis={true}
                      emojiStyle={EmojiStyle.APPLE}
                    />
                  </motion.div>
                </div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
        <motion.button
          whileHover={isDisabled ? {} : { scale: 1.05 }}
          whileTap={isDisabled ? {} : { scale: 0.95 }}
          animate={{
            backgroundColor: isDisabled
              ? "rgb(203, 213, 225)"
              : isFocused
              ? "rgb(79, 70, 229)"
              : "rgb(99, 102, 241)",
          }}
          aria-label="send comment"
          type="submit"
          disabled={isDisabled}
          className="p-2.5 text-white rounded-full disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex-shrink-0">
          {isPending ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <SendHorizontal className="w-4 h-4" />
          )}
        </motion.button>
      </motion.form>
    </div>
  );
};

export default CommentForm;
