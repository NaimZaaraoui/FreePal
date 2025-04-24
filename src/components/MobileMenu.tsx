import { useEffect, useRef } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  HelpCircle,
  Home,
  LogOut,
  Search,
  Settings,
  User,
  Users,
  X,
  MessageCircle,
  Compass,
  Bell,
} from "lucide-react";
import { BsPostcard } from "react-icons/bs";
import { Link } from "react-router";
import useAuth from "../hooks/useAuth";
import Avatar from "./Avatar";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const MobileMenu = ({ isOpen, onClose }: Props) => {
  const { user, signOut } = useAuth();
  const containerRef = useRef(null);

  // Close menu when pressing escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  // Prevent scrolling when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  return (
    <AnimatePresence mode="wait">
      {isOpen && (
        <>
          {/* Backdrop with blur effect */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-gray-900/30 backdrop-blur-sm z-40"
            onClick={onClose}
          />

          {/* Menu Panel */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            ref={containerRef}
            className="fixed top-0 right-0 bottom-0 w-full max-w-sm z-50 overflow-hidden">
            {/* Background with gradient border */}
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 via-purple-500/20 to-pink-500/20 p-[1px] rounded-l-2xl">
              <div className="absolute inset-0 bg-white rounded-l-2xl" />
            </div>

            {/* Content */}
            <div className="relative h-full flex flex-col z-10 overflow-hidden">
              {/* Header */}
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="flex items-center justify-between p-5 border-b border-gray-100">
                <Link
                  to="/"
                  className="flex items-center gap-3 group"
                  onClick={onClose}>
                  <motion.div
                    className="relative"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}>
                    <Avatar
                      url="./logo.png"
                      size="sm"
                      className="ring-2 ring-indigo-100"
                    />
                  </motion.div>
                  <div>
                    <h1 className="text-lg font-black tracking-tight flex items-center">
                      <motion.span
                        className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-500 to-pink-500"
                        animate={{ backgroundPosition: ["0%", "100%", "0%"] }}
                        transition={{ duration: 5, repeat: Infinity }}>
                        Free
                      </motion.span>
                      <span className="text-gray-900">Pal</span>
                    </h1>
                    <p className="text-[10px] uppercase tracking-[0.2em] text-gray-500 font-medium -mt-1">
                      Connect & Share
                    </p>
                  </div>
                </Link>

                <motion.button
                  onClick={onClose}
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  className="p-2 rounded-full hover:bg-gray-100"
                  aria-label="Close menu">
                  <X className="w-5 h-5 text-gray-500" />
                </motion.button>
              </motion.div>

              {/* User Profile Section - Show when logged in */}
              {user && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="px-5 py-4 border-b border-gray-100">
                  <div className="flex items-center gap-3">
                    <Avatar
                      url={user.user_metadata?.profile_picture_url}
                      size="md"
                      className="ring-2 ring-indigo-100"
                    />
                    <div>
                      <h3 className="font-medium text-gray-900">
                        {user.user_metadata?.username}
                      </h3>
                      <p className="text-xs text-gray-500 truncate">
                        {user.email}
                      </p>
                    </div>
                  </div>

                  {/* Quick stats */}
                  <div className="flex justify-between mt-4 bg-gray-50 rounded-xl p-3">
                    <div className="text-center">
                      <p className="text-xs text-gray-500">Posts</p>
                      <p className="text-sm font-semibold text-gray-900">24</p>
                    </div>
                    <div className="text-center border-x border-gray-200 px-5">
                      <p className="text-xs text-gray-500">Following</p>
                      <p className="text-sm font-semibold text-gray-900">128</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-gray-500">Followers</p>
                      <p className="text-sm font-semibold text-gray-900">85</p>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Search Input */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="relative px-5 py-4">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search anything..."
                    className="w-full pl-10 pr-4 py-2.5 text-sm bg-gray-50 border-0 
                    rounded-xl ring-1 ring-gray-200 
                    placeholder:text-gray-400 text-gray-700
                    focus:outline-none focus:ring-2 focus:ring-indigo-400"
                  />
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <Search className="h-4 w-4 text-gray-400" />
                  </div>
                </div>
              </motion.div>

              {/* Navigation Links */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="flex-grow overflow-y-auto px-3 py-2">
                <nav className="space-y-1">
                  {[
                    { icon: <Home size={18} />, label: "Home", to: "/" },
                    { icon: <BsPostcard />, label: "Posts", to: "/posts" },
                    {
                      icon: <MessageCircle size={18} />,
                      label: "Messages",
                      to: "/messages",
                    },
                    {
                      icon: <Users size={18} />,
                      label: "Communities",
                      to: "/communities",
                    },
                    {
                      icon: <Compass size={18} />,
                      label: "Explore",
                      to: "/explore",
                    },
                    user && {
                      icon: <Bell size={18} />,
                      label: "Notifications",
                      to: "/notifications",
                    },
                    user && {
                      icon: <User size={18} />,
                      label: "Profile",
                      to: `/profile/${user.user_metadata?.username}`,
                    },
                  ]
                    .filter(Boolean)
                    .map((item, index) => (
                      <motion.div
                        key={item?.to}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 + index * 0.1 }}>
                        <Link
                          to={item!.to}
                          onClick={onClose}
                          className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-700 hover:bg-gray-50 transition-colors">
                          <div className="flex-shrink-0 text-gray-500">
                            {item!.icon}
                          </div>
                          <span className="font-medium">{item!.label}</span>
                        </Link>
                      </motion.div>
                    ))}
                </nav>

                {/* Divider */}
                <div className="h-px w-full bg-gradient-to-r from-transparent via-gray-200 to-transparent my-4" />

                {/* Secondary Navigation */}
                <nav className="space-y-1">
                  {[
                    {
                      icon: <Settings size={18} />,
                      label: "Settings",
                      to: "/settings",
                    },
                    {
                      icon: <HelpCircle size={18} />,
                      label: "Help Center",
                      to: "/help",
                    },
                  ].map((item, index) => (
                    <motion.div
                      key={item.to}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.6 + index * 0.1 }}>
                      <Link
                        to={item.to}
                        onClick={onClose}
                        className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-700 hover:bg-gray-50 transition-colors">
                        <div className="flex-shrink-0 text-gray-500">
                          {item.icon}
                        </div>
                        <span className="font-medium">{item.label}</span>
                      </Link>
                    </motion.div>
                  ))}
                </nav>
              </motion.div>

              {/* Bottom Section with Sign-Out/Sign-Up */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="p-5 border-t border-gray-100">
                {user ? (
                  <button
                    onClick={() => {
                      signOut();
                      onClose();
                    }}
                    className="flex items-center justify-center gap-2 w-full p-3 
                    text-red-600 font-medium bg-red-50 hover:bg-red-100 
                    rounded-xl transition-colors">
                    <LogOut size={18} />
                    <span>Sign out</span>
                  </button>
                ) : (
                  <div className="space-y-3">
                    <Link
                      to="/login"
                      onClick={onClose}
                      className="flex items-center justify-center gap-2 w-full p-3
                      text-gray-700 font-medium border border-gray-200
                      rounded-xl hover:bg-gray-50 transition-colors">
                      <span>Log in</span>
                    </Link>
                    <Link
                      to="/signup"
                      onClick={onClose}
                      className="flex items-center justify-center gap-2 w-full p-3
                      text-white font-medium bg-gradient-to-r from-indigo-600 to-pink-500
                      rounded-xl hover:shadow-md transition-all">
                      <span>Sign up for free</span>
                    </Link>
                  </div>
                )}
              </motion.div>

              {/* App version */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="px-5 py-2 text-xs text-center text-gray-400">
                FreePal v1.0.0
              </motion.div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
