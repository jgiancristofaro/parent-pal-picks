
-- Create the friend reviews function
CREATE OR REPLACE FUNCTION public.get_friend_reviews(
  p_user_id uuid,
  p_item_type text,
  p_item_id uuid
)
RETURNS TABLE(
  review_id uuid,
  reviewer_id uuid,
  reviewer_full_name text,
  reviewer_avatar_url text,
  rating integer,
  title text,
  content text,
  created_at timestamp with time zone,
  has_verified_experience boolean
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public', 'extensions'
AS $function$
BEGIN
  -- Check if user is authenticated
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'Authentication required';
  END IF;

  -- Validate item_type
  IF p_item_type NOT IN ('product', 'sitter') THEN
    RAISE EXCEPTION 'Invalid item_type. Must be either "product" or "sitter"';
  END IF;

  RETURN QUERY
  SELECT 
    r.id as review_id,
    r.user_id as reviewer_id,
    p.full_name as reviewer_full_name,
    p.avatar_url as reviewer_avatar_url,
    r.rating,
    r.title,
    r.content,
    r.created_at,
    r.has_verified_experience
  FROM public.reviews r
  INNER JOIN public.user_follows uf ON r.user_id = uf.following_id
  INNER JOIN public.profiles p ON r.user_id = p.id
  WHERE uf.follower_id = p_user_id
    AND (
      (p_item_type = 'product' AND r.product_id = p_item_id)
      OR (p_item_type = 'sitter' AND r.sitter_id = p_item_id)
    )
  ORDER BY r.created_at DESC;
END;
$function$;
