import { CommentWithRelations } from "../types";

export type CommentTree = CommentWithRelations & { children?: CommentTree[] };

export const buildCommentsTree = (
  comments: CommentWithRelations[]
): CommentTree[] => {
  // Create a map to hold the comments by their ID
  const commentsMap = new Map<string, CommentTree>();
  // Create an array to hold the root comments
  const commentsRoots: CommentTree[] = [];

  // Iterate through the comments and add them to the map
  comments.forEach((comment) => {
    commentsMap.set(comment.id, { ...comment, children: [] });
  });

  // Iterate through the comments and add them to the root comments array
  comments.forEach((comment) => {
    const parentId = comment.parent_comment_id;
    const rootComment = commentsMap.get(comment.id);

    if (parentId) {
      const parentComment = commentsMap.get(parentId);

      if (parentComment && rootComment) {
        // If the comment has a parent, add it to the parent's children array
        parentComment.children?.push(rootComment);
      }
    } else {
      // If the comment doesn't have a parent, add it to the root comments array
      commentsRoots.push(rootComment!);
    }
  });

  return commentsRoots;
};
