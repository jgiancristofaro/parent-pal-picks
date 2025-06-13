
CREATE OR REPLACE FUNCTION public.admin_get_item_reviews(item_type text, item_id uuid)
 RETURNS TABLE(
   id uuid,
   user_id uuid,
   user_full_name text,
   rating integer,
   title text,
   content text,
   created_at timestamp with time zone,
   updated_at timestamp with time zone
 )
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
BEGIN
  -- Check if caller is admin
  IF NOT EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.id = auth.uid() AND profiles.role = 'ADMIN'
  ) THEN
    RAISE EXCEPTION 'Access denied. Admin role required.';
  END IF;

  -- Return reviews based on item type with fully qualified column references
  IF item_type = 'product' THEN
    RETURN QUERY
    SELECT 
      r.id,
      r.user_id,
      p.full_name as user_full_name,
      r.rating,
      r.title,
      r.content,
      r.created_at,
      r.updated_at
    FROM public.reviews r
    INNER JOIN public.profiles p ON r.user_id = p.id
    WHERE r.product_id = item_id
    ORDER BY r.created_at DESC;
    
  ELSIF item_type = 'sitter' THEN
    RETURN QUERY
    SELECT 
      r.id,
      r.user_id,
      p.full_name as user_full_name,
      r.rating,
      r.title,
      r.content,
      r.created_at,
      r.updated_at
    FROM public.reviews r
    INNER JOIN public.profiles p ON r.user_id = p.id
    WHERE r.sitter_id = item_id
    ORDER BY r.created_at DESC;
    
  ELSE
    RAISE EXCEPTION 'Invalid item_type. Must be "product" or "sitter".';
  END IF;
END;
$function$;
