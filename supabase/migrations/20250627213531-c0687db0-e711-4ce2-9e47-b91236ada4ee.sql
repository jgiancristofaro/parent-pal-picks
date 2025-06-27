
-- Drop the existing function first
DROP FUNCTION IF EXISTS public.omni_search(text);

-- Recreate the function with the correct metadata type
CREATE OR REPLACE FUNCTION public.omni_search(p_search_term text)
RETURNS TABLE(
  id uuid,
  name text,
  image_url text,
  description text,
  result_type text,
  relevance_score real,
  category text,
  rating numeric,
  metadata json  -- Now using json instead of jsonb
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public', 'extensions'
AS $function$
BEGIN
  -- Check if user is authenticated (optional - can be made public if needed)
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'Authentication required';
  END IF;

  -- Validate search term
  IF p_search_term IS NULL OR trim(p_search_term) = '' THEN
    RAISE EXCEPTION 'Search term cannot be empty';
  END IF;

  RETURN QUERY
  WITH combined_results AS (
    -- Search in profiles (parents)
    SELECT 
      p.id,
      p.full_name as name,
      p.avatar_url as image_url,
      p.bio as description,
      'parent'::text as result_type,
      GREATEST(
        COALESCE(similarity(p.full_name, p_search_term), 0),
        COALESCE(similarity(p.username, p_search_term), 0),
        COALESCE(similarity(p.bio, p_search_term), 0)
      ) as relevance_score,
      'user'::text as category,
      NULL::numeric as rating,
      json_build_object(
        'username', p.username,
        'profile_privacy_setting', p.profile_privacy_setting,
        'is_community_leader', p.is_community_leader
      ) as metadata
    FROM public.profiles p
    WHERE p.id != COALESCE(auth.uid(), '00000000-0000-0000-0000-000000000000'::uuid)
      AND p.is_suspended = false
      AND (
        p.full_name % p_search_term
        OR p.username % p_search_term
        OR p.bio % p_search_term
      )

    UNION ALL

    -- Search in sitters
    SELECT 
      s.id,
      s.name,
      s.profile_image_url as image_url,
      s.bio as description,
      'sitter'::text as result_type,
      GREATEST(
        COALESCE(similarity(s.name, p_search_term), 0),
        COALESCE(similarity(s.bio, p_search_term), 0),
        COALESCE(similarity(s.experience, p_search_term), 0)
      ) as relevance_score,
      'sitter'::text as category,
      s.rating,
      json_build_object(
        'experience', s.experience,
        'hourly_rate', s.hourly_rate,
        'review_count', s.review_count,
        'is_verified', s.is_verified,
        'certifications', s.certifications
      ) as metadata
    FROM public.sitters s
    WHERE (
      s.name % p_search_term
      OR s.bio % p_search_term
      OR s.experience % p_search_term
    )

    UNION ALL

    -- Search in products
    SELECT 
      pr.id,
      pr.name,
      pr.image_url,
      pr.description,
      'product'::text as result_type,
      GREATEST(
        COALESCE(similarity(pr.name, p_search_term), 0),
        COALESCE(similarity(pr.brand_name, p_search_term), 0),
        COALESCE(similarity(pr.description, p_search_term), 0),
        COALESCE(similarity(pr.category, p_search_term), 0)
      ) as relevance_score,
      COALESCE(pr.category, 'product') as category,
      pr.average_rating as rating,
      json_build_object(
        'brand_name', pr.brand_name,
        'price', pr.price,
        'review_count', pr.review_count,
        'is_verified', pr.is_verified,
        'external_purchase_link', pr.external_purchase_link
      ) as metadata
    FROM public.products pr
    WHERE (
      pr.name % p_search_term
      OR pr.brand_name % p_search_term
      OR pr.description % p_search_term
      OR pr.category % p_search_term
    )
  )
  SELECT 
    cr.id,
    cr.name,
    cr.image_url,
    cr.description,
    cr.result_type,
    cr.relevance_score,
    cr.category,
    cr.rating,
    cr.metadata
  FROM combined_results cr
  WHERE cr.relevance_score > 0.1  -- Filter out very low relevance matches
  ORDER BY cr.relevance_score DESC, cr.name ASC
  LIMIT 20;
END;
$function$
