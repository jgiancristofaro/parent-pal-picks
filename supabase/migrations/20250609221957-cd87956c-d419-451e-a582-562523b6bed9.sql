
-- Create a trigger that fires on INSERT operations for reviews
CREATE OR REPLACE TRIGGER on_review_inserted
  AFTER INSERT ON public.reviews
  FOR EACH ROW
  EXECUTE FUNCTION handle_review_update();

-- Also ensure the existing UPDATE trigger is properly set up
DROP TRIGGER IF EXISTS on_review_updated ON public.reviews;
CREATE OR REPLACE TRIGGER on_review_updated
  AFTER UPDATE ON public.reviews
  FOR EACH ROW
  EXECUTE FUNCTION handle_review_update();

-- One-time data fix: Recalculate all product ratings and review counts
WITH product_stats AS (
  SELECT 
    product_id,
    ROUND(AVG(rating), 2) as avg_rating,
    COUNT(*) as review_count
  FROM public.reviews 
  WHERE product_id IS NOT NULL
  GROUP BY product_id
)
UPDATE public.products 
SET 
  average_rating = product_stats.avg_rating,
  review_count = product_stats.review_count,
  updated_at = now()
FROM product_stats
WHERE products.id = product_stats.product_id;

-- One-time data fix: Recalculate all sitter ratings and review counts
WITH sitter_stats AS (
  SELECT 
    sitter_id,
    ROUND(AVG(rating), 2) as avg_rating,
    COUNT(*) as review_count
  FROM public.reviews 
  WHERE sitter_id IS NOT NULL
  GROUP BY sitter_id
)
UPDATE public.sitters 
SET 
  rating = sitter_stats.avg_rating,
  review_count = sitter_stats.review_count,
  updated_at = now()
FROM sitter_stats
WHERE sitters.id = sitter_stats.sitter_id;
