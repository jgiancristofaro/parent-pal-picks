
-- Fix the admin_get_users function to resolve ambiguous column reference
CREATE OR REPLACE FUNCTION public.admin_get_users(search_term text DEFAULT ''::text, page_limit integer DEFAULT 50, page_offset integer DEFAULT 0)
 RETURNS TABLE(id uuid, full_name text, username text, email text, phone_number text, role text, is_suspended boolean, created_at timestamp with time zone, last_login_at timestamp with time zone)
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
BEGIN
  -- Check if caller is admin (fixed ambiguous column reference)
  IF NOT EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.id = auth.uid() AND profiles.role = 'ADMIN'
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
$function$
