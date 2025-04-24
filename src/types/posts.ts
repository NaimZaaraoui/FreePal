import { Community } from "./communities";
import { User } from "./users";

export type PostVisibility =
  | "public" // Personal posts visible to everyone, even non-logged-in users
  | "private" // Only visible to the author
  | "community_only"; // Posts follow community visibility (public/private community);

export type PostFeedType =
  | "my" // Posts created by the user
  | "communities" // Posts created by the user in the communities they are a member of and public communities
  | "public" // Personal public posts from everyone
  | "community"; // Posts created in a specific community

export interface Post {
  id: string;
  community_id: Community["id"] | null;
  author_id: User["id"];
  content: string;
  visibility: PostVisibility;
  media_urls: string[];
  is_approved: boolean;
  status: "active" | "removed";
  created_at: string;
  updated_at: string;
}

export interface Comment {
  id: string;
  post_id: Post["id"];
  author_id: User["id"];
  content: string;
  parent_comment_id: Comment["id"];
  media_urls: string[];
  status: "active" | "removed";
  created_at: string;
  updated_at: string;
}

export type CommentWithRelations = Comment & {
  author: {
    username: string;
    profile_picture_url?: string;
  };
};

export type ReactionType = "like" | "love" | "wow" | "funny" | "sad" | "angry";

export interface Reaction {
  id: string;
  post_id: Post["id"] | null;
  comment_id: Comment["id"] | null;
  user_id: User["id"];
  type: ReactionType;
  created_at: string;
}

export interface PostWithRelations extends Post {
  author: {
    username: string;
    profile_picture_url?: string;
  };
  community: {
    name: string;
    is_public: boolean;
  };
  reactions: {
    count: number;
    user_reaction?: {
      type: ReactionType | null;
    };
  };
  comments: number;
}
