import { useQuery } from "@tanstack/react-query";
import { supabase } from "../config/supabaseClient";
import { CommunityMemberWithRelations, CommunityWithRelations } from "../types";

const getCommunities = async () => {
  const { data, error } = await supabase
    .from("communities")
    .select(
      `
      *,
      creator: created_by(
        username,
        profile_picture_url
      ),
      posts_count: posts(count),
      members_count: community_members(count)
    `
    )
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data.map((community) => ({
    ...community,
    posts_count: community.posts_count?.[0]?.count ?? 0,
    members_count: community.members_count?.[0]?.count ?? 0,
  })) as CommunityWithRelations[];
};

export const useCommunitiesQuery = (options?: {
  enabled?: boolean;
  staleTime?: number;
}) => {
  return useQuery({
    queryKey: ["communities"],
    queryFn: getCommunities,
    staleTime: options?.staleTime,
    enabled: options?.enabled,
  });
};

const getJoinedCommunities = async (userId: string) => {
  const { data, error } = await supabase
    .from("community_members")
    .select(
      `
      *,
      community:communities(
        *,
        creator: created_by(
          username,
          profile_picture_url
        )
      )
    `
    )
    .eq("user_id", userId)
    .eq("status", "approved");

  if (error) throw error;
  return data[0]?.communities as CommunityWithRelations[];
};

export const useJoinedCommunitiesQuery = (
  userId: string,
  options?: {
    enabled?: boolean;
    staleTime?: number;
  }
) => {
  return useQuery({
    queryKey: ["joined-communities", userId],
    queryFn: () => getJoinedCommunities(userId),
    staleTime: options?.staleTime,
    enabled: options?.enabled,
  });
};

const getCreatedByCommunities = async (userId: string) => {
  const { data, error } = await supabase
    .from("communities")
    .select("*")
    .eq("created_by", userId);

  if (error) throw error;
  return data as CommunityWithRelations[];
};

export const useGetCreatedByCommunities = (userId: string) => {
  return useQuery({
    queryKey: ["getCreatedByCommunities", userId],
    queryFn: () => getCreatedByCommunities(userId),
  });
};

const getCommunityById = async (id: string) => {
  // First get the community basic info and creator
  const { data: communityData, error: communityError } = await supabase
    .from("communities")
    .select(
      `
      *,
      creator:users!created_by(
        username,
        profile_picture_url
      )
    `
    )
    .eq("id", id)
    .single();

  if (communityError) throw communityError;

  // Then get members in a separate query
  const { data: membersData, error: membersError } = await supabase
    .from("community_members")
    .select(
      `
      *,
      user:users(
        username,
        profile_picture_url
      )
    `
    )
    .eq("community_id", id)
    .eq("status", "approved");

  if (membersError) throw membersError;

  // Get counts in separate queries
  const { count: postsCount } = await supabase
    .from("posts")
    .select("*", { count: "exact", head: true })
    .eq("community_id", id);

  const { count: membersCount } = await supabase
    .from("community_members")
    .select("*", { count: "exact", head: true })
    .eq("community_id", id)
    .eq("status", "approved");

  return {
    ...communityData,
    members: membersData ?? [],
    posts_count: postsCount ?? 0,
    members_count: membersCount ?? 0,
  } as CommunityWithRelations;
};

export const useCommunityByIdQuery = (
  id: string,
  options?: {
    enabled?: boolean;
    staleTime?: number;
  }
) => {
  return useQuery({
    queryKey: ["community", id],
    queryFn: () => getCommunityById(id),
    staleTime: options?.staleTime,
    enabled: options?.enabled,
  });
};

const getJoinRequests = async (communityId: string) => {
  const { data, error } = await supabase
    .from("community_members")
    .select(`*, user: users(username, profile_picture_url)`)
    .eq("community_id", communityId)
    .eq("status", "pending");

  if (error) throw error;
  return data as CommunityMemberWithRelations[];
};

export const useGetJoinRequestsQuery = (
  communityId: string,
  options?: {
    enabled?: boolean;
    staleTime?: number;
  }
) => {
  return useQuery({
    queryKey: ["community-join-requests", communityId],
    queryFn: () => getJoinRequests(communityId),
    staleTime: options?.staleTime,
    enabled: options?.enabled,
  });
};

const getCommunityMember = async (communityId: string, userId: string) => {
  const { data, error } = await supabase
    .from("community_members")
    .select(`*, user: users(username, profile_picture_url)`)
    .eq("community_id", communityId)
    .eq("user_id", userId)
    .maybeSingle();
  if (error) throw error;
  return data as CommunityMemberWithRelations;
};

export const useCommunityMemberQuery = (
  communityId: string,
  userId: string,
  options?: {
    enabled?: boolean;
    staleTime?: number;
  }
) => {
  return useQuery({
    queryKey: ["community-member", communityId, userId],
    queryFn: () => getCommunityMember(communityId, userId),
    staleTime: options?.staleTime,
    enabled: options?.enabled,
  });
};

export const useModeratorActionsQuery = (communityId: string) => {
  return useQuery({
    queryKey: ["moderator-actions", communityId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("moderator_actions")
        .select(
          `
          *,
          moderator:users!moderator_id(*),
          target_user:users!target_user_id(*),
          community:communities(*)
        `
        )
        .eq("community_id", communityId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });
};
