import { User } from "./users";

export interface Community {
  id: string;
  name: string;
  description: string;
  is_public: boolean;
  rules: string;
  slug: string;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export type CommunityRole = "member" | "moderator" | "admin";

export interface CommunityMember {
  id: string;
  user_id: User["id"];
  community_id: Community["id"];
  status: "pending" | "approved" | "rejected" | "muted";
  mute_expires_at?: string;
  role: CommunityRole;
  joined_at: string;
}

export interface CommunityMemberWithRelations extends CommunityMember {
  user: User;
}

export interface CommunityWithRelations extends Community {
  creator: User;
  members: CommunityMemberWithRelations[];
  posts_count: number;
  members_count: number;
}

export interface ModeratorAction {
  id: string;
  community_id: string;
  moderator_id: string;
  target_user_id: string;
  action_type: "warn" | "mute" | "remove_post" | "remove_comment";
  reason: string;
  duration?: number; // Duration in hours for mutes
  created_at: string;
  expires_at?: string;
}

export interface ModeratorActionWithRelations extends ModeratorAction {
  moderator: User;
  target_user: User;
  community: Community;
}
