
-- Create a secure RPC function to check if an email exists in auth.users
CREATE OR REPLACE FUNCTION public.check_if_email_exists(p_email TEXT)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth
AS $$
BEGIN
  -- Check if email exists in auth.users table
  RETURN json_build_object(
    'exists', 
    EXISTS(SELECT 1 FROM auth.users WHERE email = p_email)
  );
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION public.check_if_email_exists(TEXT) TO authenticated;

-- Grant execute permission to anon users (for sign-up validation)
GRANT EXECUTE ON FUNCTION public.check_if_email_exists(TEXT) TO anon;
