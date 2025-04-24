import { motion, AnimatePresence } from "framer-motion";
import { ReactionType } from "../types";
import ReactionPicker from "./ReactionPicker";
import { ReactionConfig } from "../constants";

interface Props {
  count: number;
  showReactions: boolean;
  setShowReactions: (show: boolean) => void;
  handleReaction: (type: ReactionType) => void;
  currentReaction?: ReactionType | null;
  reactionConfig?: ReactionConfig;
  reactionsCount: Record<ReactionType, number>;
}

const ReactionButton = ({
  count,
  showReactions,
  setShowReactions,
  handleReaction,
  currentReaction,
  reactionConfig,
  reactionsCount,
}: Props) => {
  return (
    <div className="relative">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.92 }}
        onClick={() => setShowReactions(!showReactions)}
        className={`flex items-center gap-2 ${
          currentReaction
            ? "text-indigo-600"
            : "text-gray-500 hover:text-gray-700"
        } transition-all duration-200`}>
        {reactionConfig && (
          <motion.div
            animate={{
              scale: currentReaction ? [1, 1.2, 1] : 1,
              transition: {
                duration: currentReaction ? 0.4 : 0,
                times: [0, 0.6, 1],
                ease: "easeInOut",
              },
            }}>
            <reactionConfig.icon
              className="w-5 h-5"
              style={{
                color: currentReaction ? reactionConfig.color : "currentColor",
                stroke: currentReaction ? reactionConfig.color : "currentColor",
              }}
            />
          </motion.div>
        )}
        <span className="text-sm font-medium">{count}</span>
      </motion.button>

      <AnimatePresence>
        {showReactions && (
          <ReactionPicker
            onSelect={handleReaction}
            onClose={() => setShowReactions(false)}
            currentReaction={currentReaction}
            reactionsCount={reactionsCount}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default ReactionButton;
