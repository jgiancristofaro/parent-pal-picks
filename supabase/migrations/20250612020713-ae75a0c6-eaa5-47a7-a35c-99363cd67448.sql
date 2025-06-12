
-- Add is_suspended column to profiles table if it doesn't exist
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS is_suspended BOOLEAN NOT NULL DEFAULT false;

-- Create RPC function to get users for admin dashboard
CREATE OR REPLACE FUNCTION public.admin_get_users(
  search_term TEXT DEFAULT '',
  page_limit INTEGER DEFAULT 50,
  page_offset INTEGER DEFAULT 0
)
RETURNS TABLE(
  id UUID,
  full_name TEXT,
  username TEXT,
  email TEXT,
  phone_number TEXT,
  role TEXT,
  is_suspended BOOLEAN,
  created_at TIMESTAMP WITH TIME ZONE,
  last_login_at TIMESTAMP WITH TIME ZONE
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Check if caller is admin
  IF NOT EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role = 'ADMIN'
  ) THEN
    RAISE EXCEPTION 'Access denied. Admin role required.';
  END IF;

  RETURN QUERY
  SELECT 
    p.id,
    p.full_name,
    p.username,
    au.email,
    p.phone_number,
    p.role,
    p.is_suspended,
    p.created_at,
    p.last_login_at
  FROM public.profiles p
  LEFT JOIN auth.users au ON p.id = au.id
  WHERE (
    search_term = '' OR
    p.full_name ILIKE '%' || search_term || '%' OR
    p.username ILIKE '%' || search_term || '%' OR
    au.email ILIKE '%' || search_term || '%'
  )
  ORDER BY p.created_at DESC
  LIMIT page_limit OFFSET page_offset;
END;
$$;

-- Create RPC function to suspend/unsuspend users
CREATE OR REPLACE FUNCTION public.admin_suspend_user(
  target_user_id UUID,
  suspend_reason TEXT DEFAULT 'No reason provided'
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  admin_user_id UUID;
  current_status BOOLEAN;
  new_status BOOLEAN;
  action_type_text TEXT;
BEGIN
  -- Get admin user ID
  admin_user_id := auth.uid();
  
  -- Check if caller is admin
  IF NOT EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = admin_user_id AND role = 'ADMIN'
  ) THEN
    RAISE EXCEPTION 'Access denied. Admin role required.';
  END IF;

  -- Get current suspension status
  SELECT is_suspended INTO current_status
  FROM public.profiles
  WHERE id = target_user_id;

  IF current_status IS NULL THEN
    RAISE EXCEPTION 'User not found.';
  END IF;

  -- Toggle suspension status
  new_status := NOT current_status;
  action_type_text := CASE WHEN new_status THEN 'suspend_user' ELSE 'unsuspend_user' END;

  -- Update user suspension status
  UPDATE public.profiles
  SET is_suspended = new_status, updated_at = now()
  WHERE id = target_user_id;

  -- Log the action
  INSERT INTO public.audit_log (admin_id, action_type, target_id, reason)
  VALUES (admin_user_id, action_type_text, target_user_id, suspend_reason);

  RETURN json_build_object(
    'success', true,
    'action', action_type_text,
    'target_user_id', target_user_id,
    'new_status', new_status
  );
END;
$$;

-- Create RPC function to delete users
CREATE OR REPLACE FUNCTION public.admin_delete_user(
  target_user_id UUID,
  deletion_reason TEXT DEFAULT 'No reason provided'
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  admin_user_id UUID;
BEGIN
  -- Get admin user ID
  admin_user_id := auth.uid();
  
  -- Check if caller is admin
  IF NOT EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = admin_user_id AND role = 'ADMIN'
  ) THEN
    RAISE EXCEPTION 'Access denied. Admin role required.';
  END IF;

  -- Check if target user exists
  IF NOT EXISTS (
    SELECT 1 FROM public.profiles WHERE id = target_user_id
  ) THEN
    RAISE EXCEPTION 'User not found.';
  END IF;

  -- Prevent admin from deleting themselves
  IF admin_user_id = target_user_id THEN
    RAISE EXCEPTION 'Cannot delete your own account.';
  END IF;

  -- Log the action before deletion
  INSERT INTO public.audit_log (admin_id, action_type, target_id, reason)
  VALUES (admin_user_id, 'delete_user', target_user_id, deletion_reason);

  -- Delete user profile (this will cascade to auth.users due to RLS)
  DELETE FROM public.profiles WHERE id = target_user_id;

  RETURN json_build_object(
    'success', true,
    'action', 'delete_user',
    'target_user_id', target_user_id
  );
END;
$$;
