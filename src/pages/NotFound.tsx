import { Link } from "react-router";
import { motion } from "framer-motion";
import { Home, Search, ArrowLeft, RefreshCw } from "lucide-react";

const NotFound = () => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 via-white to-purple-50 z-0" />

      {/* Animated Background Elements */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="absolute inset-0 overflow-hidden z-0">
        {/* Circular Patterns */}
        <motion.div
          animate={{
            rotate: [0, 360],
          }}
          transition={{
            duration: 50,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px]">
          {Array.from({ length: 5 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute inset-0 border border-dashed rounded-full"
              style={{
                transform: `scale(${0.6 + i * 0.15})`,
                borderColor: `rgba(79, 70, 229, ${0.1 - i * 0.015})`,
              }}
            />
          ))}
        </motion.div>

        {/* Decorative Dots */}
        {Array.from({ length: 20 }).map((_, i) => (
          <motion.div
            key={`dot-${i}`}
            className="absolute rounded-full bg-indigo-500/10"
            style={{
              width: Math.random() * 10 + 5,
              height: Math.random() * 10 + 5,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -10, 0],
              opacity: [0.3, 0.8, 0.3],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </motion.div>

      {/* Content */}
      <div className="relative flex-grow flex flex-col items-center justify-center px-4 py-16 z-10">
        <div className="max-w-lg w-full mx-auto flex flex-col items-center text-center">
          {/* 404 Text */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mb-6">
            <h1 className="text-8xl md:text-9xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-pink-500 leading-none mb-4">
              404
            </h1>
            <div className="flex items-center justify-center gap-2 text-gray-400 text-sm mb-6">
              <div className="w-12 h-px bg-gray-200" />
              <span>Page Not Found</span>
              <div className="w-12 h-px bg-gray-200" />
            </div>
          </motion.div>

          {/* Message */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mb-10">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
              Oops! We can't find that page
            </h2>
            <p className="text-base text-gray-600 mb-4 max-w-md mx-auto">
              The page you are looking for might have been removed, had its name
              changed, or is temporarily unavailable.
            </p>
          </motion.div>

          {/* Search */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="w-full max-w-md mb-8">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search
                  size={18}
                  className="text-gray-400"
                />
              </div>
              <input
                type="text"
                placeholder="Search FreePal..."
                className="pl-10 pr-4 py-3 w-full border border-gray-200 rounded-xl shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none bg-white text-gray-800"
              />
            </div>
          </motion.div>

          {/* Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-3 w-full max-w-md">
            <Link
              to="/"
              className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 text-white font-medium bg-gradient-to-r from-indigo-500 to-pink-500 rounded-xl shadow-lg hover:shadow-indigo-500/30 transition-shadow">
              <Home size={18} />
              Back to Home
            </Link>
            <motion.button
              onClick={() => window.history.back()}
              className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 text-gray-700 font-medium bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors shadow-sm"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}>
              <ArrowLeft size={18} />
              Go Back
            </motion.button>
          </motion.div>

          {/* Refresh Button */}
          <motion.button
            onClick={() => window.location.reload()}
            className="mt-6 inline-flex items-center justify-center gap-2 px-4 py-2 text-sm text-gray-600 hover:text-indigo-600 font-medium transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}>
            <RefreshCw size={14} />
            Refresh Page
          </motion.button>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="relative z-10 py-6 flex justify-center">
        <div className="text-center">
          <p className="text-sm text-gray-500">
            Need help?{" "}
            <a
              href="/contact"
              className="text-indigo-600 font-medium">
              Contact Support
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
