import { useState } from "react";
import { CommentTree } from "../utils/posts";
import CommentForm from "./CommentForm";
import Avatar from "./Avatar";
import { formatDistanceToNow } from "date-fns";
import { motion, AnimatePresence } from "motion/react";
import { ChevronRight, MessageCircle, MoreVertical, X } from "lucide-react";
import { Link } from "react-router";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import useAuth from "../hooks/useAuth";
import { useDeleteCommentMutation } from "../mutations";
import useCommunity from "../hooks/useCommunity";

interface Props {
  comment: CommentTree;
  level?: number;
  parentAuthorUsername?: string;
  postId: string;
  communityId?: string;
}

const Comment = ({
  comment,
  level = 0,
  parentAuthorUsername,
  postId,
  communityId,
}: Props) => {
  const [isReplying, setIsReplying] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showAllReplies, setShowAllReplies] = useState(false);
  const { user } = useAuth();
  const isAuthor = user?.id === comment.author_id;
  const maxVisualLevel = 1; // Maximum nesting level before collapsing
  const isDeepNested = level > 0;

  const { canManageMembers } = useCommunity(communityId ?? "", user?.id);

  const { mutate: deleteComment, isPending: isDeleting } =
    useDeleteCommentMutation();

  const renderCommentContent = () => {
    if (isEditing) {
      return (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="relative">
          <CommentForm
            postId={postId}
            commentId={comment.id}
            initialContent={comment.content}
            initialMediaUrls={comment.media_urls}
            onSuccess={() => setIsEditing(false)}
          />
          {/* Cancel button */}
          <div className="absolute -top-6 right-2">
            <button
              aria-label="cancel edit"
              onClick={() => setIsEditing(false)}
              className="p-2 text-gray-400 hover:text-gray-500 bg-gray-50 rounded-full hover:bg-red-50 transition-colors">
              <X className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      );
    }

    if (isDeleting) {
      return (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="bg-gray-50 rounded-2xl px-4 py-2 flex items-center gap-2">
          <div className="w-4 h-4 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin" />
          <span className="text-sm text-gray-500">Deleting comment...</span>
        </motion.div>
      );
    }

    return (
      <div className="bg-gray-50 rounded-2xl px-4 py-2">
        <div className="flex items-start justify-between gap-2">
          <Link
            to={`/users/${comment.author.username}`}
            className="font-medium text-gray-900 hover:text-indigo-600 transition-colors">
            {comment.author.username}
          </Link>

          {(isAuthor || canManageMembers) && (
            <Menu
              as="div"
              className="relative z-99">
              <MenuButton className="p-1 rounded-lg hover:bg-gray-100">
                <MoreVertical className="w-4 h-4 text-gray-500" />
              </MenuButton>
              <MenuItems className="absolute right-0 mt-1 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-1 z-10">
                <MenuItem>
                  <button
                    className={`data-[focus]:bg-gray-50 w-full px-4 py-2 text-left text-sm text-red-600`}
                    onClick={() => {
                      deleteComment({ postId, commentId: comment.id, communityId });
                    }}>
                    {isDeleting ? "Deleting..." : "Delete"}
                  </button>
                </MenuItem>
                {isAuthor && (
                  <MenuItem>
                    <button
                      className={`data-[focus]:bg-gray-50 w-full px-4 py-2 text-left text-sm text-gray-900`}
                      onClick={() => {
                        setIsEditing(true);
                      }}>
                      Edit
                    </button>
                  </MenuItem>
                )}
              </MenuItems>
            </Menu>
          )}
        </div>

        <p className="text-gray-700 text-sm break-words">{comment.content}</p>

        {comment.media_urls?.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {comment.media_urls.map((url) => (
              <img
                key={url}
                src={url}
                alt=""
                className="w-20 h-20 rounded-lg object-cover"
              />
            ))}
          </div>
        )}
      </div>
    );
  };

  const renderComment = () => (
    <>
      {/* Reply indicator for nested comments */}
      {isDeepNested && parentAuthorUsername && (
        <div className="flex items-center text-xs text-gray-500 mb-2">
          <ChevronRight className="w-3 h-3 mr-1" />
          <span>
            Reply to{" "}
            <span className="font-medium">@{parentAuthorUsername}</span>
          </span>
        </div>
      )}

      <div className="flex gap-3">
        <Link to={`/users/${comment.author.username}`}>
          <Avatar
            url={comment.author.profile_picture_url}
            size="sm"
            username={comment.author.username}
          />
        </Link>

        <div className="flex-1 min-w-0 max-w-full">
          <AnimatePresence
            mode="wait"
            initial={false}>
            {renderCommentContent()}
          </AnimatePresence>

          <div className="flex items-center gap-4 mt-2 pl-4">
            <time className="text-xs text-gray-500">
              {formatDistanceToNow(new Date(comment.created_at), {
                addSuffix: true,
              })}
            </time>
            {user && (
              <button
                onClick={() => setIsReplying(!isReplying)}
                className="text-xs text-gray-500 hover:text-gray-700 flex items-center gap-1.5">
                <MessageCircle className="w-3 h-3" />
                {isReplying ? "Cancel" : "Reply"}
              </button>
            )}
          </div>

          {/* Reply Form */}
          <AnimatePresence mode="wait">
            {isReplying && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-3 w-full">
                <CommentForm
                  postId={comment.post_id}
                  parentCommentId={comment.id}
                  onSuccess={() => setIsReplying(false)}
                  className="bg-white"
                  replyingTo={comment.author.username}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </>
  );

  const renderNestedComments = () => {
    if (!comment.children?.length) return null;

    return (
      <div className="space-y-0">
        {/* For deeply nested comments, show limited replies and a "view more" button */}
        {level >= maxVisualLevel && !showAllReplies ? (
          <>
            {/* Show just the first reply */}
            <Comment
              key={comment.children[0].id}
              comment={comment.children[0]}
              level={level + 1}
              parentAuthorUsername={comment.author.username}
              postId={postId}
            />

            {/* Show view full conversation button if more replies exist */}
            {comment.children.length > 1 && (
              <div className="mt-3 ml-4">
                <Link
                  to={`/posts/${postId}/comments/${comment.id}`}
                  className="inline-flex items-center px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 text-xs font-medium rounded-full transition-colors">
                  View full conversation ({comment.children.length - 1} more{" "}
                  {comment.children.length - 1 === 1 ? "reply" : "replies"})
                </Link>
              </div>
            )}
          </>
        ) : (
          <>
            {/* Show toggle option when there are many replies but we're not yet at maxVisualLevel */}
            {level === maxVisualLevel - 1 &&
            comment.children.length > 2 &&
            !showAllReplies ? (
              <>
                {/* Show first two replies */}
                {comment.children.slice(0, 2).map((child) => (
                  <Comment
                    key={child.id}
                    comment={child}
                    level={level + 1}
                    parentAuthorUsername={comment.author.username}
                    postId={postId}
                  />
                ))}

                {/* Show "show more" button */}
                <button
                  onClick={() => setShowAllReplies(true)}
                  className="mt-2 text-sm text-indigo-600 hover:text-indigo-800 font-medium transition-colors">
                  Show {comment.children.length - 2} more{" "}
                  {comment.children.length - 2 === 1 ? "reply" : "replies"}
                </button>
              </>
            ) : (
              // Show all replies (or when showAllReplies is true)
              comment.children.map((child) => (
                <Comment
                  key={child.id}
                  comment={child}
                  level={level + 1}
                  parentAuthorUsername={comment.author.username}
                  postId={postId}
                />
              ))
            )}

            {/* Show "show less" button when expanded */}
            {showAllReplies && (
              <button
                onClick={() => setShowAllReplies(false)}
                className="mt-2 text-sm text-gray-500 hover:text-gray-700">
                Show less
              </button>
            )}
          </>
        )}
      </div>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`border-t border-gray-100 pt-3 ${
        level === 0 ? "mt-4" : "mt-3"
      }`}>
      {/* Render comment content */}
      {renderComment()}

      {/* Render nested comments */}
      {renderNestedComments()}
    </motion.div>
  );
};

export default Comment;
