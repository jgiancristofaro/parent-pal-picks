
-- Step 1: Enable pg_trgm extension for fuzzy text searching
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- Step 2: Create performance indexes
-- GIN indexes for fuzzy text searching on full_name and username
CREATE INDEX IF NOT EXISTS idx_profiles_full_name_gin_trgm 
ON public.profiles USING gin (full_name gin_trgm_ops);

CREATE INDEX IF NOT EXISTS idx_profiles_username_gin_trgm 
ON public.profiles USING gin (username gin_trgm_ops);

-- Standard indexes for email and phone_number (assuming email will be added later)
CREATE INDEX IF NOT EXISTS idx_profiles_phone_number 
ON public.profiles (phone_number);

-- Additional indexes for follow relationships to optimize suggestions
CREATE INDEX IF NOT EXISTS idx_user_follows_follower_id 
ON public.user_follows (follower_id);

CREATE INDEX IF NOT EXISTS idx_user_follows_following_id 
ON public.user_follows (following_id);

CREATE INDEX IF NOT EXISTS idx_follow_requests_requester_requestee 
ON public.follow_requests (requester_id, requestee_id, status);

-- Step 3: Create unified search function
CREATE OR REPLACE FUNCTION public.search_all_profiles(search_term text)
RETURNS TABLE(
  id uuid,
  full_name text,
  username text,
  avatar_url text,
  profile_privacy_setting profile_privacy_enum,
  follow_status text,
  similarity_score real
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  current_user_id uuid;
  clean_phone text;
BEGIN
  -- Get the current user ID
  current_user_id := auth.uid();
  
  IF current_user_id IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;
  
  -- Clean phone number (remove all non-numeric characters)
  clean_phone := regexp_replace(search_term, '[^0-9]', '', 'g');
  
  RETURN QUERY
  WITH search_results AS (
    SELECT 
      p.id,
      p.full_name,
      p.username,
      p.avatar_url,
      p.profile_privacy_setting,
      CASE 
        WHEN uf.following_id IS NOT NULL THEN 'following'
        WHEN fr.requestee_id IS NOT NULL THEN 'request_pending'
        ELSE 'not_following'
      END as follow_status,
      GREATEST(
        COALESCE(similarity(p.full_name, search_term), 0),
        COALESCE(similarity(p.username, search_term), 0),
        -- Boost exact phone matches
        CASE 
          WHEN clean_phone != '' AND p.phone_number = clean_phone THEN 1.0
          ELSE 0
        END
      ) as similarity_score
    FROM public.profiles p
    LEFT JOIN public.user_follows uf ON p.id = uf.following_id AND uf.follower_id = current_user_id
    LEFT JOIN public.follow_requests fr ON p.id = fr.requestee_id 
      AND fr.requester_id = current_user_id 
      AND fr.status = 'pending'
    WHERE 
      p.id != current_user_id
      AND (
        -- Fuzzy matching on full_name and username
        (p.full_name % search_term)
        OR (p.username % search_term)
        -- Phone number matching (only if phone_number_searchable is true)
        OR (clean_phone != '' AND p.phone_number = clean_phone AND p.phone_number_searchable = true)
      )
  )
  SELECT 
    sr.id,
    sr.full_name,
    sr.username,
    sr.avatar_url,
    sr.profile_privacy_setting,
    sr.follow_status,
    sr.similarity_score
  FROM search_results sr
  WHERE sr.similarity_score > 0.1  -- Filter out very low similarity matches
  ORDER BY sr.similarity_score DESC, sr.full_name ASC;
END;
$$;

-- Step 4: Create suggestions function for "friends of friends"
CREATE OR REPLACE FUNCTION public.get_suggested_profiles()
RETURNS TABLE(
  id uuid,
  full_name text,
  username text,
  avatar_url text,
  profile_privacy_setting profile_privacy_enum,
  follow_status text,
  mutual_connections_count bigint
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  current_user_id uuid;
BEGIN
  -- Get the current user ID
  current_user_id := auth.uid();
  
  IF current_user_id IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;
  
  RETURN QUERY
  WITH user_follows AS (
    -- Get all users that the current user follows
    SELECT following_id as friend_id
    FROM public.user_follows
    WHERE follower_id = current_user_id
  ),
  friends_of_friends AS (
    -- Get all users that the current user's friends follow
    SELECT 
      uf2.following_id as suggested_user_id,
      COUNT(DISTINCT uf2.follower_id) as connection_count
    FROM user_follows uf1
    JOIN public.user_follows uf2 ON uf1.friend_id = uf2.follower_id
    WHERE uf2.following_id != current_user_id  -- Exclude current user
      AND uf2.following_id NOT IN (
        -- Exclude users already followed by current user
        SELECT following_id 
        FROM public.user_follows 
        WHERE follower_id = current_user_id
      )
    GROUP BY uf2.following_id
  )
  SELECT 
    p.id,
    p.full_name,
    p.username,
    p.avatar_url,
    p.profile_privacy_setting,
    CASE 
      WHEN fr.requestee_id IS NOT NULL THEN 'request_pending'
      ELSE 'not_following'
    END as follow_status,
    fof.connection_count as mutual_connections_count
  FROM friends_of_friends fof
  JOIN public.profiles p ON fof.suggested_user_id = p.id
  LEFT JOIN public.follow_requests fr ON p.id = fr.requestee_id 
    AND fr.requester_id = current_user_id 
    AND fr.status = 'pending'
  ORDER BY fof.connection_count DESC, p.full_name ASC
  LIMIT 50;  -- Limit to top 50 suggestions
END;
$$;
