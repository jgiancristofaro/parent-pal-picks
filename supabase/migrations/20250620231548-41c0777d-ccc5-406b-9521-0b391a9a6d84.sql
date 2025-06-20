
-- Drop the existing function first, then recreate it with the new signature
DROP FUNCTION IF EXISTS validate_referral_code(text);

-- Recreate the function with first_name included
CREATE OR REPLACE FUNCTION validate_referral_code(p_referral_code TEXT)
RETURNS TABLE(user_id UUID, full_name TEXT, first_name TEXT)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public', 'extensions'
AS $$
BEGIN
  RETURN QUERY
  SELECT p.id, p.full_name, p.first_name
  FROM public.profiles p
  WHERE p.referral_code = p_referral_code
    AND p.is_suspended = false;
END;
$$;

-- Ensure the generate_referral_code function exists
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
