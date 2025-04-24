# Database Tables and Schema for Social Media Platform

## Authentication and Users

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users Table
CREATE TABLE users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE, -- Links to Supabase auth
    email TEXT UNIQUE NOT NULL, -- Email (from auth.users)
    username TEXT UNIQUE NOT NULL , -- Unique username
    role TEXT NOT NULL DEFAULT 'user', -- Role: user, admin, super_admin
    bio TEXT, -- User bio
    profile_picture_url text, -- URL to profile picture
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
);
```

## Communities

```sql
-- Communities Table
CREATE TABLE communities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4() , -- Unique id
    name TEXT UNIQUE NOT NULL, -- Community name
    description TEXT, -- Community description
    is_public BOOLEAN DEFAULT TRUE, -- Public or private community
    created_by UUID REFERENCES users(id) ON DELETE SET NULL, -- Creator of the community
    rules TEXT, -- Community rules
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Community Members Table
CREATE TABLE community_members (
     community_id UUID REFERENCES communities(id) ON DELETE CASCADE, -- Community ID
     user_id UUID REFERENCES users(id) ON DELETE CASCADE, -- User ID
   joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(), -- Timestamp
    PRIMARY KEY (community_id, user_id) -- Composite primary key
);
```

## Posts and Interactions

```sql
-- Posts Table
CREATE TABLE posts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(), -- Unique ID
    content TEXT NOT NULL, -- Post content
    community_id UUID REFERENCES communities(id) ON DELETE CASCADE, -- Community ID
    author_id UUID REFERENCES users(id) ON DELETE CASCADE, -- Author ID
    is_approved BOOLEAN DEFAULT FALSE,
    media_urls TEXT[],
    visibility TEXT DEFAULT 'public',
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'removed')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(), -- Timestamp
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() -- Timestamp
);

-- Comments Table
CREATE TABLE comments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(), -- Unique ID
    post_id UUID REFERENCES posts(id) ON DELETE CASCADE, -- Post ID
    author_id UUID REFERENCES users(id) ON DELETE CASCADE, -- Author ID
    content TEXT NOT NULL, -- Comment content
    parent_comment_id UUID REFERENCES comments(id) ON DELETE CASCADE, -- For nested replies
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'removed')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(), -- Timestamp
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() -- Timestamp
);

-- Reactions Table
CREATE TABLE reactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(), -- Unique ID
  post_id UUID REFERENCES posts(id) ON DELETE CASCADE, -- Post ID
  comment_id UUID REFERENCES comments(id) ON DELETE CASCADE, -- Comment ID
  user_id UUID REFERENCES users(id) ON DELETE CASCADE, -- User ID
  type TEXT NOT NULL, -- Reaction type: like, heart, etc.
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() -- Timestamp
);

-- Moderator Actions table
CREATE TABLE moderator_actions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  community_id UUID REFERENCES communities(id) ON DELETE CASCADE,
  moderator_id UUID REFERENCES users(id) ON DELETE CASCADE,
  target_user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  action_type TEXT CHECK (action_type IN ('warn', 'mute', 'remove_post', 'remove_comment')),
  reason TEXT NOT NULL,
  duration INTEGER, -- Duration in hours for mutes
  content_id UUID, -- Optional: Reference to post or comment that was moderated
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE -- For mute duration
);

-- Add mute_expires_at to community_members for temporary mutes
ALTER TABLE community_members ADD COLUMN mute_expires_at TIMESTAMP WITH TIME ZONE;
```

## Row Level Security (RLS) Policies

```sql
-- Users table
-- Select: Users can read their own profile and public profiles of others.
CREATE POLICY "Users can view their own profile and others' public profiles"
ON users
FOR SELECT
USING (
  id = auth.uid() -- View own profile
  OR (SELECT role FROM users WHERE id = auth.uid()) IN ('admin', 'super_admin') -- Admins see all
);

-- Update: Users can only update their own profile.
CREATE POLICY "Users can update their own profile"
ON users
FOR UPDATE
USING (id = auth.uid());

-- Delete: Admins only.
CREATE POLICY "Only super admin can delete users"
ON users
FOR DELETE
USING ((SELECT role FROM users WHERE id = auth.uid()) IN ('super_admin'));

-- Only super_admin can change roles, but can't create another super_admin
CREATE POLICY "super_admin_manage_roles" ON users
FOR UPDATE USING (
  (
    -- Current user must be super_admin
    (SELECT role FROM users WHERE id = auth.uid()) = 'super_admin'
    AND
    -- Can't set role to super_admin
    (NEW.role != 'super_admin' OR OLD.role = 'super_admin')
  )
  OR
  -- Users can update their own non-role fields
  (
    id = auth.uid()
    AND OLD.role = NEW.role -- Can't change own role
  )
);

-- Create function to sync user changes to auth.users
CREATE OR REPLACE FUNCTION sync_user_changes_to_auth()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Only sync if relevant fields changed
  IF (
    NEW.username != OLD.username OR
    NEW.profile_picture_url != OLD.profile_picture_url OR
    NEW.role != OLD.role
  ) THEN
    -- Update auth.users metadata
    UPDATE auth.users SET
      raw_user_meta_data = jsonb_build_object(
        'username', NEW.username,
        'profile_picture_url', NEW.profile_picture_url,
        'role', NEW.role
      )
    WHERE id = NEW.id;
  END IF;

  RETURN NEW;
END;
$$;

-- Create trigger to run the sync function
CREATE TRIGGER sync_user_changes
AFTER UPDATE ON users
FOR EACH ROW
EXECUTE FUNCTION sync_user_changes_to_auth();



-- Communities table
-- Select: Public communities visible to all, private ones only to members
CREATE POLICY "View public communities and joined private ones"
ON communities
FOR SELECT
USING (
    is_public = true  -- Anyone can view public communities
    OR created_by = auth.uid()  -- Creator can always view
    OR (SELECT role FROM users WHERE id = auth.uid()) IN ('admin', 'super_admin')  -- Admins can view all
    OR EXISTS (  -- Direct membership check without checking community visibility
        SELECT 1 FROM community_members
        WHERE community_id = communities.id
        AND user_id = auth.uid()
        AND status = 'approved'
    )
);

-- Insert: Only admins can create communities
CREATE POLICY "Only admins create communities"
ON communities
FOR INSERT
WITH CHECK ((SELECT role FROM users WHERE id = auth.uid()) IN ('admin', 'super_admin'));

-- Update: Only community creators and admins can update
CREATE POLICY "Creators and admins update communities"
ON communities
FOR UPDATE
USING (
    created_by = auth.uid()
    OR (SELECT role FROM users WHERE id = auth.uid()) IN ('admin', 'super_admin')
);

-- Delete: Only super admins can delete communities
-- Update the delete policy for communities
CREATE POLICY "Creators and super admins can delete communities"
ON communities
FOR DELETE
USING (
    -- Community creator can delete their own community
    created_by = auth.uid()
    OR
    -- Super admins can delete any community
    (SELECT role FROM users WHERE id = auth.uid()) = 'super_admin'
);


-- Community Members table
-- Base security: Enable RLS
ALTER TABLE community_members ENABLE ROW LEVEL SECURITY;

-- Clear existing policies to avoid conflicts
DROP POLICY IF EXISTS "View community members" ON community_members;
DROP POLICY IF EXISTS "Users can join public communities" ON community_members;
DROP POLICY IF EXISTS "Admins add to private communities" ON community_members;
DROP POLICY IF EXISTS "Users can leave or creators/admins can remove members" ON community_members;

-- Simple, non-recursive select policy
CREATE POLICY "members_select_policy"
ON community_members
FOR SELECT
USING (
    user_id = auth.uid()  -- Can see own memberships
    OR
    (SELECT role FROM users WHERE id = auth.uid()) IN ('admin', 'super_admin')  -- Admins see all
    OR
    community_id IN ( -- Can see other members of communities you're in
        SELECT cm.community_id
        FROM community_members cm
        WHERE cm.user_id = auth.uid()
    )
);

-- Insert policy - split into two non-recursive policies
CREATE POLICY "join_public_communities"
ON community_members
FOR INSERT
WITH CHECK (
    auth.uid() = user_id -- Can only insert for self
    AND
    EXISTS (
        SELECT 1 FROM communities c
        WHERE c.id = community_id
        AND c.is_public = true
    )
    AND
    NOT EXISTS ( -- Prevent duplicates
        SELECT 1 FROM community_members
        WHERE community_id = NEW.community_id
        AND user_id = NEW.user_id
    )
);

CREATE POLICY "admin_manage_members"
ON community_members
FOR INSERT
WITH CHECK (
    (SELECT role FROM users WHERE id = auth.uid()) IN ('admin', 'super_admin')
    OR
    EXISTS (
        SELECT 1 FROM communities c
        WHERE c.id = community_id
        AND c.created_by = auth.uid()
    )
);

-- Delete policy - simple conditions without recursion
CREATE POLICY "members_delete_policy"
ON community_members
FOR DELETE
USING (
    user_id = auth.uid() -- Can remove self
    OR
    (SELECT role FROM users WHERE id = auth.uid()) IN ('admin', 'super_admin') -- Admins can remove anyone
    OR
    EXISTS ( -- Community creator can remove members
        SELECT 1 FROM communities c
        WHERE c.id = community_id
        AND c.created_by = auth.uid()
    )
);

-- Moderator Actions table
-- Enable RLS
ALTER TABLE moderator_actions ENABLE ROW LEVEL SECURITY;

-- Select policy - Moderators, admins, and targets can view
CREATE POLICY "moderators_and_targets_view_actions"
ON moderator_actions
FOR SELECT
USING (
  -- Allow moderators and admins of the community to view
  EXISTS (
    SELECT 1 FROM community_members
    WHERE community_id = moderator_actions.community_id
    AND user_id = auth.uid()
    AND (role IN ('moderator', 'admin') OR status = 'approved')
  )
  OR
  -- Allow target users to view their own actions
  target_user_id = auth.uid()
  OR
  -- Allow super admins to view all
  (SELECT role FROM users WHERE id = auth.uid()) = 'super_admin'
);

-- Insert policy - Only moderators and admins can create
CREATE POLICY "moderators_create_actions"
ON moderator_actions
FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM community_members
    WHERE community_id = NEW.community_id
    AND user_id = auth.uid()
    AND role IN ('moderator', 'admin')
  )
  OR
  (SELECT role FROM users WHERE id = auth.uid()) IN ('admin', 'super_admin')
);

-- Update policy - Only the original moderator or admins can update
CREATE POLICY "moderators_update_actions"
ON moderator_actions
FOR UPDATE
USING (
  moderator_id = auth.uid()
  OR
  EXISTS (
    SELECT 1 FROM community_members
    WHERE community_id = moderator_actions.community_id
    AND user_id = auth.uid()
    AND role = 'admin'
  )
  OR
  (SELECT role FROM users WHERE id = auth.uid()) IN ('admin', 'super_admin')
);

-- Delete policy - Only admins can delete action records
CREATE POLICY "admins_delete_actions"
ON moderator_actions
FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM community_members
    WHERE community_id = moderator_actions.community_id
    AND user_id = auth.uid()
    AND role = 'admin'
  )
  OR
  (SELECT role FROM users WHERE id = auth.uid()) IN ('admin', 'super_admin')
);

-- Posts table
-- Select: Public posts visible to all, private ones only to community members
CREATE POLICY "Allow public posts to be read by everyone"
ON public.posts
FOR SELECT
TO authenticated, anon
USING (visibility = 'public');

CREATE POLICY "Allow community posts to be read by community members"
ON public.posts
FOR SELECT
TO authenticated
USING (
    visibility = 'community_only' AND
    (select auth.uid()) IN (
        SELECT user_id
        FROM public.community_members
        WHERE community_id = posts.community_id
    )
);

CREATE POLICY "Allow private posts to be read by the author only"
ON public.posts
FOR SELECT
TO authenticated
USING (
    (select auth.uid()) = author_id AND
    visibility = 'private'
);

CREATE POLICY "Allow posts from public communities to be read by any authenticated user"
ON public.posts
FOR SELECT
TO authenticated
USING (
    visibility = 'community_only'
    AND EXISTS (
        SELECT 1
        FROM communities
        WHERE id = posts.community_id
        AND is_public = true
    )
);

-- 2. Insert policy with visibility rules
CREATE POLICY "Users can create posts with proper visibility"
ON posts FOR INSERT
WITH CHECK (
    -- Author must be the authenticated user
    auth.uid() = author_id
    AND (
        -- Public posts can be created by anyone
        (visibility = 'public')
        OR
-- Community posts require membership
        (
            visibility = 'community_only'
            AND community_id IS NOT NULL
            AND EXISTS (
                SELECT 1 FROM community_members
                WHERE community_id = NEW.community_id
                AND user_id = auth.uid()
            )
        )
        OR
        -- Private posts can be created by anyone
        (visibility = 'private')
    ))

-- 3. Update policy
CREATE POLICY "Users can update their own posts"
ON posts FOR UPDATE
USING (author_id = auth.uid())
WITH CHECK (
    -- Cannot change author_id
    auth.uid() = author_id
    AND NEW.author_id = OLD.author_id
    -- Community posts must maintain membership
    AND (
        NEW.visibility != 'community_only'
        OR EXISTS (
            SELECT 1 FROM community_members
            WHERE community_id = NEW.community_id
            AND user_id = auth.uid()
        )
    )
);

-- 4. Delete policy
CREATE POLICY "Users can delete their own posts"
ON posts FOR DELETE
USING (author_id = auth.uid());

-- Add admin override policies
CREATE POLICY "Admins can manage all posts"
ON posts
USING ((SELECT role FROM users WHERE id = auth.uid()) IN ('admin', 'super_admin'));

-- Comments table
-- Comments table RLS policies

-- 1. Select policies - Match post visibility rules
CREATE POLICY "Anyone can view comments on public posts"
ON comments
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM posts
    WHERE id = comments.post_id
    AND visibility = 'public'
  )
);

CREATE POLICY "Community members can view comments on community posts"
ON comments
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM posts
    WHERE id = comments.post_id
    AND visibility = 'community_only'
    AND EXISTS (
      SELECT 1 FROM community_members
      WHERE community_id = posts.community_id
      AND user_id = auth.uid()
    )
  )
);

CREATE POLICY "Authors can view comments on their private posts"
ON comments
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM posts
    WHERE id = comments.post_id
    AND visibility = 'private'
    AND author_id = auth.uid()
  )
  OR author_id = auth.uid() -- Comment author can always see their comments
);

-- 2. Insert policy - Check post visibility and auth
CREATE POLICY "Users can comment based on post visibility"
ON comments
FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM posts
    WHERE id = comments.post_id
    AND (
      -- Public posts: anyone can comment
      visibility = 'public'
      OR
      -- Community posts: only members can comment
      (
        visibility = 'community_only'
        AND EXISTS (
          SELECT 1 FROM community_members
          WHERE community_id = posts.community_id
          AND user_id = auth.uid()
        )
      )
      OR
      -- Private posts: only author can comment
      (
        visibility = 'private'
        AND author_id = auth.uid()
      )
    )
  )
  -- Must be authenticated and be the comment author
  AND auth.uid() = comments.author_id
  -- For replies, parent comment must exist and be visible
  AND (
    comments.parent_comment_id IS NULL
    OR EXISTS (
      SELECT 1 FROM comments
      WHERE id = comments.parent_comment_id
      AND post_id = comments.post_id
    )
  )
);

-- 3. Update policy - Authors only
CREATE POLICY "Users can update their own comments"
ON comments
FOR UPDATE
USING (author_id = auth.uid())
WITH CHECK (
  -- Cannot change author or post
  comments.author_id = comments.author_id
  AND comments.post_id = comments.post_id
);

-- 4. Delete policy - Authors and post owners
CREATE POLICY "Users can delete their own comments or comments on their posts"
ON comments
FOR DELETE
USING (
  author_id = auth.uid()
  OR EXISTS (
    SELECT 1 FROM posts
    WHERE id = comments.post_id
    AND author_id = auth.uid()
  )
);

-- 5. Admin override
CREATE POLICY "Admins can manage all comments"
ON comments
USING ((SELECT role FROM users WHERE id = auth.uid()) IN ('admin', 'super_admin'));

-- Reactions table RLS policies

-- 1. Select policy - Users can view reactions on posts or comments they have access to
CREATE POLICY "Users can view reactions on posts and comments they can access"
ON reactions
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM posts
    WHERE id = reactions.post_id
    AND (
      visibility = 'public'
      OR
      (
        visibility = 'community_only'
        AND EXISTS (
          SELECT 1 FROM community_members
          WHERE community_id = posts.community_id
          AND user_id = auth.uid()
        )
      )
      OR
      (
        visibility = 'private'
        AND author_id = auth.uid()
      )
    )
  )
  OR
  EXISTS (
    SELECT 1 FROM comments
    WHERE id = reactions.comment_id
    AND (
      EXISTS (
        SELECT 1 FROM posts
        WHERE id = comments.post_id
        AND (
          visibility = 'public'
          OR
          (
            visibility = 'community_only'
            AND EXISTS (
              SELECT 1 FROM community_members
              WHERE community_id = posts.community_id
              AND user_id = auth.uid()
            )
          )
          OR
          (
            visibility = 'private'
            AND author_id = auth.uid()
          )
        )
      )
      OR author_id = auth.uid()
    )
  )
  OR user_id = auth.uid() -- Users can always see their own reactions
);

-- 2. Insert policy - Users can react only if they have access to the post or comment
CREATE POLICY "Users can insert reactions on posts or comments they can access"
ON reactions
FOR INSERT
WITH CHECK (
  auth.uid() = user_id
  AND (
    EXISTS (
      SELECT 1 FROM posts
      WHERE id = reactions.post_id
      AND (
        visibility = 'public'
        OR
        (
          visibility = 'community_only'
          AND EXISTS (
            SELECT 1 FROM community_members
            WHERE community_id = posts.community_id
            AND user_id = auth.uid()
          )
        )
        OR
        (
          visibility = 'private'
          AND author_id = auth.uid()
        )
      )
    )
    OR
    EXISTS (
      SELECT 1 FROM comments
      WHERE id = reactions.comment_id
      AND (
        EXISTS (
          SELECT 1 FROM posts
          WHERE id = comments.post_id
          AND (
            visibility = 'public'
            OR
            (
              visibility = 'community_only'
              AND EXISTS (
                SELECT 1 FROM community_members
                WHERE community_id = posts.community_id
                AND user_id = auth.uid()
              )
            )
            OR
            (
              visibility = 'private'
              AND author_id = auth.uid()
            )
          )
        )
        OR author_id = auth.uid()
      )
    )
  )
);

-- 3. Update policy - Users can update their own reactions
CREATE POLICY "Users can update their own reactions"
ON reactions
FOR UPDATE
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- 4. Delete policy - Users can delete their own reactions
CREATE POLICY "Users can delete their own reactions"
ON reactions
FOR DELETE
USING (user_id = auth.uid());

-- 5. Admin override
CREATE POLICY "Admins can manage all reactions"
ON reactions
USING ((SELECT role FROM users WHERE id = auth.uid()) IN ('admin', 'super_admin'));
```

## Triggers

```sql
-- Populate public.users on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER -- ⚠️ Critical for permissions!
AS $$
BEGIN
  INSERT INTO public.users (
    id,
    username,
    email,
    profile_picture_url,
    role
  )
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'username', 'user_' || NEW.id::TEXT),
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'profile_picture_url', '/default-avatar.png'),
    'user' -- Hardcode default role for security
  );
  RETURN NEW;
END;
$$;
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION public.handle_new_user();

CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Update timestamps trigger for users
CREATE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_users_timestamp
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_communities_timestamp
    BEFORE UPDATE ON communities
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_posts_timestamp
    BEFORE UPDATE ON posts
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_comments_timestamp
    BEFORE UPDATE ON comments
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
```

```markdown

```
