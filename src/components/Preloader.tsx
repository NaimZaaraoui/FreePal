import { useEffect, useState } from "react";
import { motion } from "motion/react";

interface Props {
  onLoadingComplete?: () => void;
}

const Preloader = ({ onLoadingComplete }: Props) => {
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [textIndex, setTextIndex] = useState(0);

  const appName = "FreePal";
  const loadingText = "Connect & Share";

  useEffect(() => {
    // Simulate loading process
    const timer = setTimeout(() => {
      if (progress < 100) {
        setProgress((prev) => {
          // Speed up loading as it progresses
          const increment = prev < 60 ? 1 : prev < 80 ? 2 : prev < 95 ? 3 : 4;
          return Math.min(prev + increment, 100);
        });
      } else {
        // Complete loading with a small delay for smoother transition
        setTimeout(() => {
          setIsLoading(false);
          if (onLoadingComplete) onLoadingComplete();
        }, 500);
      }
    }, 40);

    return () => clearTimeout(timer);
  }, [progress, onLoadingComplete]);

  useEffect(() => {
    // Type effect for loading text
    const textTimer = setInterval(() => {
      if (textIndex < loadingText.length) {
        setTextIndex((prev) => prev + 1);
      }
    }, 100);

    return () => clearInterval(textTimer);
  }, [textIndex]);

  if (!isLoading) return null;

  return (
    <motion.div
      className="fixed inset-0 flex flex-col items-center justify-center bg-white z-50"
      animate={isLoading ? { opacity: 1 } : { opacity: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}>
      <div className="flex flex-col items-center">
        {/* Logo container */}
        <motion.div
          className="w-16 h-16 mb-4 relative"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}>
          <div className="w-full h-full rounded-full ring-4 ring-indigo-100 bg-white shadow-md overflow-hidden">
            <img
              src="./logo.png"
              alt="FreePal Logo"
              className="w-full h-full object-cover"
            />
          </div>
        </motion.div>

        {/* App name with gradient */}
        <h1 className="text-3xl md:text-4xl font-black tracking-tight flex items-center mb-1">
          {appName.split("").map((letter, index) => (
            <motion.span
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + index * 0.1 }}
              className={
                index < 4
                  ? "text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-500 to-pink-500"
                  : "text-gray-900"
              }>
              {letter}
            </motion.span>
          ))}
        </h1>

        {/* Typing animation for tagline */}
        <p className="text-xs uppercase tracking-[0.2em] text-gray-500 font-medium mb-8">
          {loadingText.substring(0, textIndex)}
          <motion.span
            animate={{ opacity: [1, 0, 1] }}
            transition={{ repeat: Infinity, duration: 1 }}
            className="inline-block w-1 h-4 bg-indigo-400 ml-1"
          />
        </p>

        {/* Progress bar */}
        <div className="w-64 h-1 bg-gray-100 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-indigo-600 via-purple-500 to-pink-500"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ type: "spring", stiffness: 50 }}
          />
        </div>

        {/* Progress percentage */}
        <motion.p
          className="mt-2 text-xs text-gray-400"
          animate={{ opacity: [0.7, 1, 0.7] }}
          transition={{ repeat: Infinity, duration: 2 }}>
          {progress}% Loading...
        </motion.p>
      </div>
    </motion.div>
  );
};

export default Preloader;
