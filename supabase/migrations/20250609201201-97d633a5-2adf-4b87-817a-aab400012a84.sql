
-- Fix the get_friends_activity_feed function to return correct actor_id
CREATE OR REPLACE FUNCTION public.get_friends_activity_feed(p_current_user_id uuid, p_limit integer DEFAULT 50, p_offset integer DEFAULT 0)
 RETURNS TABLE(activity_id text, activity_type text, actor_id uuid, actor_full_name text, actor_avatar_url text, activity_timestamp timestamp with time zone, item_id uuid, item_name text, item_image_url text, item_category text, review_rating integer, review_title text)
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  WITH friend_activities AS (
    -- Product reviews from followed users
    SELECT 
      r.id::text as activity_id,
      'product_review'::text as activity_type,
      r.user_id as actor_id,  -- This should be the friend's ID, not current user
      p.full_name as actor_full_name,
      p.avatar_url as actor_avatar_url,
      r.created_at as activity_timestamp,
      r.product_id as item_id,
      prod.name as item_name,
      prod.image_url as item_image_url,
      prod.category as item_category,
      r.rating as review_rating,
      r.title as review_title
    FROM public.reviews r
    INNER JOIN public.user_follows uf ON r.user_id = uf.following_id  -- r.user_id is the friend
    INNER JOIN public.profiles p ON r.user_id = p.id  -- Get friend's profile info
    INNER JOIN public.products prod ON r.product_id = prod.id
    WHERE uf.follower_id = p_current_user_id  -- Current user follows the friend
      AND r.product_id IS NOT NULL
      AND r.user_id != p_current_user_id  -- Exclude current user's own reviews
    
    UNION ALL
    
    -- Sitter reviews from followed users
    SELECT 
      r.id::text as activity_id,
      'sitter_review'::text as activity_type,
      r.user_id as actor_id,  -- This should be the friend's ID, not current user
      p.full_name as actor_full_name,
      p.avatar_url as actor_avatar_url,
      r.created_at as activity_timestamp,
      r.sitter_id as item_id,
      s.name as item_name,
      s.profile_image_url as item_image_url,
      NULL::text as item_category,
      r.rating as review_rating,
      r.title as review_title
    FROM public.reviews r
    INNER JOIN public.user_follows uf ON r.user_id = uf.following_id  -- r.user_id is the friend
    INNER JOIN public.profiles p ON r.user_id = p.id  -- Get friend's profile info
    INNER JOIN public.sitters s ON r.sitter_id = s.id
    WHERE uf.follower_id = p_current_user_id  -- Current user follows the friend
      AND r.sitter_id IS NOT NULL
      AND r.user_id != p_current_user_id  -- Exclude current user's own reviews
  )
  SELECT *
  FROM friend_activities
  ORDER BY activity_timestamp DESC
  LIMIT p_limit OFFSET p_offset;
END;
$$;
