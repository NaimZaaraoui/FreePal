import { Heart, ThumbsUp, Laugh, Sparkles, Frown, Angry } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { ReactionType } from "./types";

export interface ReactionConfig {
  icon: LucideIcon;
  name: ReactionType;
  color: string;
}

export const reactions: ReactionConfig[] = [
  {
    icon: Heart,
    name: "love",
    color: "#F43F5E", // Modern pink/red
  },
  {
    icon: ThumbsUp,
    name: "like",
    color: "#3B82F6", // Bright blue
  },
  {
    icon: Laugh,
    name: "funny",
    color: "#F59E0B", // Warm amber
  },
  {
    icon: Sparkles,
    name: "wow",
    color: "#8B5CF6", // Rich purple
  },
  {
    icon: Frown,
    name: "sad",
    color: "#6B7280", // Subtle gray
  },
  {
    icon: Angry,
    name: "angry",
    color: "#EF4444", // Vibrant red
  },
];
