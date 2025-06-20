
-- Enhanced get_connection_suggestions function with multiple fallback strategies
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
  v_results_count integer := 0;
  v_user_city text;
BEGIN
  -- Check if user is authenticated
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'Authentication required';
  END IF;

  -- Calculate offset for pagination
  v_offset := (p_page_number - 1) * p_page_size;

  -- Get the user's city for location-based suggestions (if available)
  SELECT 
    COALESCE(
      (ul.address_details->>'city'), 
      ''
    ) INTO v_user_city
  FROM public.user_locations ul 
  WHERE ul.user_id = p_user_id 
    AND ul.is_primary = true
  LIMIT 1;

  -- Create a temporary table to collect results
  CREATE TEMP TABLE temp_connection_suggestions (
    user_id uuid,
    full_name text,
    username text,
    avatar_url text,
    profile_privacy_setting profile_privacy_enum,
    mutual_connections_count bigint,
    follow_status text,
    priority integer
  );

  -- Strategy 1: Friends of Friends (2nd degree connections)
  INSERT INTO temp_connection_suggestions
  WITH user_follows AS (
    SELECT following_id as friend_id
    FROM public.user_follows
    WHERE follower_id = p_user_id
  ),
  friends_of_friends AS (
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
    END as follow_status,
    1 as priority
  FROM friends_of_friends fof
  JOIN public.profiles p ON fof.suggested_user_id = p.id
  LEFT JOIN public.follow_requests fr ON p.id = fr.requestee_id 
    AND fr.requester_id = p_user_id 
    AND fr.status = 'pending'
  WHERE p.is_suspended = false
  ORDER BY fof.connection_count DESC, p.full_name ASC
  LIMIT p_page_size;

  -- Check how many results we have so far
  SELECT COUNT(*) INTO v_results_count FROM temp_connection_suggestions;

  -- Strategy 2: Community Leaders (if we need more results)
  IF v_results_count < p_page_size THEN
    INSERT INTO temp_connection_suggestions
    SELECT 
      p.id as user_id,
      p.full_name,
      p.username,
      p.avatar_url,
      p.profile_privacy_setting,
      0 as mutual_connections_count,
      CASE 
        WHEN fr.requestee_id IS NOT NULL THEN 'request_pending'
        ELSE 'not_following'
      END as follow_status,
      2 as priority
    FROM public.profiles p
    LEFT JOIN public.follow_requests fr ON p.id = fr.requestee_id 
      AND fr.requester_id = p_user_id 
      AND fr.status = 'pending'
    WHERE p.is_community_leader = true
      AND p.is_suspended = false
      AND p.id != p_user_id
      AND NOT EXISTS (
        SELECT 1 FROM public.user_follows 
        WHERE follower_id = p_user_id AND following_id = p.id
      )
      AND NOT EXISTS (
        SELECT 1 FROM temp_connection_suggestions 
        WHERE user_id = p.id
      )
    ORDER BY p.full_name ASC
    LIMIT (p_page_size - v_results_count);

    -- Update results count
    SELECT COUNT(*) INTO v_results_count FROM temp_connection_suggestions;
  END IF;

  -- Strategy 3: Location-based suggestions (if we have city data and need more results)
  IF v_results_count < p_page_size AND v_user_city IS NOT NULL AND v_user_city != '' THEN
    INSERT INTO temp_connection_suggestions
    SELECT 
      p.id as user_id,
      p.full_name,
      p.username,
      p.avatar_url,
      p.profile_privacy_setting,
      0 as mutual_connections_count,
      CASE 
        WHEN fr.requestee_id IS NOT NULL THEN 'request_pending'
        ELSE 'not_following'
      END as follow_status,
      3 as priority
    FROM public.profiles p
    INNER JOIN public.user_locations ul ON p.id = ul.user_id
    LEFT JOIN public.follow_requests fr ON p.id = fr.requestee_id 
      AND fr.requester_id = p_user_id 
      AND fr.status = 'pending'
    WHERE ul.is_primary = true
      AND (ul.address_details->>'city') = v_user_city
      AND p.is_suspended = false
      AND p.id != p_user_id
      AND NOT EXISTS (
        SELECT 1 FROM public.user_follows 
        WHERE follower_id = p_user_id AND following_id = p.id
      )
      AND NOT EXISTS (
        SELECT 1 FROM temp_connection_suggestions 
        WHERE user_id = p.id
      )
    ORDER BY p.full_name ASC
    LIMIT (p_page_size - v_results_count);

    -- Update results count
    SELECT COUNT(*) INTO v_results_count FROM temp_connection_suggestions;
  END IF;

  -- Strategy 4: Popular users (users with most followers, if we still need more results)
  IF v_results_count < p_page_size THEN
    INSERT INTO temp_connection_suggestions
    SELECT 
      p.id as user_id,
      p.full_name,
      p.username,
      p.avatar_url,
      p.profile_privacy_setting,
      0 as mutual_connections_count,
      CASE 
        WHEN fr.requestee_id IS NOT NULL THEN 'request_pending'
        ELSE 'not_following'
      END as follow_status,
      4 as priority
    FROM public.profiles p
    LEFT JOIN public.follow_requests fr ON p.id = fr.requestee_id 
      AND fr.requester_id = p_user_id 
      AND fr.status = 'pending'
    LEFT JOIN (
      SELECT following_id, COUNT(*) as follower_count
      FROM public.user_follows
      GROUP BY following_id
    ) fc ON p.id = fc.following_id
    WHERE p.is_suspended = false
      AND p.id != p_user_id
      AND NOT EXISTS (
        SELECT 1 FROM public.user_follows 
        WHERE follower_id = p_user_id AND following_id = p.id
      )
      AND NOT EXISTS (
        SELECT 1 FROM temp_connection_suggestions 
        WHERE user_id = p.id
      )
    ORDER BY COALESCE(fc.follower_count, 0) DESC, p.full_name ASC
    LIMIT (p_page_size - v_results_count);
  END IF;

  -- Return final results ordered by priority and mutual connections
  RETURN QUERY
  SELECT 
    tcs.user_id,
    tcs.full_name,
    tcs.username,
    tcs.avatar_url,
    tcs.profile_privacy_setting,
    tcs.mutual_connections_count,
    tcs.follow_status
  FROM temp_connection_suggestions tcs
  ORDER BY tcs.priority ASC, tcs.mutual_connections_count DESC, tcs.full_name ASC
  LIMIT p_page_size OFFSET v_offset;

  -- Clean up
  DROP TABLE temp_connection_suggestions;
END;
$function$;
