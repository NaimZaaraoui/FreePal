import { Community } from "./communities";

type UserRole = "user" | "admin" | "super_admin";

export interface User {
  id: string;
  username: string;
  name?: string;
  location?: string;
  website?: string;
  email: string;
  role: UserRole;
  bio: string;
  profile_picture_url?: string;
  cover_image_url?: string;
  created_at: string;
  updated_at: string;
  status?: "online" | "offline" | "away"; // Optional: User status
  last_active?: string; // Optional: Last active timestamp
}

export interface UserWithRelations extends User {
  posts_count: number;
  communities_count: number;
  communities: Community[];
}
