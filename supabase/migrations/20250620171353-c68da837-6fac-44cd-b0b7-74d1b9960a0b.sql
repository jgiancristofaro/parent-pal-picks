
-- Update the get_onboarding_suggestions function to prioritize community leaders for new users
CREATE OR REPLACE FUNCTION public.get_onboarding_suggestions(p_user_id uuid, p_limit integer DEFAULT 10)
 RETURNS TABLE(user_id uuid, full_name text, username text, avatar_url text, profile_privacy_setting profile_privacy_enum, suggestion_type text, mutual_connections_count bigint)
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public', 'extensions'
AS $function$
DECLARE
  v_results_count integer := 0;
  v_user_city text;
BEGIN
  -- Check if user is authenticated
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'Authentication required';
  END IF;

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
  CREATE TEMP TABLE temp_suggestions (
    user_id uuid,
    full_name text,
    username text,
    avatar_url text,
    profile_privacy_setting profile_privacy_enum,
    suggestion_type text,
    mutual_connections_count bigint,
    priority integer
  );

  -- Step 1: Global Community Leaders (prioritized for new users)
  INSERT INTO temp_suggestions
  SELECT 
    p.id as user_id,
    p.full_name,
    p.username,
    p.avatar_url,
    p.profile_privacy_setting,
    'global_community_leader' as suggestion_type,
    0 as mutual_connections_count,
    1 as priority
  FROM public.profiles p
  WHERE p.is_community_leader = true
    AND p.is_suspended = false
    AND p.id != p_user_id  -- Exclude the user themselves
    AND NOT EXISTS (
      -- Exclude users already followed
      SELECT 1 FROM public.user_follows uf 
      WHERE uf.follower_id = p_user_id 
        AND uf.following_id = p.id
    )
    AND NOT EXISTS (
      -- Exclude pending follow requests
      SELECT 1 FROM public.follow_requests fr 
      WHERE fr.requester_id = p_user_id 
        AND fr.requestee_id = p.id 
        AND fr.status = 'pending'
    )
  ORDER BY p.full_name ASC
  LIMIT p_limit;

  -- Update results count
  SELECT COUNT(*) INTO v_results_count FROM temp_suggestions;

  -- Step 2: Friends of Friends (if we need more results and user has connections)
  IF v_results_count < p_limit THEN
    INSERT INTO temp_suggestions
    SELECT 
      p.id as user_id,
      p.full_name,
      p.username,
      p.avatar_url,
      p.profile_privacy_setting,
      'friends_of_friends' as suggestion_type,
      COUNT(DISTINCT uf1.following_id) as mutual_connections_count,
      2 as priority
    FROM public.user_follows uf1
    INNER JOIN public.user_follows uf2 ON uf1.following_id = uf2.follower_id
    INNER JOIN public.profiles p ON uf2.following_id = p.id
    WHERE uf1.follower_id = p_user_id
      AND uf2.following_id != p_user_id  -- Exclude the user themselves
      AND p.is_suspended = false
      AND NOT EXISTS (
        -- Exclude users already followed
        SELECT 1 FROM public.user_follows uf3 
        WHERE uf3.follower_id = p_user_id 
          AND uf3.following_id = p.id
      )
      AND NOT EXISTS (
        -- Exclude pending follow requests
        SELECT 1 FROM public.follow_requests fr 
        WHERE fr.requester_id = p_user_id 
          AND fr.requestee_id = p.id 
          AND fr.status = 'pending'
      )
      AND NOT EXISTS (
        -- Exclude users already in temp_suggestions
        SELECT 1 FROM temp_suggestions ts 
        WHERE ts.user_id = p.id
      )
    GROUP BY p.id, p.full_name, p.username, p.avatar_url, p.profile_privacy_setting
    ORDER BY mutual_connections_count DESC, p.full_name ASC
    LIMIT (p_limit - v_results_count);

    -- Update results count
    SELECT COUNT(*) INTO v_results_count FROM temp_suggestions;
  END IF;

  -- Step 3: Local Community Leaders (if we have location data and need more results)
  IF v_results_count < p_limit AND v_user_city IS NOT NULL AND v_user_city != '' THEN
    INSERT INTO temp_suggestions
    SELECT 
      p.id as user_id,
      p.full_name,
      p.username,
      p.avatar_url,
      p.profile_privacy_setting,
      'local_community_leader' as suggestion_type,
      0 as mutual_connections_count,
      3 as priority
    FROM public.profiles p
    INNER JOIN public.user_locations ul ON p.id = ul.user_id
    WHERE p.is_community_leader = true
      AND p.is_suspended = false
      AND p.id != p_user_id  -- Exclude the user themselves
      AND ul.is_primary = true
      AND (ul.address_details->>'city') = v_user_city
      AND NOT EXISTS (
        -- Exclude users already followed
        SELECT 1 FROM public.user_follows uf 
        WHERE uf.follower_id = p_user_id 
          AND uf.following_id = p.id
      )
      AND NOT EXISTS (
        -- Exclude pending follow requests
        SELECT 1 FROM public.follow_requests fr 
        WHERE fr.requester_id = p_user_id 
          AND fr.requestee_id = p.id 
          AND fr.status = 'pending'
      )
      AND NOT EXISTS (
        -- Exclude users already in temp_suggestions
        SELECT 1 FROM temp_suggestions ts 
        WHERE ts.user_id = p.id
      )
    ORDER BY p.full_name ASC
    LIMIT (p_limit - v_results_count);
  END IF;

  -- Return final results ordered by priority and mutual connections
  RETURN QUERY
  SELECT 
    ts.user_id,
    ts.full_name,
    ts.username,
    ts.avatar_url,
    ts.profile_privacy_setting,
    ts.suggestion_type,
    ts.mutual_connections_count
  FROM temp_suggestions ts
  ORDER BY ts.priority ASC, ts.mutual_connections_count DESC, ts.full_name ASC
  LIMIT p_limit;

  -- Clean up
  DROP TABLE temp_suggestions;
END;
$function$
