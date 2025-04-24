import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useGetPostCommentsQuery } from "../queries";
import Comment from "./Comment";
import { buildCommentsTree } from "../utils/posts";
import { Loader2 } from "lucide-react";

interface Props {
  postId: string;
  communityId?: string;
}

const PostComments = ({ postId, communityId }: Props) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const { data: comments, isLoading } = useGetPostCommentsQuery(postId);

  if (!comments?.length && !isLoading) return null;

  const commentsTree = buildCommentsTree(comments || []);
  const displayComments = isExpanded ? commentsTree : commentsTree.slice(0, 3);
  const hasMoreComments = commentsTree.length > 3;

  return (
    <div className="space-y-2 max-w-full">
      <h3 className="text-sm font-medium text-gray-700 mb-3 flex items-center">
        <span className="inline-block w-1 h-4 bg-indigo-500 rounded mr-2"></span>
        {comments?.length} {comments?.length === 1 ? "Comment" : "Comments"}
      </h3>

      {isLoading ? (
        <div className="flex justify-center py-8">
          <Loader2 className="w-6 h-6 text-indigo-400 animate-spin" />
        </div>
      ) : (
        <>
          <div className="space-y-3">
            <AnimatePresence mode="sync">
              {displayComments.map((comment) => (
                <Comment
                  key={comment.id}
                  comment={comment}
                  postId={postId}
                  communityId={communityId}
                />
              ))}
            </AnimatePresence>
          </div>

          {hasMoreComments && (
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setIsExpanded(!isExpanded)}
              className={`mt-4 text-sm font-medium px-4 py-2 rounded-full transition-all ${
                isExpanded
                  ? "text-gray-600 hover:text-gray-800 bg-gray-100 hover:bg-gray-200"
                  : "text-indigo-600 hover:text-indigo-800 bg-indigo-50 hover:bg-indigo-100"
              }`}>
              {isExpanded
                ? "Show less"
                : `View ${commentsTree.length - 3} more comments`}
            </motion.button>
          )}
        </>
      )}
    </div>
  );
};

export default PostComments;
