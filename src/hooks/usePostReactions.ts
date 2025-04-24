import { useState } from "react";
import { useAddReactionMutation } from "../mutations";
import { usePostReactionsQuery } from "../queries";
import { ReactionType } from "../types";
import { reactions } from "../constants";

export const usePostReactions = (
  postId: string,
  initialReaction?: ReactionType | null
) => {
  const [showReactions, setShowReactions] = useState(false);
  const addReactionMutation = useAddReactionMutation();
  const { data: postReactions } = usePostReactionsQuery(postId);

  // Create default empty record with all reaction types set to 0
  const defaultReactionsCount: Record<ReactionType, number> = reactions.reduce(
    (acc, reaction) => ({
      ...acc,
      [reaction.name]: 0,
    }),
    {} as Record<ReactionType, number>
  );

  // Calculate reactions count
  const reactionsCount =
    postReactions?.reduce(
      (acc, curr) => ({
        ...acc,
        [curr.type]: (acc[curr.type] || 0) + 1,
      }),
      { ...defaultReactionsCount }
    ) ?? defaultReactionsCount;

  // Handle reaction
  const handleReaction = (type: ReactionType) => {
    addReactionMutation.mutate({ postId, reaction: type });
    setShowReactions(false);
  };

  // Get current reaction config
  const currentReaction = initialReaction;
  const reactionConfig = currentReaction
    ? reactions.find((r) => r.name === currentReaction)
    : reactions[0];

  return {
    showReactions,
    setShowReactions,
    handleReaction,
    reactionsCount,
    currentReaction,
    reactionConfig,
  };
};
