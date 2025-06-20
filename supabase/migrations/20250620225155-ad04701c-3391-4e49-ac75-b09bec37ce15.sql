
-- Add referral_code column to profiles table
ALTER TABLE public.profiles 
ADD COLUMN referral_code TEXT UNIQUE,
ADD COLUMN referred_by_user_id UUID REFERENCES public.profiles(id);

-- Create user_referrals table to track referral relationships
CREATE TABLE public.user_referrals (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  referrer_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  referred_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(referrer_id, referred_id)
);

-- Create badges table for the badge system
CREATE TABLE public.badges (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  badge_type TEXT NOT NULL,
  badge_name TEXT NOT NULL,
  description TEXT,
  criteria_met JSONB,
  awarded_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on new tables
ALTER TABLE public.user_referrals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.badges ENABLE ROW LEVEL SECURITY;

-- RLS policies for user_referrals
CREATE POLICY "Users can view their own referral relationships" 
  ON public.user_referrals 
  FOR SELECT 
  USING (auth.uid() = referrer_id OR auth.uid() = referred_id);

-- RLS policies for badges
CREATE POLICY "Users can view their own badges" 
  ON public.badges 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own badges" 
  ON public.badges 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Function to generate unique referral codes
CREATE OR REPLACE FUNCTION generate_referral_code()
RETURNS TEXT
LANGUAGE plpgsql
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

-- Function to validate referral codes
CREATE OR REPLACE FUNCTION validate_referral_code(p_referral_code TEXT)
RETURNS TABLE(user_id UUID, full_name TEXT)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public', 'extensions'
AS $$
BEGIN
  RETURN QUERY
  SELECT p.id, p.full_name
  FROM public.profiles p
  WHERE p.referral_code = p_referral_code
    AND p.is_suspended = false;
END;
$$;

-- Function to award connector badges based on referral count
CREATE OR REPLACE FUNCTION award_connector_badges(p_user_id UUID)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public', 'extensions'
AS $$
DECLARE
  referral_count INTEGER;
  badge_awarded BOOLEAN := FALSE;
BEGIN
  -- Get current referral count for the user
  SELECT COUNT(*) INTO referral_count
  FROM public.user_referrals
  WHERE referrer_id = p_user_id;
  
  -- Award Bronze Connector badge (5 referrals)
  IF referral_count >= 5 AND NOT EXISTS(
    SELECT 1 FROM public.badges 
    WHERE user_id = p_user_id AND badge_type = 'connector_bronze'
  ) THEN
    INSERT INTO public.badges (user_id, badge_type, badge_name, description, criteria_met)
    VALUES (
      p_user_id, 
      'connector_bronze', 
      'Bronze Connector', 
      'Awarded for successfully referring 5 friends to ParentPal',
      json_build_object('referral_count', referral_count)
    );
    badge_awarded := TRUE;
  END IF;
  
  -- Award Silver Connector badge (20 referrals)
  IF referral_count >= 20 AND NOT EXISTS(
    SELECT 1 FROM public.badges 
    WHERE user_id = p_user_id AND badge_type = 'connector_silver'
  ) THEN
    INSERT INTO public.badges (user_id, badge_type, badge_name, description, criteria_met)
    VALUES (
      p_user_id, 
      'connector_silver', 
      'Silver Connector', 
      'Awarded for successfully referring 20 friends to ParentPal',
      json_build_object('referral_count', referral_count)
    );
    badge_awarded := TRUE;
  END IF;
  
  -- Award Gold Connector badge (50 referrals)
  IF referral_count >= 50 AND NOT EXISTS(
    SELECT 1 FROM public.badges 
    WHERE user_id = p_user_id AND badge_type = 'connector_gold'
  ) THEN
    INSERT INTO public.badges (user_id, badge_type, badge_name, description, criteria_met)
    VALUES (
      p_user_id, 
      'connector_gold', 
      'Gold Connector', 
      'Awarded for successfully referring 50 friends to ParentPal',
      json_build_object('referral_count', referral_count)
    );
    badge_awarded := TRUE;
  END IF;
  
  RETURN json_build_object('success', TRUE, 'badge_awarded', badge_awarded, 'referral_count', referral_count);
END;
$$;

-- Update the handle_new_user trigger to generate referral codes and handle referral relationships
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  referrer_user_id UUID;
BEGIN
  -- Handle referral code if provided
  IF NEW.raw_user_meta_data ->> 'referral_code' IS NOT NULL THEN
    -- Find the referrer
    SELECT id INTO referrer_user_id
    FROM public.profiles
    WHERE referral_code = NEW.raw_user_meta_data ->> 'referral_code';
  END IF;

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
    generate_referral_code(),
    referrer_user_id
  );
  
  -- Create referral relationship if there was a referrer
  IF referrer_user_id IS NOT NULL THEN
    INSERT INTO public.user_referrals (referrer_id, referred_id)
    VALUES (referrer_user_id, NEW.id);
    
    -- Award badges to the referrer
    PERFORM award_connector_badges(referrer_user_id);
  END IF;
  
  RETURN NEW;
END;
$$;

-- Generate referral codes for existing users who don't have them
UPDATE public.profiles 
SET referral_code = generate_referral_code() 
WHERE referral_code IS NULL;
