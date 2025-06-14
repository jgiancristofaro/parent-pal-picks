
-- Phase 1: RLS Policy Optimization - Cache auth.uid() calls and fix complex logic
-- Phase 2: Policy Consolidation - Merge duplicate policies into efficient single policies  
-- Phase 3: Index Cleanup - Remove remaining duplicate indexes

-- Phase 1: Fix flagged_content policy with proper admin detection
DROP POLICY IF EXISTS "Consolidated flagged_content policy" ON public.flagged_content;
CREATE POLICY "Consolidated flagged_content policy" ON public.flagged_content FOR ALL
USING ((SELECT auth.uid()) = reported_by_user_id OR EXISTS(SELECT 1 FROM public.profiles WHERE id = (SELECT auth.uid()) AND role = 'ADMIN'))
WITH CHECK ((SELECT auth.uid()) IS NOT NULL OR EXISTS(SELECT 1 FROM public.profiles WHERE id = (SELECT auth.uid()) AND role = 'ADMIN'));

-- Phase 2: Consolidate follow_requests policies (currently has 12+ policies)
DROP POLICY IF EXISTS "Requester can manage own requests" ON public.follow_requests;
DROP POLICY IF EXISTS "Requestee can read pending requests" ON public.follow_requests;
DROP POLICY IF EXISTS "Requesters can delete their pending requests" ON public.follow_requests;
DROP POLICY IF EXISTS "Requestee can update request status" ON public.follow_requests;
DROP POLICY IF EXISTS "Requesters can view their own requests" ON public.follow_requests;
DROP POLICY IF EXISTS "Requestees can view requests to them" ON public.follow_requests;
DROP POLICY IF EXISTS "Requesters can create requests" ON public.follow_requests;
DROP POLICY IF EXISTS "Requestees can respond to requests" ON public.follow_requests;
DROP POLICY IF EXISTS "Users can view requests sent to them" ON public.follow_requests;
DROP POLICY IF EXISTS "Users can view requests they sent" ON public.follow_requests;
DROP POLICY IF EXISTS "Users can create follow requests" ON public.follow_requests;
DROP POLICY IF EXISTS "Users can update requests sent to them" ON public.follow_requests;
DROP POLICY IF EXISTS "Users can delete requests they sent" ON public.follow_requests;

CREATE POLICY "Consolidated follow_requests_insert" ON public.follow_requests 
FOR INSERT WITH CHECK ((SELECT auth.uid()) = requester_id);

CREATE POLICY "Consolidated follow_requests_select" ON public.follow_requests 
FOR SELECT USING ((SELECT auth.uid()) = requester_id OR (SELECT auth.uid()) = requestee_id);

CREATE POLICY "Consolidated follow_requests_update" ON public.follow_requests 
FOR UPDATE USING ((SELECT auth.uid()) = requestee_id) 
WITH CHECK (status IN ('approved', 'denied'));

-- Consolidate profiles policies
DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can select public profile data" ON public.profiles;
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can view public profile fields" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Anyone can view profiles" ON public.profiles;
DROP POLICY IF EXISTS "Users can view all profiles" ON public.profiles;

CREATE POLICY "Consolidated profiles_insert" ON public.profiles 
FOR INSERT WITH CHECK ((SELECT auth.uid()) = id);

CREATE POLICY "Consolidated profiles_select" ON public.profiles 
FOR SELECT USING (true);

CREATE POLICY "Consolidated profiles_update" ON public.profiles 
FOR UPDATE USING ((SELECT auth.uid()) = id) 
WITH CHECK ((SELECT auth.uid()) = id);

-- Consolidate user_follows policies
DROP POLICY IF EXISTS "Users can follow others" ON public.user_follows;
DROP POLICY IF EXISTS "Users can unfollow" ON public.user_follows;
DROP POLICY IF EXISTS "Users can view their own follows" ON public.user_follows;
DROP POLICY IF EXISTS "Users can create their own follows" ON public.user_follows;
DROP POLICY IF EXISTS "Users can delete their own follows" ON public.user_follows;
DROP POLICY IF EXISTS "Users can view all follows" ON public.user_follows;

CREATE POLICY "Consolidated user_follows_insert" ON public.user_follows 
FOR INSERT WITH CHECK ((SELECT auth.uid()) = follower_id);

CREATE POLICY "Consolidated user_follows_select" ON public.user_follows 
FOR SELECT USING (true);

CREATE POLICY "Consolidated user_follows_delete" ON public.user_follows 
FOR DELETE USING ((SELECT auth.uid()) = follower_id);

-- Consolidate reviews policies
DROP POLICY IF EXISTS "Users can create their own reviews" ON public.reviews;
DROP POLICY IF EXISTS "Users can update their own reviews" ON public.reviews;
DROP POLICY IF EXISTS "Users can delete their own reviews" ON public.reviews;
DROP POLICY IF EXISTS "Users can only reference their own locations in reviews" ON public.reviews;
DROP POLICY IF EXISTS "Anyone can view reviews" ON public.reviews;

CREATE POLICY "Consolidated reviews_insert" ON public.reviews 
FOR INSERT WITH CHECK ((SELECT auth.uid()) = user_id);

CREATE POLICY "Consolidated reviews_select" ON public.reviews 
FOR SELECT USING (true);

CREATE POLICY "Consolidated reviews_update" ON public.reviews 
FOR UPDATE USING ((SELECT auth.uid()) = user_id) 
WITH CHECK ((SELECT auth.uid()) = user_id);

CREATE POLICY "Consolidated reviews_delete" ON public.reviews 
FOR DELETE USING ((SELECT auth.uid()) = user_id);

-- Optimize activity_feed policies
DROP POLICY IF EXISTS "Users can view activity from people they follow" ON public.activity_feed;
DROP POLICY IF EXISTS "Users can create their own activity" ON public.activity_feed;

CREATE POLICY "Consolidated activity_feed_select" ON public.activity_feed 
FOR SELECT USING (true);

CREATE POLICY "Consolidated activity_feed_insert" ON public.activity_feed 
FOR INSERT WITH CHECK ((SELECT auth.uid()) = user_id);

-- Optimize user_locations policies
DROP POLICY IF EXISTS "Users can view their own locations" ON public.user_locations;
DROP POLICY IF EXISTS "Users can create their own locations" ON public.user_locations;
DROP POLICY IF EXISTS "Users can update their own locations" ON public.user_locations;
DROP POLICY IF EXISTS "Users can delete their own locations" ON public.user_locations;

CREATE POLICY "Consolidated user_locations_select" ON public.user_locations 
FOR SELECT USING ((SELECT auth.uid()) = user_id);

CREATE POLICY "Consolidated user_locations_insert" ON public.user_locations 
FOR INSERT WITH CHECK ((SELECT auth.uid()) = user_id);

CREATE POLICY "Consolidated user_locations_update" ON public.user_locations 
FOR UPDATE USING ((SELECT auth.uid()) = user_id) 
WITH CHECK ((SELECT auth.uid()) = user_id);

CREATE POLICY "Consolidated user_locations_delete" ON public.user_locations 
FOR DELETE USING ((SELECT auth.uid()) = user_id);

-- Optimize user_favorites policies  
DROP POLICY IF EXISTS "Users can view their own favorites" ON public.user_favorites;
DROP POLICY IF EXISTS "Users can create their own favorites" ON public.user_favorites;
DROP POLICY IF EXISTS "Users can delete their own favorites" ON public.user_favorites;

CREATE POLICY "Consolidated user_favorites_select" ON public.user_favorites 
FOR SELECT USING ((SELECT auth.uid()) = user_id);

CREATE POLICY "Consolidated user_favorites_insert" ON public.user_favorites 
FOR INSERT WITH CHECK ((SELECT auth.uid()) = user_id);

CREATE POLICY "Consolidated user_favorites_delete" ON public.user_favorites 
FOR DELETE USING ((SELECT auth.uid()) = user_id);

-- Optimize audit_log policies for admin operations
DROP POLICY IF EXISTS "Admins can view audit logs" ON public.audit_log;
DROP POLICY IF EXISTS "Admins can create audit logs" ON public.audit_log;

CREATE POLICY "Consolidated audit_log_select" ON public.audit_log 
FOR SELECT USING (EXISTS(SELECT 1 FROM public.profiles WHERE id = (SELECT auth.uid()) AND role = 'ADMIN'));

CREATE POLICY "Consolidated audit_log_insert" ON public.audit_log 
FOR INSERT WITH CHECK (EXISTS(SELECT 1 FROM public.profiles WHERE id = (SELECT auth.uid()) AND role = 'ADMIN'));

-- Phase 3: Clean up any remaining duplicate indexes (some may have been missed)
DROP INDEX IF EXISTS public.profiles_full_name_gin_idx;
DROP INDEX IF EXISTS public.profiles_username_gin_idx; 
DROP INDEX IF EXISTS public.profiles_phone_number_gin_idx;
DROP INDEX IF EXISTS public.idx_profiles_username;
DROP INDEX IF EXISTS public.idx_profiles_phone_number;

-- Remove any duplicate unique constraints
ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_username_unique;
ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_phone_unique;

-- Create essential optimized indexes if they don't exist
CREATE INDEX IF NOT EXISTS idx_profiles_phone_searchable ON public.profiles (phone_number) WHERE phone_number_searchable = true;
CREATE INDEX IF NOT EXISTS idx_user_follows_composite ON public.user_follows (follower_id, following_id);
CREATE INDEX IF NOT EXISTS idx_follow_requests_pending ON public.follow_requests (requestee_id) WHERE status = 'pending';
CREATE INDEX IF NOT EXISTS idx_reviews_ratings ON public.reviews (rating) WHERE rating >= 4;
CREATE INDEX IF NOT EXISTS idx_user_locations_user ON public.user_locations (user_id, is_primary);
