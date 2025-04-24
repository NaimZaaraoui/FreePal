import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../config/supabaseClient";
import useApp from "../hooks/useApp";
import { useNavigate } from "react-router";
import { Community } from "../types";

interface CreateCommunityParams {
  name: string;
  description: string;
  rules: string;
  is_public: boolean;
  slug: string;
}

interface JoinCommunityParams {
  communityId: string;
  slug: string;
}

interface ApproveJoinRequestParams {
  communityId: string;
  userId: string;
  status: "approved" | "rejected";
}

interface ManageMemberParams {
  communityId: string;
  userId: string;
  action:
    | "remove"
    | "promote_to_moderator"
    | "promote_to_admin"
    | "demote_to_member";
}

interface ModeratorActionParams {
  communityId: string;
  targetUserId: string;
  actionType: "warn" | "mute" | "remove_post" | "remove_comment";
  reason: string;
  duration?: number;
  contentId?: string; // post_id or comment_id
}

const createCommunity = async ({
  name,
  description,
  rules,
  is_public,
  slug,
}: CreateCommunityParams) => {
  // Check if user is authenticated
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const { data, error } = await supabase
    .from("communities")
    .insert({
      name,
      description,
      rules,
      slug,
      is_public,
      created_by: user.id,
    })
    .select()
    .maybeSingle();

  if (error) throw error;
  return data as Community;
};

export const useCreateCommunityMutation = () => {
  const { setError, showToast } = useApp();
  const navigateTo = useNavigate();

  return useMutation({
    mutationFn: createCommunity,
    onSuccess: (data) => {
      showToast({
        type: "success",
        title: "Community created successfully",
        message: "Your community has been created successfully",
      });
      setError(null);
      navigateTo(`/communities/${data.slug}`);
    },
    onError: (error) => {
      setError(error.message);
    },
  });
};

const joinCommunity = async ({ communityId }: JoinCommunityParams) => {
  // Check auth
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  // Get community details first
  const { data: community } = await supabase
    .from("communities")
    .select("is_public")
    .eq("id", communityId)
    .single();

  if (!community) throw new Error("Community not found!");

  // Check if is member
  const { data: member } = await supabase
    .from("community_members")
    .select("user_id, status")
    .eq("community_id", communityId)
    .eq("user_id", user.id)
    .single();

  if (member) {
    // If already a member, leave or cancel join request
    const { error: leaveError } = await supabase
      .from("community_members")
      .delete()
      .eq("community_id", communityId)
      .eq("user_id", user.id);

    if (leaveError) throw leaveError;

    return member.status === "approved" ? "left" : "cancelled";
  }

  // For public communities, directly add member
  // For private communities, set status to "pending"

  const { error } = await supabase.from("community_members").insert({
    community_id: communityId,
    user_id: user.id,
    status: community.is_public ? "approved" : "pending",
  });

  if (error) throw error;
  return community.is_public ? "joined" : "requested";
};

export const useJoinCommunityMutation = () => {
  const queryClient = useQueryClient();
  const { setError, showToast } = useApp();

  return useMutation({
    mutationFn: joinCommunity,
    onSuccess: (result, { communityId, slug }) => {
      showToast({
        type: "success",
        title: `${result} community successfully`,
      });

      queryClient.invalidateQueries({ queryKey: ["community", slug] });
      queryClient.invalidateQueries({
        queryKey: ["community_members", communityId],
      });

      setError(null);
    },
    onError: (error) => {
      setError(error.message);
    },
  });
};

const approveJoinRequest = async ({
  communityId,
  userId,
  status,
}: ApproveJoinRequestParams) => {
  // Check auth
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated!");

  // Check if user is admin
  const { data: userData, error: userError } = await supabase
    .from("users")
    .select("role")
    .eq("id", user.id);

  if (userError) throw userError;

  // Check if user in community creator
  const { data: communityData, error: communityError } = await supabase
    .from("communities")
    .select("created_by")
    .eq("id", communityId);

  if (communityError) throw communityError;

  if (userData[0].role !== "admin" && user.id !== communityData[0].created_by) {
    throw new Error("Not authorized!");
  }

  // Approve join request
  const { data: updatedMemberData, error: updatedMemberError } = await supabase
    .from("community_members")
    .update({ status })
    .eq("user_id", userId);

  if (updatedMemberError) throw updatedMemberError;
  console.log(updatedMemberData);
  return updatedMemberData;
};

export const useApproveJoinRequestMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: approveJoinRequest,

    onSuccess: (_, { communityId }) => {
      queryClient.invalidateQueries({
        queryKey: ["community-join-requests", communityId],
      });
    },
  });
};

const manageMember = async ({
  communityId,
  userId,
  action,
}: ManageMemberParams) => {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  // Check if user is admin or creator
  const { data: community } = await supabase
    .from("communities")
    .select("created_by")
    .eq("id", communityId)
    .single();

  const isSuperAdmin = user.user_metadata.role === "super_admin";
  const isGlobalAdmin = user.user_metadata.role === "admin";
  const isCreator = user.id === community?.created_by;

  // Permission checks based on action
  switch (action) {
    case "promote_to_admin":
      // Only creator and super_admin can promote to admin
      if (!isCreator && !isSuperAdmin) {
        throw new Error(
          "Only community creator and super admins can promote to admin"
        );
      }
      break;
    case "promote_to_moderator":
    case "demote_to_member":
    case "remove":
      // Creator, super_admin, and global admin can perform these actions
      if (!isCreator && !isSuperAdmin && !isGlobalAdmin) {
        throw new Error("Not authorized");
      }
      break;
  }

  switch (action) {
    case "remove": {
      const { error } = await supabase
        .from("community_members")
        .delete()
        .eq("community_id", communityId)
        .eq("user_id", userId);
      if (error) throw error;
      break;
    }

    case "promote_to_moderator": {
      const { error } = await supabase
        .from("community_members")
        .update({ role: "moderator" })
        .eq("community_id", communityId)
        .eq("user_id", userId);
      if (error) throw error;
      break;
    }

    case "promote_to_admin": {
      const { error } = await supabase
        .from("community_members")
        .update({ role: "admin" })
        .eq("community_id", communityId)
        .eq("user_id", userId);
      if (error) throw error;
      break;
    }

    case "demote_to_member": {
      const { error } = await supabase
        .from("community_members")
        .update({ role: "member" })
        .eq("community_id", communityId)
        .eq("user_id", userId);
      if (error) throw error;
      break;
    }
  }
};

export const useManageMemberMutation = () => {
  const queryClient = useQueryClient();
  const { showToast } = useApp();

  return useMutation({
    mutationFn: manageMember,
    onSuccess: (_, { action, communityId }) => {
      queryClient.invalidateQueries({ queryKey: ["community", communityId] });
      showToast({
        type: "success",
        title: `Member ${action}d successfully`,
      });
    },
  });
};

const takeModeratorAction = async ({
  communityId,
  targetUserId,
  actionType,
  reason,
  duration,
  contentId,
}: ModeratorActionParams) => {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  // Check if user is moderator or admin
  const { data: member } = await supabase
    .from("community_members")
    .select("role")
    .eq("community_id", communityId)
    .eq("user_id", user.id)
    .single();

  if (!member || (member.role !== "moderator" && member.role !== "admin")) {
    throw new Error("Not authorized");
  }

  // Create moderation action
  const { error: actionError } = await supabase
    .from("moderator_actions")
    .insert({
      community_id: communityId,
      moderator_id: user.id,
      target_user_id: targetUserId,
      action_type: actionType,
      reason,
      duration,
      expires_at: duration
        ? new Date(Date.now() + duration * 3600000).toISOString()
        : null,
    });

  if (actionError) throw actionError;

  // Handle specific actions
  switch (actionType) {
    case "remove_post": {
      if (!contentId) throw new Error("Content ID required for post removal");
      const { error: postError } = await supabase
        .from("posts")
        .update({ status: "removed" })
        .eq("id", contentId);
      if (postError) throw postError;
      break;
    }

    case "remove_comment": {
      if (!contentId)
        throw new Error("Content ID required for comment removal");
      const { error: commentError } = await supabase
        .from("comments")
        .update({ status: "removed" })
        .eq("id", contentId);
      if (commentError) throw commentError;
      break;
    }
    case "mute": {
      if (!duration) throw new Error("Duration required for mute action");
      const { error: muteError } = await supabase
        .from("community_members")
        .update({
          status: "muted",
          mute_expires_at: new Date(
            Date.now() + duration * 3600000
          ).toISOString(),
        })
        .eq("community_id", communityId)
        .eq("user_id", targetUserId);
      if (muteError) throw muteError;
      break;
    }
  }
};

export const useModeratorActionMutation = () => {
  const queryClient = useQueryClient();
  const { showToast } = useApp();

  return useMutation({
    mutationFn: takeModeratorAction,
    onSuccess: (_, { actionType, communityId }) => {
      queryClient.invalidateQueries({ queryKey: ["community", communityId] });
      queryClient.invalidateQueries({
        queryKey: ["moderator-actions", communityId],
      });

      const actionMessages = {
        warn: "Warning issued successfully",
        mute: "User muted successfully",
        remove_post: "Post removed successfully",
        remove_comment: "Comment removed successfully",
      };

      showToast({
        type: "success",
        title: actionMessages[actionType],
      });
    },
  });
};
