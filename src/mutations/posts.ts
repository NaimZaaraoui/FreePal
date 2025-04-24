import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../config/supabaseClient";
import useApp from "../hooks/useApp";
import { useNavigate } from "react-router";
import {
  CommentWithRelations,
  Post,
  PostVisibility,
  PostWithRelations,
  Reaction,
  ReactionType,
} from "../types";

interface CreatePostData {
  content: string;
  visibility: PostVisibility;
  communityId?: string;
  mediaFiles?: File[];
}

interface AddReactionData {
  postId: string;
  reaction: ReactionType;
}

interface AddCommentData {
  postId: string;
  content?: string;
  mediaFiles?: File[];
  parentCommentId?: string | null;
}

interface UpdateCommentData {
  postId: string;
  commentId: string;
  content?: string;
  mediaFiles?: File[];
  keptInitialUrls?: string[];
}

interface DeleteCommentData {
  postId: string;
  commentId: string;
  communityId?: string;
}

const createPost = async ({
  content,
  visibility,
  communityId,
  mediaFiles,
}: CreatePostData) => {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  // Validate visibility rules
  if (visibility === "community_only" && !communityId) {
    throw new Error("Community ID is required for community-only posts");
  }

  // Upload media files if any
  const mediaUrls: string[] = [];
  if (mediaFiles?.length) {
    for (const file of mediaFiles) {
      const fileExt = file.name.split(".").pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `${user.id}/${fileName}`;

      // Upload the file to Supabase storage
      const { error: uploadError } = await supabase.storage
        .from("post-media")
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Get the file public URL
      const {
        data: { publicUrl },
      } = supabase.storage.from("post-media").getPublicUrl(filePath);

      mediaUrls.push(publicUrl);
    }
  }

  // Create the post
  const { data, error } = await supabase
    .from("posts")
    .insert({
      content,
      visibility,
      author_id: user.id,
      community_id: visibility === "community_only" ? communityId : null,
      media_urls: mediaUrls,
      is_approved: visibility !== "community_only" || communityId === null,
    })
    .select()
    .single()
    .overrideTypes<Post>();

  if (error) throw error;
  if (!data) throw new Error("Failed to create post");
  if ("Error" in data) throw new Error(data.Error);

  return data;
};

export const useCreatePostMutation = () => {
  const { setError, showToast } = useApp();
  const navigateTo = useNavigate();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createPost,
    onSuccess(data) {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      showToast({
        type: "success",
        title: "Post created!",
        message: "Your post has been published successfully.",
      });
      navigateTo(`/posts/${data.id}`);
    },
    onError(error) {
      setError(error.message);
    },
  });
};

const deletePost = async (id: string) => {
  const { data, error } = await supabase
    .from("posts")
    .delete()
    .eq("id", id)
    .single();

  if (error) throw error;
  if (!data) throw new Error("Failed to delete post");

  return data;
};

export const useDeletePostMutation = () => {
  const queryClient = useQueryClient();
  return useMutation<Post, Error, string>({
    mutationFn: deletePost,
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });
};

const addReaction = async ({ postId, reaction }: AddReactionData) => {
  // Get the current user
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();
  if (authError) throw authError;
  if (!user) throw new Error("Not authenticated");

  // Check if the user already reacted to the post
  const { data: existingReaction } = await supabase
    .from("reactions")
    .select()
    .eq("post_id", postId)
    .eq("user_id", user.id)
    .maybeSingle();

  if (existingReaction) {
    // Remove reaction if same type
    if (existingReaction.type === reaction) {
      const { error } = await supabase
        .from("reactions")
        .delete()
        .eq("id", existingReaction.id);

      if (error) throw error;
      return { ...existingReaction, deleted: true };
    }

    // Update reaction if different type
    const { data, error } = await supabase
      .from("reactions")
      .update({ type: reaction })
      .eq("id", existingReaction.id)
      .select()
      .single();

    if (error) throw error;
    return data as Reaction;
  }

  // Insert the reaction if the user hasn't reacted yet
  const { data, error } = await supabase
    .from("reactions")
    .insert({
      post_id: postId,
      user_id: user.id,
      type: reaction,
    })
    .select()
    .single();
  if (error) throw error;
  return data as Reaction;
};

export const useAddReactionMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: addReaction,
    async onMutate(variables) {
      // Get user at the start of mutation
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ["post", variables.postId] });
      await queryClient.cancelQueries({ queryKey: ["posts"] });
      await queryClient.cancelQueries({
        queryKey: ["reactions", variables.postId],
      });

      // Snapshot the current posts data for all types
      const postTypes = ["my", "following", "public", "all"];
      const previousPostsByType: Record<string, PostWithRelations[]> = {};

      postTypes.forEach((type) => {
        const previousPosts = queryClient.getQueryData<PostWithRelations[]>([
          "posts",
          type,
        ]);
        if (previousPosts) {
          previousPostsByType[type] = previousPosts;
        }
      });

      const previousPost = queryClient.getQueryData<PostWithRelations>([
        "post",
        variables.postId,
      ]);

      const previousPostReactions = queryClient.getQueryData<Reaction[]>([
        "reactions",
        variables.postId,
      ]);

      // Optimistically update the cache for all post types
      postTypes.forEach((type) => {
        queryClient.setQueryData<PostWithRelations[]>(
          ["posts", type],
          (old) => {
            if (!old) return [];

            return old.map((post) => {
              if (post.id === variables.postId) {
                const hasExistingReaction = post.reactions.user_reaction;
                const isSameReaction =
                  hasExistingReaction?.type === variables.reaction;

                return {
                  ...post,
                  reactions: {
                    count: hasExistingReaction
                      ? isSameReaction
                        ? post.reactions.count - 1
                        : post.reactions.count
                      : post.reactions.count + 1,
                    user_reaction: isSameReaction
                      ? undefined
                      : { type: variables.reaction },
                  },
                };
              }

              return post;
            });
          }
        );
      });

      // Update single post optimistically
      if (previousPost) {
        const hasExistingReaction = previousPost.reactions.user_reaction;
        const isSameReaction = hasExistingReaction?.type === variables.reaction;

        queryClient.setQueryData<PostWithRelations>(
          ["post", variables.postId],
          {
            ...previousPost,
            reactions: {
              count: hasExistingReaction
                ? isSameReaction
                  ? previousPost.reactions.count - 1
                  : previousPost.reactions.count
                : previousPost.reactions.count + 1,
              user_reaction: isSameReaction
                ? undefined
                : { type: variables.reaction },
            },
          }
        );
      }

      // Update reactions optimistically
      queryClient.setQueryData<Reaction[]>(
        ["reactions", variables.postId],
        (old: Reaction[] | undefined = []) => {
          const existingReactionIndex = old.findIndex(
            (r) => r.user_id === user?.id
          );

          if (existingReactionIndex > -1) {
            // If same reaction, remove it
            if (old[existingReactionIndex].type === variables.reaction) {
              return old.filter((_, i) => i !== existingReactionIndex);
            }
            // If different reaction, update it
            return old.map((r, i) =>
              i === existingReactionIndex
                ? { ...r, type: variables.reaction }
                : r
            );
          }
          // Add new reaction
          return [
            ...old,
            {
              id: `temp-${Date.now()}`,
              post_id: variables.postId,
              comment_id: null,
              user_id: user?.id,
              type: variables.reaction,
              created_at: new Date().toISOString(),
            },
          ];
        }
      );

      // Return a context object with the snapshotted value
      return {
        previousPostsByType,
        previousPost,
        previousPostReactions,
      };
    },
    onError(_error, variables, context) {
      // Rollback the optimistic update
      if (context?.previousPostsByType) {
        Object.entries(context.previousPostsByType).forEach(([type, posts]) => {
          queryClient.setQueryData<PostWithRelations[]>(["posts", type], posts);
        });
      }
      if (context?.previousPost) {
        queryClient.setQueryData<PostWithRelations>(
          ["post", variables.postId],
          context.previousPost
        );
      }

      if (context?.previousPostReactions) {
        queryClient.setQueryData<Reaction[]>(
          ["reactions", variables.postId],
          context.previousPostReactions
        );
      }
    },
    onSettled(_data, _error, variables) {
      // Invalidate queries for the specific post and all posts types
      queryClient.invalidateQueries({ queryKey: ["post", variables.postId] });
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      queryClient.invalidateQueries({
        queryKey: ["reactions", variables.postId],
      });
    },
  });
};

const addComment = async ({
  postId,
  content,
  parentCommentId,
  mediaFiles,
}: AddCommentData) => {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  // Get post with visibility info and author
  const { data: post, error: postError } = await supabase
    .from("posts")
    .select(
      `
      *,
      visibility,
      author_id,
      community_id,
      community:community_id (
        id
      )
    `
    )
    .eq("id", postId)
    .single();

  if (postError) throw postError;
  if (!post) throw new Error("Post not found");

  // Check visibility permissions
  if (post.visibility === "private" && post.author_id !== user.id) {
    throw new Error("Cannot comment on private posts");
  }

  if (post.visibility === "community_only" && post.community_id) {
    // Check if user is a member of the community
    const { data: membership, error: membershipError } = await supabase
      .from("community_members")
      .select()
      .eq("community_id", post.community_id)
      .eq("user_id", user.id);

    if (membershipError || !membership) {
      throw new Error("You must be a community member to comment on this post");
    }
  }

  // Upload media files if any
  let mediaUrls: string[] = [];
  if (mediaFiles?.length) {
    mediaUrls = await Promise.all(
      mediaFiles.map(async (file) => {
        const fileExt = file.name.split(".").pop();
        const fileName = `${Date.now()}.${fileExt}`;
        const filePath = `comments/${user.id}/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from("post-media")
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        const {
          data: { publicUrl },
        } = supabase.storage.from("post-media").getPublicUrl(filePath);

        return publicUrl;
      })
    );
  }

  // Create the comment
  const { data: comment, error: commentError } = await supabase
    .from("comments")
    .insert({
      post_id: postId,
      author_id: user.id,
      content,
      media_urls: mediaUrls,
      parent_comment_id: parentCommentId,
    })
    .select(
      `
    *,
    author:author_id (
      username,
      profile_picture_url
    )
  `
    )
    .single();

  if (commentError) throw commentError;
  return comment as CommentWithRelations;
};

export const useAddCommentMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: addComment,
    onSuccess(_data, variables) {
      queryClient.invalidateQueries({
        queryKey: ["comments", variables.postId],
      });
    },
  });
};

const updateComment = async ({
  commentId,
  content,
  mediaFiles,
  keptInitialUrls = [],
}: UpdateCommentData) => {
  // Get the current user
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  // Check if the user has permission to edit the comment
  const { data: comment, error: commentError } = await supabase
    .from("comments")
    .select(`author_id, author: author_id(username)`)
    .eq("id", commentId)
    .single();

  if (commentError) throw commentError;
  if (!comment) throw new Error("Comment not found");
  if (comment.author_id !== user.id) throw new Error("Not authorized");

  // Upload media files if any
  let newMediaUrls: string[] = [];
  if (mediaFiles?.length) {
    newMediaUrls = await Promise.all(
      mediaFiles.map(async (file) => {
        const fileExt = file.name.split(".").pop();
        const fileName = `${Date.now()}.${fileExt}`;
        const filePath = `comments/${user.id}/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from("post-media")
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        const {
          data: { publicUrl },
        } = supabase.storage.from("post-media").getPublicUrl(filePath);

        return publicUrl;
      })
    );
  }

  const finalMediaUrls = [...keptInitialUrls, ...newMediaUrls];

  // Update the comment
  const { data, error } = await supabase
    .from("comments")
    .update({
      content,
      media_urls: finalMediaUrls,
    })
    .eq("id", commentId)
    .select(
      `
    *,
    author:author_id (
      username,
      profile_picture_url
    )`
    )
    .single();

  if (error) throw error;
  return data as CommentWithRelations;
};

export const useUpdateCommentMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateComment,
    onSuccess(_data, variables) {
      queryClient.invalidateQueries({
        queryKey: ["comments", variables.commentId],
      });
      queryClient.invalidateQueries({
        queryKey: ["post", variables.postId],
      });
      queryClient.invalidateQueries({
        queryKey: ["posts"],
      });
    },
  });
};

const deleteComment = async ({ commentId, communityId }: DeleteCommentData) => {
  // Check the current user
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  // Check if the user has permission to delete the comment
  // Should be either the comment author, a community admin, a global admin or a super admin

  // Check if the user is a community admin
  let communityAdmin = null;
  if (communityId) {
    const { data, error } = await supabase
      .from("community_members")
      .select("role")
      .eq("community_id", communityId)
      .eq("user_id", user.id)
      .single();
    if (error) throw error;
    communityAdmin = data;
  }

  // Check if the user is a global admin or a super admin
  const { data: globalAdmin, error: globalAdminError } = await supabase
    .from("users")
    .select("role")
    .eq("id", user.id)
    .single();
  if (globalAdminError) throw globalAdminError;

  const { data: comment, error: commentError } = await supabase
    .from("comments")
    .select(`author_id`)
    .eq("id", commentId)
    .single();

  if (commentError) throw commentError;
  if (!comment) throw new Error("Comment not found");
  if (
    comment.author_id !== user.id &&
    (!communityAdmin || communityAdmin.role !== "admin") &&
    globalAdmin.role !== "admin" &&
    globalAdmin.role !== "super_admin"
  )
    throw new Error("Not authorized");

  // Delete the comment
  const { error } = await supabase
    .from("comments")
    .delete()
    .eq("id", commentId);

  if (error) throw error;
};

export const useDeleteCommentMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteComment,
    onSuccess(_data, variables) {
      queryClient.invalidateQueries({
        queryKey: ["comments", variables],
      });
      queryClient.invalidateQueries({
        queryKey: ["post", variables.postId],
      });
      queryClient.invalidateQueries({
        queryKey: ["posts"],
      });
    },
  });
};
