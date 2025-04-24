import { useState, useEffect, ReactElement } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaPlus, FaCompass, FaBookmark, FaUserFriends } from "react-icons/fa";
import PostsFeed from "../components/PostsFeed";
import useAuth from "../hooks/useAuth";
import CreatePostModal from "../components/CreatePostModal";
import Avatar from "../components/Avatar";
import { TrendingUp } from "lucide-react";

const Posts = () => {
  const { user } = useAuth();
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Track scroll for hero section effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-[calc(100vh-4rem)]">
      {/* Hero Section with Parallax Effect */}
      <div
        className={`bg-gradient-to-br from-indigo-50 via-white to-pink-50 transition-all duration-300 ${
          scrolled ? "pt-6 pb-8" : "py-16"
        }`}>
        <div className="container relative overflow-hidden">
          {/* Background Shapes */}
          <div className="absolute inset-0 overflow-hidden opacity-20 pointer-events-none">
            <motion.div
              animate={{
                rotate: [0, 15],
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: 20,
                repeat: Infinity,
                repeatType: "reverse",
              }}
              className="absolute -top-20 -left-20 w-64 h-64 rounded-full bg-gradient-to-r from-indigo-300 to-indigo-400"
            />
            <motion.div
              animate={{
                rotate: [0, -10],
                scale: [1, 1.05, 1],
              }}
              transition={{
                duration: 15,
                repeat: Infinity,
                repeatType: "reverse",
              }}
              className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-gradient-to-r from-pink-300 to-purple-300"
            />
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-2xl mx-auto text-center relative z-10">
            <motion.h1
              className="text-4xl md:text-5xl font-black mb-4"
              animate={{ scale: scrolled ? 0.95 : 1 }}
              transition={{ duration: 0.3 }}>
              Discover Amazing{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-pink-500">
                Posts
              </span>
            </motion.h1>
            <motion.p
              className="text-gray-600 mb-8 md:text-lg"
              animate={{ opacity: scrolled ? 0.8 : 1 }}
              transition={{ duration: 0.3 }}>
              Explore thoughts, ideas, and stories from our vibrant community
            </motion.p>

            {/* Action Buttons - Enhanced with Animation */}
            <motion.div
              className="flex flex-wrap items-center justify-center gap-3"
              layout>
              {user && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowCreatePost(true)}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-500 to-pink-500 text-white font-medium rounded-xl hover:shadow-lg hover:shadow-indigo-500/30 transition-all">
                  <FaPlus className="w-4 h-4" />
                  Create Post
                </motion.button>
              )}
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Content Layout with Sidebar */}
      <div className="container py-12">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Left Sidebar */}
          <div className="md:w-64 lg:w-72 shrink-0">
            <div className=" bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
              {user && (
                <div className="flex items-center gap-3 pb-4 mb-4 border-b border-gray-100">
                  <Avatar
                    url={user.user_metadata.profile_picture_url}
                    username={user.user_metadata.username}
                    size="sm"
                  />
                  <div>
                    <div className="font-semibold text-gray-900">
                      {user.user_metadata.username}
                    </div>
                    <div className="text-xs text-gray-500">
                      @{user.user_metadata.username}
                    </div>
                  </div>
                </div>
              )}

              <nav className="space-y-1">
                <NavLink
                  icon={<FaCompass className="w-5 h-5" />}
                  label="Discover"
                  active
                />
                <NavLink
                  icon={<TrendingUp className="w-5 h-5" />}
                  label="Trending"
                />
                <NavLink
                  icon={<FaBookmark className="w-5 h-5" />}
                  label="Saved Posts"
                />
                <NavLink
                  icon={<FaUserFriends className="w-5 h-5" />}
                  label="Friends"
                />
              </nav>

              {/* Communities section */}
              <div className="mt-6 pt-4 border-t border-gray-100">
                <h3 className="font-semibold text-gray-800 mb-3">
                  Your Communities
                </h3>
                <div className="space-y-2">
                  <CommunityItem
                    name="Design Enthusiasts"
                    members="2.3k"
                  />
                  <CommunityItem
                    name="Tech Talks"
                    members="1.8k"
                  />
                  <CommunityItem
                    name="Travel Buddies"
                    members="4.2k"
                  />
                </div>
                <button className="mt-3 text-sm text-indigo-600 hover:text-indigo-800 font-medium">
                  See all communities
                </button>
              </div>
            </div>
          </div>

          {/* Main Content - Vertical Feed */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="flex-1">
            <div className="mb-6 flex justify-between items-center">
              <div className="flex items-baseline gap-2">
                <h2 className="text-xl font-bold text-gray-900">
                  Latest Posts
                </h2>
              </div>
            </div>
            <PostsFeed />
          </motion.div>
        </div>
      </div>

      {/* Create Post Modal */}
      <AnimatePresence>
        {showCreatePost && (
          <CreatePostModal onClose={() => setShowCreatePost(false)} />
        )}
      </AnimatePresence>
    </div>
  );
};

// Helper components for the sidebar
interface NavLinkProps {
  icon: ReactElement;
  label: string;
  active?: boolean;
}

const NavLink = ({ icon, label, active = false }: NavLinkProps) => (
  <button
    className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
      active
        ? "bg-gradient-to-r from-indigo-50 to-pink-50 text-indigo-600"
        : "text-gray-700 hover:bg-gray-50"
    }`}>
    {icon}
    <span className="font-medium">{label}</span>
  </button>
);

interface CommunityItemProps {
  name: string;
  members: string;
}

const CommunityItem = ({ name, members }: CommunityItemProps) => (
  <button className="flex items-center gap-3 group">
    <div className="w-9 h-9 bg-gradient-to-br from-indigo-200 to-pink-200 rounded-lg flex items-center justify-center text-indigo-600 font-bold text-sm">
      {name.charAt(0)}
    </div>
    <div className="flex-1 min-w-0">
      <div className="font-medium text-gray-800 truncate group-hover:text-indigo-600 transition-colors">
        {name}
      </div>
      <div className="text-xs text-gray-500">{members} members</div>
    </div>
  </button>
);

export default Posts;
