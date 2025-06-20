
-- Step 1: Create the activity_log table
CREATE TYPE public.activity_type_enum AS ENUM ('FOLLOWED_USER', 'REVIEWED_PRODUCT', 'REVIEWED_SITTER');

CREATE TABLE public.activity_log (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  actor_user_id uuid NOT NULL,
  action_type public.activity_type_enum NOT NULL,
  target_user_id uuid NULL,
  target_product_id uuid NULL,
  target_sitter_id uuid NULL
);

-- Add indexes for better query performance
CREATE INDEX idx_activity_log_actor_user_id ON public.activity_log(actor_user_id);
CREATE INDEX idx_activity_log_created_at ON public.activity_log(created_at DESC);
CREATE INDEX idx_activity_log_action_type ON public.activity_log(action_type);

-- Step 2: Create triggers to automatically populate activity_log

-- Trigger function for user_follows table
CREATE OR REPLACE FUNCTION public.log_user_follow_activity()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public', 'extensions'
AS $function$
BEGIN
  INSERT INTO public.activity_log (
    actor_user_id,
    action_type,
    target_user_id
  ) VALUES (
    NEW.follower_id,
    'FOLLOWED_USER',
    NEW.following_id
  );
  RETURN NEW;
END;
$function$;

-- Create trigger for user_follows
CREATE TRIGGER trigger_log_user_follow
  AFTER INSERT ON public.user_follows
  FOR EACH ROW
  EXECUTE FUNCTION public.log_user_follow_activity();

-- Trigger function for reviews table
CREATE OR REPLACE FUNCTION public.log_review_activity()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public', 'extensions'
AS $function$
BEGIN
  -- Log product review
  IF NEW.product_id IS NOT NULL THEN
    INSERT INTO public.activity_log (
      actor_user_id,
      action_type,
      target_product_id
    ) VALUES (
      NEW.user_id,
      'REVIEWED_PRODUCT',
      NEW.product_id
    );
  END IF;
  
  -- Log sitter review
  IF NEW.sitter_id IS NOT NULL THEN
    INSERT INTO public.activity_log (
      actor_user_id,
      action_type,
      target_sitter_id
    ) VALUES (
      NEW.user_id,
      'REVIEWED_SITTER',
      NEW.sitter_id
    );
  END IF;
  
  RETURN NEW;
END;
$function$;

-- Create trigger for reviews
CREATE TRIGGER trigger_log_review_activity
  AFTER INSERT ON public.reviews
  FOR EACH ROW
  EXECUTE FUNCTION public.log_review_activity();

-- Step 3: Create the feed fetching function
CREATE OR REPLACE FUNCTION public.get_network_activity(
  p_user_id uuid,
  p_page_number integer DEFAULT 1,
  p_page_size integer DEFAULT 20
)
RETURNS TABLE(
  activity_id uuid,
  activity_type text,
  actor_id uuid,
  actor_full_name text,
  actor_avatar_url text,
  activity_timestamp timestamp with time zone,
  item_id uuid,
  item_name text,
  item_image_url text,
  item_category text,
  review_rating integer,
  review_title text
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public', 'extensions'
AS $function$
DECLARE
  v_offset integer;
BEGIN
  -- Check if user is authenticated
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'Authentication required';
  END IF;

  -- Calculate offset for pagination
  v_offset := (p_page_number - 1) * p_page_size;

  RETURN QUERY
  WITH network_activities AS (
    SELECT 
      al.id as activity_id,
      al.action_type::text as activity_type,
      al.actor_user_id as actor_id,
      p.full_name as actor_full_name,
      p.avatar_url as actor_avatar_url,
      al.created_at as activity_timestamp,
      CASE 
        WHEN al.action_type = 'FOLLOWED_USER' THEN al.target_user_id
        WHEN al.action_type = 'REVIEWED_PRODUCT' THEN al.target_product_id
        WHEN al.action_type = 'REVIEWED_SITTER' THEN al.target_sitter_id
      END as item_id,
      CASE 
        WHEN al.action_type = 'FOLLOWED_USER' THEN up.full_name
        WHEN al.action_type = 'REVIEWED_PRODUCT' THEN prod.name
        WHEN al.action_type = 'REVIEWED_SITTER' THEN s.name
      END as item_name,
      CASE 
        WHEN al.action_type = 'FOLLOWED_USER' THEN up.avatar_url
        WHEN al.action_type = 'REVIEWED_PRODUCT' THEN prod.image_url
        WHEN al.action_type = 'REVIEWED_SITTER' THEN s.profile_image_url
      END as item_image_url,
      CASE 
        WHEN al.action_type = 'FOLLOWED_USER' THEN 'user'
        WHEN al.action_type = 'REVIEWED_PRODUCT' THEN COALESCE(prod.category, 'product')
        WHEN al.action_type = 'REVIEWED_SITTER' THEN 'sitter'
      END as item_category,
      CASE 
        WHEN al.action_type IN ('REVIEWED_PRODUCT', 'REVIEWED_SITTER') THEN r.rating
        ELSE NULL
      END as review_rating,
      CASE 
        WHEN al.action_type IN ('REVIEWED_PRODUCT', 'REVIEWED_SITTER') THEN r.title
        ELSE NULL
      END as review_title
    FROM public.activity_log al
    INNER JOIN public.user_follows uf ON al.actor_user_id = uf.following_id
    INNER JOIN public.profiles p ON al.actor_user_id = p.id
    LEFT JOIN public.profiles up ON al.target_user_id = up.id
    LEFT JOIN public.products prod ON al.target_product_id = prod.id
    LEFT JOIN public.sitters s ON al.target_sitter_id = s.id
    LEFT JOIN public.reviews r ON (
      (al.action_type = 'REVIEWED_PRODUCT' AND r.product_id = al.target_product_id AND r.user_id = al.actor_user_id)
      OR (al.action_type = 'REVIEWED_SITTER' AND r.sitter_id = al.target_sitter_id AND r.user_id = al.actor_user_id)
    )
    WHERE uf.follower_id = p_user_id
      AND al.created_at > COALESCE(
        (SELECT last_activity_feed_view_at FROM public.profiles WHERE id = p_user_id),
        '1970-01-01'::timestamp with time zone
      )
  )
  SELECT 
    na.activity_id,
    CASE 
      WHEN na.activity_type = 'FOLLOWED_USER' THEN 'user_follow'
      WHEN na.activity_type = 'REVIEWED_PRODUCT' THEN 'product_review'
      WHEN na.activity_type = 'REVIEWED_SITTER' THEN 'sitter_review'
    END as activity_type,
    na.actor_id,
    na.actor_full_name,
    na.actor_avatar_url,
    na.activity_timestamp,
    na.item_id,
    na.item_name,
    na.item_image_url,
    na.item_category,
    na.review_rating,
    na.review_title
  FROM network_activities na
  ORDER BY na.activity_timestamp DESC
  LIMIT p_page_size OFFSET v_offset;
END;
$function$;
