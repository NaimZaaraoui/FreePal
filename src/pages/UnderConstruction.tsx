import { Link } from "react-router";
import { motion } from "framer-motion";
import { Construction, ArrowLeft, HomeIcon } from "lucide-react";

interface UnderConstructionProps {
  pageName?: string;
  returnPath?: string;
}

const UnderConstruction = ({
  pageName = "This Page",
  returnPath = "/",
}: UnderConstructionProps) => {
  return (
    <div className="min-h-[calc(100vh-4rem)] relative overflow-hidden">
      {/* Enhanced Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 via-white to-pink-50" />

      {/* Animated Background Elements */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="absolute inset-0 overflow-hidden">
        {/* Floating circles */}
        <div className="absolute top-20 left-10 w-64 h-64 bg-pink-300/10 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-10 w-80 h-80 bg-indigo-300/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/4 w-96 h-96 bg-purple-200/10 rounded-full blur-3xl" />
      </motion.div>

      {/* Content Container */}
      <div className="relative flex items-center justify-center h-full py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-md mx-auto text-center px-4">
          {/* Icon */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
            className="mb-6 mx-auto">
            <div className="mx-auto w-24 h-24 bg-gradient-to-br from-indigo-100 to-pink-100 rounded-full flex items-center justify-center">
              <Construction className="w-12 h-12 text-indigo-500" />
            </div>
          </motion.div>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-4xl font-black mb-4">
            {pageName} is{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-pink-500">
              Under Construction
            </span>
          </motion.h1>

          {/* Message */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-gray-600 mb-8 mx-auto max-w-sm">
            We're currently building this page to bring you an amazing
            experience. Please check back soon!
          </motion.p>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex flex-wrap items-center justify-center gap-4">
            <Link to={returnPath}>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex items-center gap-2 px-6 py-3 bg-white border border-gray-200 text-gray-700 font-medium rounded-xl hover:bg-gray-50 hover:shadow-md transition-all">
                <ArrowLeft className="w-4 h-4" />
                Go Back
              </motion.button>
            </Link>

            <Link to="/">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-500 to-pink-500 text-white font-medium rounded-xl hover:shadow-lg hover:shadow-indigo-500/30 transition-all">
                <HomeIcon className="w-4 h-4" />
                Home
              </motion.button>
            </Link>
          </motion.div>

          {/* Progress Indicator */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mt-12 mx-auto max-w-xs">
            <div className="text-sm text-gray-500 mb-2 flex justify-between">
              <span>Progress</span>
              <span>Coming soon!</span>
            </div>
            <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: "35%" }}
                transition={{ delay: 0.7, duration: 1.5, ease: "easeOut" }}
                className="h-full bg-gradient-to-r from-indigo-500 to-pink-500 rounded-full"
              />
            </div>
          </motion.div>

          {/* Feature Teaser */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="mt-12 flex justify-center gap-6 text-center">
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mb-2">
                <svg
                  className="w-6 h-6 text-indigo-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
              <p className="text-sm text-gray-600">Amazing features incoming</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center mb-2">
                <svg
                  className="w-6 h-6 text-pink-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <p className="text-sm text-gray-600">Coming very soon</p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default UnderConstruction;
