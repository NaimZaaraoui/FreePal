import { Link } from "react-router";
import { formatDistanceToNow } from "date-fns";
import { AnimatePresence, motion } from "motion/react";
import { FaEllipsisH } from "react-icons/fa";
import { PostWithRelations } from "../types";
import Avatar from "./Avatar";
import { useState } from "react";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { MessageCircle } from "lucide-react";
import { usePostReactions } from "../hooks/usePostReactions";
import ReactionButton from "./ReactionButton";
import CommentForm from "./CommentForm";
import PostComments from "./PostComments";
import useAuth from "../hooks/useAuth";
import useCommunity from "../hooks/useCommunity";
import { useDeletePostMutation } from "../mutations/posts";

interface Props {
  post: PostWithRelations;
}

const PostCard = ({ post }: Props) => {
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [lightboxIndex] = useState(0);
  const [showComments, setShowComments] = useState(false);
  const [showDeletePostModal, setShowDeletePostModal] = useState(false);

  const { user } = useAuth();
  const isPostOwner = post.author_id === user?.id;
  const { isCreator, isCommunityAdmin, isGlobalAdmin, isSuperAdmin } =
    useCommunity(post.community_id ?? "");

  const canDeletePost =
    isPostOwner ||
    isCreator ||
    isCommunityAdmin ||
    isGlobalAdmin ||
    isSuperAdmin;
  const canUpdatePost = isPostOwner;

  const {
    showReactions,
    setShowReactions,
    handleReaction,
    reactionsCount,
    currentReaction,
    reactionConfig,
  } = usePostReactions(post.id, post.reactions.user_reaction?.type);

  const { mutate: deletePostMutation, isPending } = useDeletePostMutation();

  const handleDeletePost = async () => {
    try {
      deletePostMutation(post.id);
      setShowDeletePostModal(false);
    } catch (error) {
      // Handle error if needed
      console.error("Failed to delete post:", error);
    }
  };

  return (
    <>
      <motion.article
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="bg-white rounded-3xl shadow-sm shadow-slate-600/20 hover:shadow-xl hover:shadow-indigo-500/10 transition-all duration-300 p-6 grid gap-5 h-fit border border-gray-100">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Link
            to={`/users/${post.author.username}`}
            className="group relative">
            <Avatar
              url={post.author.profile_picture_url}
              username={post.author.username}
              size="sm"
            />
            <motion.span
              initial={false}
              animate={{ opacity: 0, y: 10 }}
              whileHover={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              className="absolute -bottom-2 left-1/2 -translate-x-1/2 text-xs font-medium bg-black/80 text-white px-3 py-1 rounded-full whitespace-nowrap shadow-lg z-10">
              View profile
            </motion.span>
          </Link>

          <div className="flex-1 min-w-0">
            <div className="grid">
              <Link
                to={`/users/${post.author.username}`}
                className="font-semibold text-gray-900 hover:text-indigo-600 truncate transition-colors">
                {post.author.username}
              </Link>
              <time
                className="text-xs text-gray-500"
                dateTime={post.created_at}>
                {formatDistanceToNow(new Date(post.created_at), {
                  addSuffix: true,
                })}
              </time>
            </div>
          </div>

          <Menu
            as="div"
            className="relative">
            <MenuButton className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-50 transition-colors">
              <FaEllipsisH className="w-4 h-4" />
            </MenuButton>
            <MenuItems className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden z-10">
              <MenuItem>
                <Link
                  to={`/posts/${post.id}`}
                  className="block data-[focus]:bg-gray-50 w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors">
                  Read full post
                </Link>
              </MenuItem>
              {canUpdatePost && (
                <MenuItem>
                  <Link
                    to={`/posts/${post.id}/edit`}
                    className="block data-[focus]:bg-gray-50 w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors">
                    Edit post
                  </Link>
                </MenuItem>
              )}
              {canDeletePost && (
                <MenuItem>
                  <button
                    onClick={() => setShowDeletePostModal(true)}
                    className="block data-[focus]:bg-gray-50 w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors">
                    Delete post
                  </button>
                </MenuItem>
              )}
            </MenuItems>
          </Menu>
        </div>

        {/* Content Preview */}
        <div className="grid gap-3">
          <p className="text-gray-800 text-base leading-relaxed line-clamp-3">
            {post.content}
          </p>
          {post.content.length > 180 && (
            <Link
              to={`/posts/${post.id}`}
              className="inline-block mt-1 text-sm font-medium text-indigo-600 hover:text-indigo-800 transition-colors">
              Read more
            </Link>
          )}

          {/* Media Preview */}
          {post.media_urls && post.media_urls.length > 0 && (
            <div
              className="relative group mt-2 rounded-2xl overflow-hidden cursor-pointer"
              onClick={() => setIsLightboxOpen(true)}>
              <div
                className={`aspect-video overflow-hidden ${
                  post.media_urls.length > 1 ? "relative" : ""
                }`}>
                <motion.img
                  src={post.media_urls[0]}
                  alt=""
                  whileHover={{ scale: 1.03 }}
                  transition={{ duration: 0.3 }}
                  className="w-full h-full object-cover transition duration-300"
                />
                {post.media_urls.length > 1 && (
                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center backdrop-blur-sm">
                    <span className="text-white text-lg font-semibold px-4 py-2 bg-black/40 rounded-full">
                      +{post.media_urls.length - 1} more
                    </span>
                  </div>
                )}
              </div>
              <Lightbox
                open={isLightboxOpen}
                close={() => setIsLightboxOpen(false)}
                index={lightboxIndex}
                slides={post.media_urls.map((url) => ({ src: url }))}
                carousel={{ finite: post.media_urls.length <= 1 }}
                styles={{
                  container: { backgroundColor: "rgb(0, 0, 0, .95)" },
                  button: { filter: "drop-shadow(0 0 1px rgb(0, 0, 0, .5))" },
                }}
              />
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="grid gap-4">
          <div className="flex items-center gap-6 border-t border-gray-100 pt-4">
            <div className="flex gap-4">
              <ReactionButton
                count={post.reactions.count}
                showReactions={showReactions}
                setShowReactions={setShowReactions}
                handleReaction={handleReaction}
                currentReaction={currentReaction}
                reactionConfig={reactionConfig}
                reactionsCount={reactionsCount}
              />
              <button
                onClick={() => setShowComments(!showComments)}
                className="flex items-center gap-2 text-gray-500 hover:text-indigo-600 transition-colors">
                <MessageCircle className="w-5 h-5" />
                <span className="text-sm font-medium">
                  {post.comments || 0}
                </span>
              </button>
            </div>
          </div>
          <AnimatePresence>
            {showComments && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="space-y-4">
                <CommentForm postId={post.id} />
                <PostComments postId={post.id} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.article>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {showDeletePostModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="bg-white rounded-xl shadow-lg p-6 max-w-sm w-full">
              <h3 className="text-lg font-semibold mb-4">Confirm Delete</h3>
              <p className="mb-6 text-gray-700">
                Are you sure you want to delete this post? This action cannot be
                undone.
              </p>
              <div className="flex justify-end gap-4">
                <button
                  onClick={() => setShowDeletePostModal(false)}
                  className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-100 transition-colors">
                  Cancel
                </button>
                <button
                  onClick={handleDeletePost}
                  disabled={isPending}
                  className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 disabled:opacity-50 transition-colors">
                  {isPending ? "Deleting..." : "Delete"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default PostCard;
