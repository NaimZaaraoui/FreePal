import { useQuery } from "@tanstack/react-query";
import { supabase } from "../config/supabaseClient";
import {
  CommentWithRelations,
  PostFeedType,
  PostWithRelations,
  Reaction,
} from "../types";

const getPosts = async (type: PostFeedType, communityId?: string) => {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("Not authenticated!");

  let query = supabase.from("posts").select(`
    *,
    author: author_id(username, profile_picture_url),
    community: community_id(name, is_public),
    reactions(count),
    comments(count)
  `);

  switch (type) {
    case "my":
      query = query.eq("author_id", user.id);
      break;

    case "communities": {
      const { data: communities } = await supabase
        .from("community_members")
        .select("community_id")
        .eq("user_id", user.id)
        .eq("status", "approved");

      const communityIds = communities?.map((c) => c.community_id) || [];

      query = query
        .eq("visibility", "community_only")
        .not("community_id", "is", null);

      const { data: publicCommunities } = await supabase
        .from("communities")
        .select("id")
        .eq("is_public", true);

      const publicCommunityIds = publicCommunities?.map((c) => c.id) || [];

      if (communityIds.length > 0) {
        // Show posts from user's communities and public communities using proper OR syntax
        query = query.or(
          `community_id.in.(${publicCommunityIds.join(
            ","
          )}),community_id.in.(${communityIds.join(",")})`
        );
      } else {
        // If user is not a member of any communities, only show public community posts
        query = query.in("community_id", publicCommunityIds);
      }
      break;
    }

    case "public":
      query = query.eq("visibility", "public");
      break;

    case "community": {
      if (!communityId) throw new Error("Community ID is required");
      query = query.eq("community_id", communityId);
      break;
    }
  }

  const { data: posts, error } = await query
    .limit(10)
    .order("created_at", { ascending: false });

  if (error) throw error;

  // Then get user reactions for these posts
  const { data: userReactions } = await supabase
    .from("reactions")
    .select("post_id, type")
    .eq("user_id", user?.id)
    .in(
      "post_id",
      posts.map((post) => post.id)
    );

  // Transform the data
  const transformedData = posts.map((post) => ({
    ...post,
    reactions: {
      count: post.reactions[0]?.count ?? 0,
      user_reaction: userReactions?.find((r) => r.post_id === post.id),
    },
    comments: post.comments[0]?.count ?? 0,
  }));
  return transformedData as PostWithRelations[];
};

export const usePostsQuery = (type: PostFeedType, communityId?: string) => {
  return useQuery({
    queryKey: ["posts", type],
    queryFn: () => getPosts(type, communityId),
  });
};

const getPost = async (id: string) => {
  // Get the current user
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("Not authenticated!");

  // Fetch the post with its relations
  const { data: post, error } = await supabase
    .from("posts")
    .select(
      `
      *,
      author: author_id(username, profile_picture_url),
      community: community_id(name, is_public),
      reactions(count),
      comments(count)`
    )
    .eq("id", id)
    .single();

  if (error) throw error;
  // Then get user reactions for these posts
  const { data: userReactions } = await supabase
    .from("reactions")
    .select("post_id, type")
    .eq("user_id", user?.id)
    .eq("post_id", id);

  // Transform the data to get correct count values
  const transformedData = {
    ...post,
    reactions: {
      count: post.reactions[0]?.count ?? 0,
      user_reaction: userReactions?.find((r) => r.post_id === post.id),
    },
    comments: post.comments[0]?.count ?? 0,
  };

  return transformedData as PostWithRelations;
};

export const usePostQuery = (id: string) => {
  return useQuery({
    queryKey: ["post", id],
    queryFn: () => getPost(id),
  });
};

const getPostReactions = async (postId: string) => {
  const { data, error } = await supabase
    .from("reactions")
    .select()
    .eq("post_id", postId);

  if (error) throw error;
  return data as Reaction[];
};

export const usePostReactionsQuery = (postId: string) => {
  return useQuery({
    queryKey: ["reactions", postId],
    queryFn: () => getPostReactions(postId),
  });
};

const getPostComments = async (postId: string) => {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const { data: comments, error } = await supabase
    .from("comments")
    .select(
      `
      *,
      author:author_id (
        username,
        profile_picture_url
      )
    `
    )
    .eq("post_id", postId)
    .order("created_at", { ascending: false });

  if (error) throw error;

  return comments as CommentWithRelations[];
};

export const useGetPostCommentsQuery = (postId: string) => {
  return useQuery({
    queryKey: ["comments", postId],
    queryFn: () => getPostComments(postId),
  });
};
