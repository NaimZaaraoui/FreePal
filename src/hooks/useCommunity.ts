import { useQuery } from "@tanstack/react-query";
import { supabase } from "../config/supabaseClient";
import { useManageMemberMutation } from "../mutations";
import { CommunityMember } from "../types";
import useAuth from "./useAuth";

export default function useCommunity(communityId: string, userId?: string) {
  const { isAdmin, isSuperAdmin } = useAuth();
  const { mutate: manageMember } = useManageMemberMutation();

  // Get user's role in the community
  const { data: userData, isLoading: roleLoading } = useQuery({
    queryKey: ["community-role", communityId, userId],
    queryFn: async () => {
      if (!userId) return null;

      const { data } = await supabase
        .from("community_members")
        .select("role, status")
        .eq("community_id", communityId)
        .eq("user_id", userId)
        .single();

      return (data as CommunityMember) ?? null;
    },
    enabled: !!communityId && !!userId,
  });

  // Get community creator information
  const { data: community } = useQuery({
    queryKey: ["community-creator", communityId],
    queryFn: async () => {
      const { data } = await supabase
        .from("communities")
        .select("created_by")
        .eq("id", communityId)
        .single();

      return data;
    },
    enabled: !!communityId,
  });

  // Helper functions for role management

  const promoteToModerator = (targetUserId: string) => {
    manageMember({
      communityId,
      userId: targetUserId,
      action: "promote_to_moderator",
    });
  };

  const promoteToAdmin = (targetUserId: string) => {
    manageMember({
      communityId,
      userId: targetUserId,
      action: "promote_to_admin",
    });
  };

  const demoteToMember = (targetUserId: string) => {
    manageMember({
      communityId,
      userId: targetUserId,
      action: "demote_to_member",
    });
  };

  const removeMember = (targetUserId: string) => {
    manageMember({
      communityId,
      userId: targetUserId,
      action: "remove",
    });
  };

  // Role checks with proper hierarchy
  const isCreator = userId === community?.created_by;
  const isCommunityAdmin = userData?.role === "admin";
  const isModerator = userData?.role === "moderator" || isCreator;
  const isMember = userData?.status === "approved";

  //  Permission checks
  const canManageMembers =
    isSuperAdmin || isAdmin || isCreator || isCommunityAdmin;
  const canManageRoles = isSuperAdmin || isCreator; // Only super_admin and creator can manage roles
  const canModerate = canManageMembers || isModerator;

  return {
    userData,
    roleLoading,
    isSuperAdmin,
    isGlobalAdmin: isAdmin,
    isCreator,
    isCommunityAdmin,
    isModerator,
    isMember,
    canManageMembers,
    canManageRoles,
    canModerate,
    promoteToAdmin,
    promoteToModerator,
    demoteToMember,
    removeMember,
  };
}
