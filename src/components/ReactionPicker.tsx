import { motion } from "framer-motion";
import { useRef } from "react";
import useOnClickOutside from "../hooks/useOnClickOutside";
import { ReactionType } from "../types";
import { reactions } from "../constants";

interface Props {
  onSelect: (reaction: ReactionType) => void;
  onClose: () => void;
  reactionsCount: Record<ReactionType, number>;
  currentReaction?: ReactionType | null;
}

const ReactionPicker = ({
  onSelect,
  onClose,
  currentReaction,
  reactionsCount,
}: Props) => {
  const ref = useRef<HTMLDivElement>(null);

  useOnClickOutside(ref, onClose);

  return (
    <motion.div
      ref={ref}
      initial={{ scale: 0.5, opacity: 0, y: 10 }}
      animate={{ scale: 1, opacity: 1, y: 0 }}
      exit={{ scale: 0.5, opacity: 0, y: 10 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className="absolute bottom-full left-0 mb-2 p-3 bg-white rounded-2xl shadow-xl border border-gray-100 z-20">
      <div className="flex gap-1.5">
        {reactions.map(({ icon: Icon, name, color }) => (
          <motion.div
            key={name}
            className="relative group">
            <motion.button
              whileHover={{ scale: 1.15, y: -5 }}
              whileTap={{ scale: 0.9 }}
              transition={{ duration: 0.2 }}
              onClick={() => onSelect(name)}
              className={`w-11 h-11 flex items-center justify-center rounded-xl hover:bg-gray-50 transition-all duration-200 ${
                currentReaction === name
                  ? "bg-gray-50 ring-2 ring-indigo-100 shadow-md"
                  : ""
              }`}>
              <Icon
                className="w-6 h-6 transition-all duration-200"
                style={{
                  color: currentReaction === name ? color : "currentColor",
                  stroke: currentReaction === name ? color : "currentColor",
                }}
              />
              {reactionsCount[name] > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1 min-w-[20px] h-[20px] text-[11px] font-semibold bg-indigo-600 text-white rounded-full flex items-center justify-center px-1 shadow-md">
                  {reactionsCount[name]}
                </motion.span>
              )}
            </motion.button>
            <motion.div
              initial={{ opacity: 0, y: -5 }}
              whileHover={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-xs font-medium bg-gray-900 text-white px-2 py-1 rounded-lg whitespace-nowrap shadow-lg">
              {name}
              {reactionsCount[name] > 0 && ` · ${reactionsCount[name]}`}
            </motion.div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default ReactionPicker;
