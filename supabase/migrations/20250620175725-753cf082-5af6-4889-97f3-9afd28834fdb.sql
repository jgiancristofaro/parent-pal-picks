
-- Create the primary suggestions function for the Connections Hub
CREATE OR REPLACE FUNCTION public.get_connection_suggestions(
  p_user_id uuid,
  p_page_number integer DEFAULT 1,
  p_page_size integer DEFAULT 20
)
RETURNS TABLE(
  user_id uuid,
  full_name text,
  username text,
  avatar_url text,
  profile_privacy_setting profile_privacy_enum,
  mutual_connections_count bigint,
  follow_status text
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public', 'extensions'
AS $function$
DECLARE
  v_offset integer;
BEGIN
  -- Check if user is authenticated
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'Authentication required';
  END IF;

  -- Calculate offset for pagination
  v_offset := (p_page_number - 1) * p_page_size;

  RETURN QUERY
  WITH user_follows AS (
    -- Get all users that the current user follows
    SELECT following_id as friend_id
    FROM public.user_follows
    WHERE follower_id = p_user_id
  ),
  friends_of_friends AS (
    -- Get all users that the current user's friends follow (2nd degree connections)
    SELECT 
      uf2.following_id as suggested_user_id,
      COUNT(DISTINCT uf2.follower_id) as connection_count
    FROM user_follows uf1
    JOIN public.user_follows uf2 ON uf1.friend_id = uf2.follower_id
    WHERE uf2.following_id != p_user_id  -- Exclude current user
      AND uf2.following_id NOT IN (
        -- Exclude users already followed by current user
        SELECT following_id 
        FROM public.user_follows 
        WHERE follower_id = p_user_id
      )
    GROUP BY uf2.following_id
  )
  SELECT 
    p.id as user_id,
    p.full_name,
    p.username,
    p.avatar_url,
    p.profile_privacy_setting,
    fof.connection_count as mutual_connections_count,
    CASE 
      WHEN fr.requestee_id IS NOT NULL THEN 'request_pending'
      ELSE 'not_following'
    END as follow_status
  FROM friends_of_friends fof
  JOIN public.profiles p ON fof.suggested_user_id = p.id
  LEFT JOIN public.follow_requests fr ON p.id = fr.requestee_id 
    AND fr.requester_id = p_user_id 
    AND fr.status = 'pending'
  WHERE p.is_suspended = false  -- Exclude suspended users
  ORDER BY fof.connection_count DESC, p.full_name ASC
  LIMIT p_page_size OFFSET v_offset;
END;
$function$;

-- Create the advanced search function for the Connections Hub
CREATE OR REPLACE FUNCTION public.search_profiles_advanced(
  p_search_term text,
  p_city text DEFAULT NULL,
  p_workplace text DEFAULT NULL,
  p_page_number integer DEFAULT 1,
  p_page_size integer DEFAULT 20
)
RETURNS TABLE(
  user_id uuid,
  full_name text,
  username text,
  avatar_url text,
  profile_privacy_setting profile_privacy_enum,
  follow_status text,
  similarity_score real,
  city text,
  workplace text
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public', 'extensions'
AS $function$
DECLARE
  current_user_id uuid;
  v_offset integer;
  clean_phone text;
BEGIN
  -- Get the current user ID
  current_user_id := auth.uid();
  
  IF current_user_id IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;
  
  -- Calculate offset for pagination
  v_offset := (p_page_number - 1) * p_page_size;
  
  -- Clean phone number (remove all non-numeric characters)
  clean_phone := regexp_replace(p_search_term, '[^0-9]', '', 'g');
  
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
        COALESCE(similarity(p.full_name, p_search_term), 0),
        COALESCE(similarity(p.username, p_search_term), 0),
        -- Boost exact phone matches
        CASE 
          WHEN clean_phone != '' AND p.phone_number = clean_phone THEN 1.0
          ELSE 0
        END
      ) as similarity_score,
      -- Get city from primary location
      COALESCE(
        (ul.address_details->>'city'), 
        ''
      ) as user_city,
      -- Placeholder for workplace (can be extended later)
      '' as user_workplace
    FROM public.profiles p
    LEFT JOIN public.user_follows uf ON p.id = uf.following_id AND uf.follower_id = current_user_id
    LEFT JOIN public.follow_requests fr ON p.id = fr.requestee_id 
      AND fr.requester_id = current_user_id 
      AND fr.status = 'pending'
    LEFT JOIN public.user_locations ul ON p.id = ul.user_id AND ul.is_primary = true
    WHERE 
      p.id != current_user_id
      AND p.is_suspended = false
      AND (
        -- Name/username matching
        (p.full_name % p_search_term)
        OR (p.username % p_search_term)
        -- Phone number matching (only if phone_number_searchable is true)
        OR (clean_phone != '' AND p.phone_number = clean_phone AND p.phone_number_searchable = true)
      )
      -- City filter (if provided)
      AND (p_city IS NULL OR LOWER(COALESCE(ul.address_details->>'city', '')) ILIKE LOWER('%' || p_city || '%'))
      -- Workplace filter (placeholder for future implementation)
      AND (p_workplace IS NULL OR TRUE) -- Currently always true, can be extended
  )
  SELECT 
    sr.id as user_id,
    sr.full_name,
    sr.username,
    sr.avatar_url,
    sr.profile_privacy_setting,
    sr.follow_status,
    sr.similarity_score,
    sr.user_city as city,
    sr.user_workplace as workplace
  FROM search_results sr
  WHERE sr.similarity_score > 0.1  -- Filter out very low similarity matches
  ORDER BY sr.similarity_score DESC, sr.full_name ASC
  LIMIT p_page_size OFFSET v_offset;
END;
$function$;
