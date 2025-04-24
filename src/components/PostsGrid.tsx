import { usePostsQuery } from "../queries";
import { PostFeedType } from "../types";
import PostCard from "./PostCard";
import { motion } from "motion/react";

interface Props {
  type: PostFeedType;
  communityId?: string;
}

const PostsGrid = ({ type, communityId }: Props) => {
  const { data: posts, isLoading, isError } = usePostsQuery(type, communityId);

  if (isLoading) {
    return (
      <div className="space-y-6">
        {[...Array(4)].map((_, i) => (
          <motion.div
            key={i + 1}
            initial={{ opacity: 0.6 }}
            animate={{
              opacity: [0.6, 0.8, 0.6],
              transition: {
                repeat: Infinity,
                duration: 1.5,
                ease: "easeInOut",
              },
            }}
            className="bg-white rounded-3xl border border-gray-200 shadow-sm p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gray-200 rounded-full" />
              <div className="flex-1">
                <div className="h-4 w-28 bg-gray-200 rounded-full" />
                <div className="h-3 w-20 bg-gray-200 rounded-full mt-2" />
              </div>
            </div>
            <div className="mt-5 space-y-3">
              <div className="h-4 bg-gray-200 rounded-full w-full" />
              <div className="h-4 bg-gray-200 rounded-full w-5/6" />
              <div className="h-4 bg-gray-200 rounded-full w-4/6" />
              <div className="h-40 bg-gray-200 rounded-2xl w-full" />
            </div>
          </motion.div>
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center py-16 bg-red-50 rounded-3xl border border-red-100">
        <div className="text-red-500 text-lg font-medium mb-3">
          Failed to load posts
        </div>
        <p className="text-gray-600 mb-4">
          There was an error retrieving your feed.
        </p>
        <button
          onClick={() => window.location.reload()}
          className="bg-red-100 hover:bg-red-200 text-red-600 font-medium px-6 py-3 rounded-xl transition-colors">
          Try again
        </button>
      </div>
    );
  }

  if (!posts?.length) {
    return (
      <div className="text-center py-16 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
        <div className="w-20 h-20 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="32"
            height="32"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-gray-400">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
            <polyline points="17 8 12 3 7 8"></polyline>
            <line
              x1="12"
              y1="3"
              x2="12"
              y2="15"></line>
          </svg>
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          No posts found
        </h3>
        <p className="text-gray-500 max-w-md mx-auto">
          {type === "my"
            ? "You haven't created any posts yet. Start sharing with your community!"
            : "There are no posts to display at the moment. Check back later!"}
        </p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="w-full space-y-6">
      {posts.map((post, index) => (
        <motion.div
          key={post.id}
          variants={{
            hidden: { opacity: 0, y: 50 },
            show: { opacity: 1, y: 0 },
          }}
          initial="hidden"
          animate="show"
          transition={{
            duration: 0.5,
            delay: index * 0.1,
            ease: "easeOut",
          }}>
          <PostCard post={post} />
        </motion.div>
      ))}
    </motion.div>
  );
};

export default PostsGrid;
