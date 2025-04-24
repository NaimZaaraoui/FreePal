import { useParams, Link } from "react-router";
import { usePostQuery } from "../queries";
import { Loader2, ArrowLeft, MessageCircle, Share2 } from "lucide-react";
import Avatar from "../components/Avatar";
import { format } from "date-fns";
import PostComments from "../components/PostComments";
import CommentForm from "../components/CommentForm";
import { useCommunityMemberQuery } from "../queries/communities";
import useAuth from "../hooks/useAuth";
import ModeratorActions from "../components/community/ModeratorActions";
import { useState } from "react";
import ReactionButton from "../components/ReactionButton";
import { usePostReactions } from "../hooks/usePostReactions";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { FaEllipsisH } from "react-icons/fa";
import { useDeletePostMutation } from "../mutations/posts";
import { AnimatePresence, motion } from "motion/react";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";

const SinglePost = () => {
  const { id } = useParams<{ id: string }>();
  const { data: post, isLoading, error } = usePostQuery(id!);
  const { user } = useAuth();
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [showDeletePostModal, setShowDeletePostModal] = useState(false);

  // Check if user is a moderator or owner of the post
  const { data: member } = useCommunityMemberQuery(
    post?.community_id ?? "",
    user?.id ?? "",
    { enabled: !!post?.community_id && !!user?.id }
  );

  const isModerator = member?.role === "moderator" || member?.role === "admin";
  const isPostOwner = post?.author_id === user?.id;

  const canDeletePost = isPostOwner || isModerator;
  const canUpdatePost = isPostOwner;

  // Reactions functionality
  const {
    showReactions,
    setShowReactions,
    handleReaction,
    reactionsCount,
    currentReaction,
    reactionConfig,
  } = usePostReactions(post?.id ?? "", post?.reactions?.user_reaction?.type);

  const { mutate: deletePostMutation, isPending } = useDeletePostMutation();

  const handleDeletePost = async () => {
    try {
      deletePostMutation(post!.id);
      setShowDeletePostModal(false);
    } catch (error) {
      console.error("Failed to delete post:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-gradient-to-br from-indigo-50 to-pink-50">
        <div className="flex flex-col items-center gap-4 p-8 rounded-2xl bg-white shadow-lg">
          <div className="bg-gradient-to-r from-indigo-500 to-pink-500 p-3 rounded-full">
            <Loader2 className="w-8 h-8 animate-spin text-white" />
          </div>
          <p className="text-lg font-medium text-gray-700">
            Loading your post...
          </p>
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-indigo-50 to-pink-50 p-6">
        <div className="max-w-md mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-indigo-500 to-pink-500 h-24"></div>
          <div className="p-8 text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              {error instanceof Error ? error.message : "Failed to load post"}
            </h2>
            <p className="text-gray-500 mb-6">
              The post you're looking for might not exist or you may not have
              permission to view it.
            </p>
            <Link
              to="/posts"
              className="inline-flex items-center gap-2 px-6 py-3 text-white font-medium bg-gradient-to-r from-indigo-500 to-pink-500 rounded-xl hover:shadow-lg hover:opacity-90 transition-all">
              <ArrowLeft className="w-4 h-4" />
              Back to Posts
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (post.status === "removed") {
    return (
      <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-indigo-50 to-pink-50 p-6">
        <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-gray-500 to-gray-600 h-12"></div>
          <div className="p-8 text-center">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              This post has been removed by a moderator
            </h2>
            <p className="text-gray-500">
              This content is no longer available.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-indigo-50 to-pink-50 py-10 px-4">
      <div className="container max-w-3xl mx-auto">
        {/* Navigation */}
        <div className="mb-6">
          <Link
            to="/posts"
            className="inline-flex items-center gap-2 px-4 py-2 text-indigo-600 font-medium rounded-lg hover:bg-white hover:shadow-sm transition-all">
            <ArrowLeft className="w-4 h-4" />
            Back to Feed
          </Link>
        </div>

        {/* Post Card */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
          {/* Post Header */}
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <Link
                  to={`/users/${post.author.username}`}
                  className="block rounded-full p-0.5 bg-gradient-to-r from-indigo-500 to-pink-500">
                  <Avatar
                    url={post.author.profile_picture_url}
                    username={post.author.username}
                    size="md"
                    className="ring-2 ring-white"
                  />
                </Link>
                <div>
                  <Link
                    to={`/users/${post.author.username}`}
                    className="font-semibold text-gray-900 hover:text-indigo-600 transition-colors">
                    {post.author.username}
                  </Link>
                  <div className="text-sm text-gray-500">
                    {format(
                      new Date(post.created_at),
                      "MMM d, yyyy 'at' h:mm a"
                    )}
                  </div>
                </div>
              </div>

              <Menu
                as="div"
                className="relative">
                <MenuButton className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-50 transition-colors">
                  <FaEllipsisH className="w-4 h-4" />
                </MenuButton>
                <MenuItems className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden z-10">
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
                  {isModerator && post.community_id && (
                    <MenuItem>
                      <ModeratorActions
                        communityId={post.community_id}
                        targetUserId={post.author_id}
                        contentId={post.id}
                        type="post"
                      />
                    </MenuItem>
                  )}
                </MenuItems>
              </Menu>
            </div>

            {post.community_id && (
              <div className="mt-3 inline-block px-3 py-1 bg-gradient-to-r from-indigo-100 to-pink-100 rounded-full text-sm font-medium text-indigo-700">
                Community Post
              </div>
            )}
          </div>

          {/* Post Content */}
          <div className="p-6">
            <div className="prose max-w-none mb-6">
              <p className="text-lg text-gray-800 whitespace-pre-wrap">
                {post.content}
              </p>
            </div>

            {post.media_urls && post.media_urls.length > 0 && (
              <div className="mt-6">
                <div
                  className="relative group rounded-2xl overflow-hidden cursor-pointer"
                  onClick={() => {
                    setLightboxIndex(0);
                    setIsLightboxOpen(true);
                  }}>
                  {post.media_urls.length === 1 ? (
                    <motion.img
                      src={post.media_urls[0]}
                      alt=""
                      whileHover={{ scale: 1.03 }}
                      transition={{ duration: 0.3 }}
                      className="w-full rounded-xl object-cover shadow-md"
                    />
                  ) : (
                    <div className="grid grid-cols-2 gap-4">
                      {post.media_urls.slice(0, 4).map((url, index) => (
                        <motion.div
                          key={url}
                          whileHover={{ scale: 1.03 }}
                          transition={{ duration: 0.3 }}
                          onClick={(e) => {
                            e.stopPropagation();
                            setLightboxIndex(index);
                            setIsLightboxOpen(true);
                          }}>
                          <img
                            src={url}
                            alt=""
                            className="rounded-xl w-full h-48 object-cover shadow-md"
                          />
                        </motion.div>
                      ))}
                      {post.media_urls.length > 4 && (
                        <div className="relative">
                          <img
                            src={post.media_urls[4]}
                            alt=""
                            className="rounded-xl w-full h-48 object-cover brightness-50"
                          />
                          <div className="absolute inset-0 flex items-center justify-center text-white text-xl font-semibold">
                            +{post.media_urls.length - 4} more
                          </div>
                        </div>
                      )}
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

            {/* Engagement Stats */}
            <div className="flex items-center justify-between mt-8 pt-4 border-t border-gray-100">
              <div className="flex items-center gap-6">
                {/* Reactions Button */}
                <ReactionButton
                  count={post.reactions?.count || 0}
                  showReactions={showReactions}
                  setShowReactions={setShowReactions}
                  handleReaction={handleReaction}
                  currentReaction={currentReaction}
                  reactionConfig={reactionConfig}
                  reactionsCount={reactionsCount}
                />

                <button className="flex items-center gap-1.5 text-gray-500 hover:text-indigo-500 transition-colors">
                  <MessageCircle className="w-5 h-5" />
                  <span className="text-sm font-medium">
                    {post.comments || 0}
                  </span>
                </button>
              </div>

              <button className="flex items-center gap-1.5 text-gray-500 hover:text-indigo-500 transition-colors">
                <Share2 className="w-5 h-5" />
                <span className="text-sm font-medium">Share</span>
              </button>
            </div>
          </div>

          {/* Comments Section */}
          <div className="bg-gradient-to-r from-indigo-50 to-pink-50">
            <div className="p-6">
              <h3 className="font-semibold text-gray-900 mb-6 flex items-center gap-2">
                <MessageCircle className="w-5 h-5 text-indigo-500" />
                Comments
              </h3>

              <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
                <CommentForm postId={post.id} />
              </div>

              <div className="space-y-4">
                <PostComments
                  postId={post.id}
                  communityId={post.community_id ?? undefined}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

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
              className="bg-white rounded-xl shadow-lg p-6 max-w-sm w-full mx-4">
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
                  className="px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-pink-500 text-white hover:opacity-90 disabled:opacity-50 transition-colors">
                  {isPending ? "Deleting..." : "Delete"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SinglePost;
