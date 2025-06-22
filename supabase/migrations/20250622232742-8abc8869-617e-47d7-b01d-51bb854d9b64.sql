
-- Update the handle_new_user function to set last_activity_feed_view_at to NULL for new users
-- This allows them to see historical activities from accounts they follow
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public', 'extensions'
AS $$
DECLARE
  referrer_user_id UUID;
BEGIN
  -- Handle referral code if provided
  IF NEW.raw_user_meta_data ->> 'referral_code' IS NOT NULL THEN
    -- Find the referrer using the validate_referral_code function
    SELECT user_id INTO referrer_user_id
    FROM public.validate_referral_code(NEW.raw_user_meta_data ->> 'referral_code')
    LIMIT 1;
  END IF;

  -- Insert the new user profile
  INSERT INTO public.profiles (
    id, 
    first_name, 
    last_name, 
    full_name, 
    phone_number, 
    profile_privacy_setting, 
    phone_number_searchable,
    referral_code,
    referred_by_user_id,
    last_activity_feed_view_at -- Explicitly set this to NULL for new users
  )
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data ->> 'first_name', ''),
    COALESCE(NEW.raw_user_meta_data ->> 'last_name', ''),
    TRIM(CONCAT(
      COALESCE(NEW.raw_user_meta_data ->> 'first_name', ''), 
      ' ', 
      COALESCE(NEW.raw_user_meta_data ->> 'last_name', '')
    )),
    NEW.raw_user_meta_data ->> 'phone_number',
    COALESCE(
      (NEW.raw_user_meta_data ->> 'profile_privacy_setting')::public.profile_privacy_enum,
      'private'::public.profile_privacy_enum
    ),
    COALESCE((NEW.raw_user_meta_data ->> 'phone_number_searchable')::boolean, false),
    public.generate_referral_code(),
    referrer_user_id,
    NULL -- Set to NULL so new users see historical activities
  );
  
  -- Create referral relationship if there was a referrer
  IF referrer_user_id IS NOT NULL THEN
    INSERT INTO public.user_referrals (referrer_id, referred_id)
    VALUES (referrer_user_id, NEW.id);
    
    -- Award badges to the referrer
    PERFORM public.award_connector_badges(referrer_user_id);
  END IF;
  
  RETURN NEW;
END;
$$;

-- Fix existing new users who might have been affected by this issue
-- Update users created in the last 7 days who have never viewed their activity feed
-- and have the same timestamp for created_at and last_activity_feed_view_at
UPDATE public.profiles 
SET last_activity_feed_view_at = NULL
WHERE created_at >= NOW() - INTERVAL '7 days'
  AND last_activity_feed_view_at IS NOT NULL
  AND ABS(EXTRACT(EPOCH FROM (created_at - last_activity_feed_view_at))) < 1; -- Within 1 second, indicating they were set at the same time
