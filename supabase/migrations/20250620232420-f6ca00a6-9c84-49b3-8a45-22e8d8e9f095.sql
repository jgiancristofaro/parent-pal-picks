
-- Fix the database trigger and referral system
-- This migration ensures the handle_new_user function can properly access all referral functions

-- First, ensure the generate_referral_code function exists with proper security
CREATE OR REPLACE FUNCTION public.generate_referral_code()
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public', 'extensions'
AS $$
DECLARE
  code TEXT;
  exists_check BOOLEAN;
BEGIN
  LOOP
    -- Generate a code like REF + 6 random uppercase alphanumeric characters
    code := 'REF' || upper(substring(md5(random()::text) from 1 for 6));
    
    -- Check if code already exists
    SELECT EXISTS(SELECT 1 FROM public.profiles WHERE referral_code = code) INTO exists_check;
    
    -- If code doesn't exist, we can use it
    IF NOT exists_check THEN
      EXIT;
    END IF;
  END LOOP;
  
  RETURN code;
END;
$$;

-- Update the handle_new_user function with correct search path and referral handling
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
    referred_by_user_id
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
    referrer_user_id
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

-- Ensure the trigger exists and uses the correct function
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Grant necessary permissions
GRANT EXECUTE ON FUNCTION public.generate_referral_code() TO authenticated;
GRANT EXECUTE ON FUNCTION public.generate_referral_code() TO anon;
GRANT EXECUTE ON FUNCTION public.handle_new_user() TO authenticated;
GRANT EXECUTE ON FUNCTION public.handle_new_user() TO anon;
