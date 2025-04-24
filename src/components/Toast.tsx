import { ReactNode, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle,
  AlertTriangle,
  Bell,
  Heart,
  MessageSquare,
  Share2,
  UserPlus,
  X,
  Info,
  ChevronRight,
} from "lucide-react";

export type ToastType =
  | "success"
  | "error"
  | "info"
  | "like"
  | "comment"
  | "share"
  | "mention"
  | "friend";

interface ToastAction {
  label: string;
  onClick: () => void;
  isPrimary?: boolean;
}

export interface ToastProps {
  id?: string;
  type?: ToastType;
  title: string;
  message?: string | ReactNode;
  timestamp?: string;
  avatar?: string;
  username?: string;
  actions?: ToastAction[];
  duration?: number;
  onClose?: () => void;
  hasProgress?: boolean;
}

export const Toast = ({
  type = "info",
  title,
  message,
  timestamp,
  avatar,
  username,
  actions = [],
  duration = 5000,
  onClose,
  hasProgress = true,
}: ToastProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [progress, setProgress] = useState(100);
  const [isVisible, setIsVisible] = useState(true);

  // Auto-dismiss timer
  useEffect(() => {
    if (!isHovered && hasProgress) {
      const startTime = Date.now();
      const interval = setInterval(() => {
        const elapsed = Date.now() - startTime;
        const remaining = Math.max(0, 100 - (elapsed / duration) * 100);
        setProgress(remaining);

        if (remaining <= 0) {
          clearInterval(interval);
          handleClose();
        }
      }, 10);

      return () => clearInterval(interval);
    }
  }, [isHovered, duration, hasProgress]);

  // Handle close animation sequence
  const handleClose = () => {
    setIsVisible(false);
    // Wait for exit animation to complete before calling onClose
    setTimeout(() => {
      onClose?.();
    }, 300);
  };

  // Icons for different notification types
  const getIcon = () => {
    switch (type) {
      case "success":
        return <CheckCircle className="w-5 h-5" />;
      case "error":
        return <AlertTriangle className="w-5 h-5" />;
      case "info":
        return <Info className="w-5 h-5" />;
      case "mention":
        return <Bell className="w-5 h-5" />;
      case "like":
        return <Heart className="w-5 h-5" />;
      case "comment":
        return <MessageSquare className="w-5 h-5" />;
      case "share":
        return <Share2 className="w-5 h-5" />;
      case "friend":
        return <UserPlus className="w-5 h-5" />;
      default:
        return <Bell className="w-5 h-5" />;
    }
  };

  // Type-specific styling
  const styles = {
    success: {
      gradient: "from-emerald-500 to-teal-500",
      iconBg: "bg-emerald-500",
      ringColor: "ring-emerald-200",
      lightBg: "bg-emerald-50",
      textColor: "text-emerald-700",
      progressColor: "bg-emerald-500",
      borderColor: "border-emerald-100",
    },
    error: {
      gradient: "from-rose-500 to-red-500",
      iconBg: "bg-rose-500",
      ringColor: "ring-rose-200",
      lightBg: "bg-rose-50",
      textColor: "text-rose-700",
      progressColor: "bg-rose-500",
      borderColor: "border-rose-100",
    },
    info: {
      gradient: "from-blue-500 to-indigo-500",
      iconBg: "bg-blue-500",
      ringColor: "ring-blue-200",
      lightBg: "bg-blue-50",
      textColor: "text-blue-700",
      progressColor: "bg-blue-500",
      borderColor: "border-blue-100",
    },
    mention: {
      gradient: "from-violet-500 to-purple-500",
      iconBg: "bg-violet-500",
      ringColor: "ring-violet-200",
      lightBg: "bg-violet-50",
      textColor: "text-violet-700",
      progressColor: "bg-violet-500",
      borderColor: "border-violet-100",
    },
    like: {
      gradient: "from-pink-500 to-rose-500",
      iconBg: "bg-pink-500",
      ringColor: "ring-pink-200",
      lightBg: "bg-pink-50",
      textColor: "text-pink-700",
      progressColor: "bg-pink-500",
      borderColor: "border-pink-100",
    },
    comment: {
      gradient: "from-amber-500 to-orange-500",
      iconBg: "bg-amber-500",
      ringColor: "ring-amber-200",
      lightBg: "bg-amber-50",
      textColor: "text-amber-700",
      progressColor: "bg-amber-500",
      borderColor: "border-amber-100",
    },
    share: {
      gradient: "from-cyan-500 to-teal-500",
      iconBg: "bg-cyan-500",
      ringColor: "ring-cyan-200",
      lightBg: "bg-cyan-50",
      textColor: "text-cyan-700",
      progressColor: "bg-cyan-500",
      borderColor: "border-cyan-100",
    },
    friend: {
      gradient: "from-indigo-500 to-blue-500",
      iconBg: "bg-indigo-500",
      ringColor: "ring-indigo-200",
      lightBg: "bg-indigo-50",
      textColor: "text-indigo-700",
      progressColor: "bg-indigo-500",
      borderColor: "border-indigo-100",
    },
  };

  const currentStyle = styles[type];

  // Animation variants
  const toastVariants = {
    hidden: { opacity: 0, y: -20, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { type: "spring", damping: 25, stiffness: 300 },
    },
    exit: {
      opacity: 0,
      y: -20,
      scale: 0.95,
      transition: { duration: 0.2, ease: "easeOut" },
    },
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          variants={toastVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className="w-full max-w-sm overflow-hidden pointer-events-auto z-50">
          <div
            className={`
            relative backdrop-blur-md bg-white/90 dark:bg-slate-800/90
            rounded-2xl shadow-lg shadow-slate-200/40 dark:shadow-slate-900/30
            border ${currentStyle.borderColor} dark:border-slate-700
            overflow-hidden
          `}>
            {/* Top gradient accent */}
            <div
              className={`h-1 w-full bg-gradient-to-r ${currentStyle.gradient}`}
            />

            {/* Progress bar */}
            {hasProgress && !isHovered && (
              <motion.div
                className={`absolute bottom-0 left-0 h-1 ${currentStyle.progressColor} z-10`}
                style={{ width: `${progress}%` }}
                initial={{ width: "100%" }}
                transition={{ ease: "linear" }}
              />
            )}

            <div className="p-4 flex gap-3 items-start">
              {/* Icon or Avatar */}
              <div className="flex-shrink-0">
                {avatar ? (
                  <div className="relative">
                    <motion.div
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 0.1 }}
                      className="w-10 h-10 rounded-full overflow-hidden ring-2 ring-white dark:ring-slate-700">
                      <img
                        src={avatar}
                        alt={username || "User"}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src =
                            "/default-avatar.jpg";
                        }}
                      />
                      {/* Status indicator for the notification type */}
                      <div
                        className={`absolute bottom-0 right-0 w-4 h-4 ${currentStyle.iconBg} rounded-full
                                       ring-2 ring-white dark:ring-slate-700 flex items-center justify-center`}>
                        <div className="text-white scale-75">{getIcon()}</div>
                      </div>
                    </motion.div>
                  </div>
                ) : (
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.1 }}
                    className={`
                      w-10 h-10 rounded-full flex items-center justify-center
                      bg-gradient-to-br ${currentStyle.gradient}
                      ring-2 ring-white dark:ring-slate-700 shadow-md ${currentStyle.ringColor}
                    `}>
                    <div className="text-white">{getIcon()}</div>
                  </motion.div>
                )}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                {/* Header Row: User + Timestamp */}
                {(username || timestamp) && (
                  <div className="flex items-center justify-between mb-0.5">
                    {username && (
                      <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.15 }}
                        className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                        {username}
                      </motion.p>
                    )}
                    {timestamp && (
                      <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.15 }}
                        className="text-xs text-slate-500 dark:text-slate-400 ml-auto">
                        {timestamp}
                      </motion.p>
                    )}
                  </div>
                )}

                {/* Title */}
                {title && (
                  <motion.h4
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className={`text-sm font-bold ${currentStyle.textColor} mb-1`}>
                    {title}
                  </motion.h4>
                )}

                {/* Message */}
                <motion.div
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.25 }}
                  className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                  {message}
                </motion.div>

                {/* Actions */}
                {actions.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="flex gap-2 mt-3">
                    {actions.map((action, index) => (
                      <motion.button
                        key={index}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={action.onClick}
                        className={`
                          text-xs font-medium py-1.5 px-3 rounded-full transition-all flex items-center gap-1
                          ${
                            action.isPrimary
                              ? `bg-gradient-to-r ${currentStyle.gradient} text-white shadow-sm hover:shadow-md`
                              : `bg-slate-100 text-slate-700 hover:bg-slate-200 
                              dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600`
                          }
                        `}>
                        {action.label}
                        {action.isPrimary && (
                          <ChevronRight className="w-3 h-3" />
                        )}
                      </motion.button>
                    ))}
                  </motion.div>
                )}
              </div>

              {/* Close Button */}
              <motion.button
                whileHover={{ rotate: 90, scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleClose}
                className="flex-shrink-0 text-slate-400 hover:text-slate-600 dark:text-slate-500 
                       dark:hover:text-slate-300 bg-slate-100/80 dark:bg-slate-700/60 
                       hover:bg-slate-200 dark:hover:bg-slate-600 
                       p-1.5 rounded-full transition-all"
                aria-label="Close">
                <X className="w-3 h-3" />
              </motion.button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Toast;
