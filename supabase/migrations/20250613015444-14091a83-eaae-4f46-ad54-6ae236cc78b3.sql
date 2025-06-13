
-- Fix the admin_get_all_products function to resolve ambiguous column reference
CREATE OR REPLACE FUNCTION public.admin_get_all_products(search_term text DEFAULT ''::text, page_limit integer DEFAULT 50, page_offset integer DEFAULT 0)
 RETURNS TABLE(id uuid, name text, brand_name text, category text, description text, image_url text, price numeric, external_purchase_link text, average_rating numeric, review_count integer, is_verified boolean, created_at timestamp with time zone, updated_at timestamp with time zone)
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
    p.name,
    p.brand_name,
    p.category,
    p.description,
    p.image_url,
    p.price,
    p.external_purchase_link,
    p.average_rating,
    p.review_count,
    p.is_verified,
    p.created_at,
    p.updated_at
  FROM public.products p
  WHERE (
    search_term = '' OR
    p.name ILIKE '%' || search_term || '%' OR
    p.brand_name ILIKE '%' || search_term || '%' OR
    p.category ILIKE '%' || search_term || '%'
  )
  ORDER BY p.created_at DESC
  LIMIT page_limit OFFSET page_offset;
END;
$function$
