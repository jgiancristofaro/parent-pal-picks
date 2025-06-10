
-- Create a new RPC function to get profile with follow status
CREATE OR REPLACE FUNCTION public.get_profile_with_follow_status(target_user_id uuid)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  profile_data json;
  follow_status_value text;
BEGIN
  -- Get the current user ID
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  -- Get the profile data
  SELECT row_to_json(p)
  INTO profile_data
  FROM public.profiles p
  WHERE p.id = target_user_id;

  IF profile_data IS NULL THEN
    RAISE EXCEPTION 'Profile not found';
  END IF;

  -- Determine follow status
  IF target_user_id = auth.uid() THEN
    follow_status_value := 'own_profile';
  ELSE
    -- Check if already following
    IF EXISTS(
      SELECT 1 FROM public.user_follows 
      WHERE follower_id = auth.uid() AND following_id = target_user_id
    ) THEN
      follow_status_value := 'following';
    -- Check if pending request exists
    ELSIF EXISTS(
      SELECT 1 FROM public.follow_requests 
      WHERE requester_id = auth.uid() 
      AND requestee_id = target_user_id 
      AND status = 'pending'
    ) THEN
      follow_status_value := 'request_pending';
    ELSE
      follow_status_value := 'not_following';
    END IF;
  END IF;

  -- Add follow_status to the profile data
  SELECT json_build_object(
    'id', profile_data->>'id',
    'full_name', profile_data->>'full_name',
    'username', profile_data->>'username',
    'avatar_url', profile_data->>'avatar_url',
    'profile_privacy_setting', profile_data->>'profile_privacy_setting',
    'phone_number', profile_data->>'phone_number',
    'phone_number_searchable', profile_data->>'phone_number_searchable',
    'bio', profile_data->>'bio',
    'identity_tag', profile_data->>'identity_tag',
    'created_at', profile_data->>'created_at',
    'updated_at', profile_data->>'updated_at',
    'last_activity_feed_view_at', profile_data->>'last_activity_feed_view_at',
    'last_alerts_viewed_at', profile_data->>'last_alerts_viewed_at',
    'last_login_at', profile_data->>'last_login_at',
    'follow_status', follow_status_value
  ) INTO profile_data;

  RETURN profile_data;
END;
$$;
