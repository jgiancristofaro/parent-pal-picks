
-- Remove the old recommendation functions that are no longer needed
-- since we're now using the unified Activity Feed Backend

DROP FUNCTION IF EXISTS public.get_newly_recommended_products_from_followed_users(uuid, integer, integer);
DROP FUNCTION IF EXISTS public.get_newly_recommended_sitters_from_followed_users(uuid, integer, integer);
