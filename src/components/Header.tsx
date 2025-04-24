import { Link } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import {
  Search,
  Bell,
  Home,
  Users,
  User,
  Settings,
  Shield,
  LogOut,
  Menu,
  MessageCircle,
  Compass,
} from "lucide-react";
import useAuth from "../hooks/useAuth";
import { useState, useEffect, useRef } from "react";
import Avatar from "./Avatar";
import NavItem from "./NavItem";
import { BsPostcard } from "react-icons/bs";
import useOnClickOutside from "../hooks/useOnClickOutside";
import { MobileMenu } from "./MobileMenu";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, signOut } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement>(null);

  // State and ref for notification menu
  const [isNotificationMenuOpen, setIsNotificationMenuOpen] = useState(false);
  const notificationMenuRef = useRef<HTMLDivElement>(null);

  useOnClickOutside(profileMenuRef, () => setIsProfileMenuOpen(false));
  useOnClickOutside(notificationMenuRef, () =>
    setIsNotificationMenuOpen(false)
  );

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300
        ${isScrolled ? "bg-white shadow-md" : "bg-white/90 backdrop-blur-xl"}`}
        role="banner"
        aria-label="Primary header">
        <div className="py-3 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 gap-6">
            {/* Logo */}
            <Link
              to="/"
              className="flex items-center gap-3 group">
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
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="hidden sm:block">
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
              </motion.div>
            </Link>

            {/* Search Bar - Moved before Navigation for better layout */}
            <motion.div
              className="hidden lg:block flex-1 max-w-md"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}>
              <div className="relative group">
                <input
                  type="text"
                  placeholder="Search anything..."
                  className="w-full pl-10 pr-12 py-2 text-sm bg-gray-50/80 border-0 
                  rounded-full shadow-sm ring-1 ring-gray-200/70 
                  placeholder:text-gray-400 text-gray-700
                  focus:outline-none focus:ring-2 focus:ring-indigo-400/80
                  focus:bg-white transition-all duration-300
                  group-hover:ring-gray-300 group-hover:shadow-md"
                />
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Search className="h-4 w-4 text-gray-400 group-focus-within:text-indigo-500 transition-colors duration-300" />
                </div>

                {/* Keyboard Shortcut Hint */}
                <div className="hidden absolute inset-y-0 right-0 pr-3.5 items-center md:flex">
                  <kbd
                    className="hidden sm:inline-flex items-center justify-center gap-1 px-1.5 py-0.5 text-xs 
                    font-medium text-gray-500 bg-gray-100 rounded-md shadow-sm 
                    group-hover:bg-gray-200 transition-colors duration-200">
                    <span className="text-xs">⌘</span>
                    <span>K</span>
                  </kbd>

                  {/* Enhanced Hover Effect */}
                  <motion.div
                    className="absolute inset-0 -z-10 rounded-full opacity-0 group-hover:opacity-100 pointer-events-none"
                    style={{
                      background:
                        "radial-gradient(circle, rgba(236,240,255,0.6) 0%, rgba(243,244,246,0) 70%)",
                    }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
              </div>
            </motion.div>

            {/* Navigation - Desktop */}
            <motion.nav
              className="hidden md:flex items-center gap-1"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}>
              <motion.ul
                className="flex gap-1"
                variants={{
                  show: {
                    transition: { staggerChildren: 0.1 },
                  },
                }}
                initial="hidden"
                animate="show">
                <motion.li
                  variants={{
                    hidden: { opacity: 0, y: -20 },
                    show: { opacity: 1, y: 0 },
                  }}>
                  <NavItem
                    icon={<Home size={18} />}
                    label="Home"
                    to="/"
                  />
                </motion.li>

                {user && (
                  <>
                    <motion.li
                      variants={{
                        hidden: { opacity: 0, y: -20 },
                        show: { opacity: 1, y: 0 },
                      }}>
                      <NavItem
                        icon={<BsPostcard />}
                        label="Posts"
                        to="/posts"
                      />
                    </motion.li>
                    <motion.li
                      variants={{
                        hidden: { opacity: 0, y: -20 },
                        show: { opacity: 1, y: 0 },
                      }}>
                      <NavItem
                        icon={<Users size={18} />}
                        label="Communities"
                        to="/communities"
                      />
                    </motion.li>
                    <motion.li
                      variants={{
                        hidden: { opacity: 0, y: -20 },
                        show: { opacity: 1, y: 0 },
                      }}>
                      <NavItem
                        icon={<MessageCircle size={18} />}
                        label="Messages"
                        to="/messages"
                      />
                    </motion.li>
                    <motion.li
                      variants={{
                        hidden: { opacity: 0, y: -20 },
                        show: { opacity: 1, y: 0 },
                      }}>
                      <NavItem
                        icon={<Compass size={18} />}
                        label="Explore"
                        to="/explore"
                      />
                    </motion.li>
                  </>
                )}
              </motion.ul>
            </motion.nav>

            {/* Right Section */}
            <div className="flex items-center gap-3">
              <motion.div
                className="flex items-center gap-3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}>
                {user ? (
                  <>
                    {/* Notification Icon with menu */}
                    <div
                      className="relative hidden md:flex items-center"
                      ref={notificationMenuRef}>
                      <motion.button
                        className="group p-2 rounded-full hover:bg-gray-100 relative"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() =>
                          setIsNotificationMenuOpen(!isNotificationMenuOpen)
                        }>
                        <Bell className="h-5 w-5 text-gray-600 group-hover:text-gray-900 transition-colors" />
                        <motion.span
                          className="absolute top-1.5 right-1.5 h-2.5 w-2.5 bg-pink-500 rounded-full ring-2 ring-white"
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{
                            type: "spring",
                            stiffness: 260,
                            damping: 20,
                          }}
                        />
                      </motion.button>
                      <AnimatePresence mode="wait">
                        {isNotificationMenuOpen && (
                          <motion.div
                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                            transition={{ type: "spring", duration: 0.2 }}
                            className="absolute top-full right-0 mt-2 w-80 rounded-xl bg-white border border-gray-100 shadow-xl py-2 origin-top-right z-50">
                            <div className="px-4 py-2 border-b border-gray-100">
                              <h3 className="font-semibold text-gray-900">
                                Notifications
                              </h3>
                            </div>
                            <div className="px-4 py-3 text-sm text-gray-500 flex items-center justify-center h-20">
                              No new notifications
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* Profile Button */}
                    <div
                      className="relative"
                      ref={profileMenuRef}>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                        className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-full hover:bg-gray-100 transition-colors border border-gray-100 shadow-sm">
                        <Avatar
                          url={user.user_metadata?.profile_picture_url}
                          size="xs"
                          className="ring-2 ring-white"
                        />
                        <span className="text-sm font-medium text-gray-700 hidden sm:block">
                          {user.user_metadata?.username}
                        </span>
                      </motion.button>

                      {/* Dropdown Menu */}
                      <AnimatePresence mode="wait">
                        {isProfileMenuOpen && (
                          <motion.div
                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                            transition={{ type: "spring", duration: 0.2 }}
                            className="absolute right-0 mt-2 w-64 rounded-xl bg-white border border-gray-100 shadow-xl py-2 origin-top-right z-50">
                            {/* User Info */}
                            <div className="px-4 py-3 border-b border-gray-100 flex items-center gap-3">
                              <Avatar
                                url={user.user_metadata?.profile_picture_url}
                                size="sm"
                                className="ring-2 ring-white"
                              />
                              <div>
                                <p className="text-sm font-medium text-gray-900">
                                  {user.user_metadata?.username}
                                </p>
                                <p className="text-xs text-gray-500 truncate">
                                  {user.email}
                                </p>
                              </div>
                            </div>

                            {/* Menu Items */}
                            <div className="py-1">
                              <Link
                                to={`/profile/${user.user_metadata.username}`}
                                className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                                <User className="w-4 h-4" />
                                View Profile
                              </Link>
                              <Link
                                to="/settings"
                                className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                                <Settings className="w-4 h-4" />
                                Settings
                              </Link>
                              {user.user_metadata?.role === "admin" && (
                                <Link
                                  to="/admin"
                                  className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                                  <Shield className="w-4 h-4" />
                                  Admin Dashboard
                                </Link>
                              )}
                            </div>

                            {/* Logout */}
                            <div className="border-t border-gray-100 pt-1 mt-1">
                              <button
                                onClick={signOut}
                                className="flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 w-full">
                                <LogOut className="w-4 h-4" />
                                Sign out
                              </button>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </>
                ) : (
                  <motion.div
                    className="flex items-center gap-2"
                    variants={{
                      hidden: { opacity: 0, x: 20 },
                      show: { opacity: 1, x: 0 },
                    }}
                    initial="hidden"
                    animate="show">
                    <Link
                      to="/login"
                      className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 
                      transition-colors rounded-full hover:bg-gray-50 border border-gray-200">
                      Log in
                    </Link>
                    <Link
                      to="/signup"
                      className="px-4 py-2 text-sm font-medium text-white 
                      bg-gradient-to-r from-indigo-600 to-pink-500 
                      rounded-full hover:shadow-md transition-all duration-200
                      hover:translate-y-px">
                      Sign up for free
                    </Link>
                  </motion.div>
                )}
              </motion.div>

              {/* Mobile menu button */}
              <button
                onClick={() => setIsMenuOpen(true)}
                className="md:hidden p-2 rounded-full hover:bg-gray-100 transition-colors"
                aria-label="Open menu">
                <Menu className="w-5 h-5 text-gray-700" />
              </button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Mobile Menu Component */}
      <MobileMenu
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
      />
    </>
  );
};

export default Header;
