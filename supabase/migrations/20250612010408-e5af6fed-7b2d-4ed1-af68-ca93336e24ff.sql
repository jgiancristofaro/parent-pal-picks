
-- Create audit_log table for tracking admin actions
CREATE TABLE public.audit_log (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  admin_id uuid NOT NULL,
  action_type text NOT NULL,
  target_id uuid NOT NULL,
  reason text,
  timestamp timestamp with time zone NOT NULL DEFAULT now(),
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Add Row Level Security
ALTER TABLE public.audit_log ENABLE ROW LEVEL SECURITY;

-- Create policy for admins to view audit logs
CREATE POLICY "Admins can view audit logs" 
  ON public.audit_log 
  FOR SELECT 
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role = 'ADMIN'
    )
  );

-- Create policy for admins to insert audit logs
CREATE POLICY "Admins can create audit logs" 
  ON public.audit_log 
  FOR INSERT 
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role = 'ADMIN'
    )
  );

-- Add is_suspended column to profiles table
ALTER TABLE public.profiles 
ADD COLUMN is_suspended boolean NOT NULL DEFAULT false;

-- Create admin_get_users function
CREATE OR REPLACE FUNCTION public.admin_get_users(
  search_term text DEFAULT '',
  page_limit integer DEFAULT 50,
  page_offset integer DEFAULT 0
)
RETURNS TABLE(
  id uuid,
  full_name text,
  username text,
  email text,
  phone_number text,
  role text,
  is_suspended boolean,
  created_at timestamp with time zone,
  last_login_at timestamp with time zone
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

-- Create admin_suspend_user function
CREATE OR REPLACE FUNCTION public.admin_suspend_user(
  target_user_id uuid,
  suspend_reason text DEFAULT 'No reason provided'
)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  admin_user_id uuid;
  current_status boolean;
  new_status boolean;
  action_type_text text;
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

-- Create admin_delete_user function
CREATE OR REPLACE FUNCTION public.admin_delete_user(
  target_user_id uuid,
  deletion_reason text DEFAULT 'No reason provided'
)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  admin_user_id uuid;
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
