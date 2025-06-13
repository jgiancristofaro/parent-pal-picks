
-- Fix the admin_get_all_sitters function to resolve ambiguous column reference
CREATE OR REPLACE FUNCTION public.admin_get_all_sitters(search_term text DEFAULT ''::text, page_limit integer DEFAULT 50, page_offset integer DEFAULT 0)
 RETURNS TABLE(id uuid, name text, profile_image_url text, bio text, experience text, hourly_rate numeric, phone_number text, email text, certifications text[], rating numeric, review_count integer, is_verified boolean, created_at timestamp with time zone, updated_at timestamp with time zone)
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
    s.id,
    s.name,
    s.profile_image_url,
    s.bio,
    s.experience,
    s.hourly_rate,
    s.phone_number,
    s.email,
    s.certifications,
    s.rating,
    s.review_count,
    s.is_verified,
    s.created_at,
    s.updated_at
  FROM public.sitters s
  WHERE (
    search_term = '' OR
    s.name ILIKE '%' || search_term || '%' OR
    s.email ILIKE '%' || search_term || '%'
  )
  ORDER BY s.created_at DESC
  LIMIT page_limit OFFSET page_offset;
END;
$function$
