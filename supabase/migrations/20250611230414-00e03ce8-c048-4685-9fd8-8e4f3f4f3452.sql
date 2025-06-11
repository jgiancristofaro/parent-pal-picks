
-- Update the search_sitters function to use Google Place ID instead of building_identifier
CREATE OR REPLACE FUNCTION public.search_sitters(
  home_place_id TEXT,
  current_user_id UUID DEFAULT NULL
) 
RETURNS TABLE(
  id UUID,
  name TEXT,
  profile_image_url TEXT,
  rating NUMERIC,
  experience TEXT,
  bio TEXT,
  hourly_rate NUMERIC,
  certifications TEXT[],
  phone_number TEXT,
  email TEXT,
  review_count INTEGER,
  created_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT DISTINCT 
    s.id,
    s.name,
    s.profile_image_url,
    s.rating,
    s.experience,
    s.bio,
    s.hourly_rate,
    s.certifications,
    s.phone_number,
    s.email,
    s.review_count,
    s.created_at,
    s.updated_at
  FROM public.sitters s
  INNER JOIN public.reviews r ON s.id = r.sitter_id
  INNER JOIN public.user_locations ul ON r.service_location_id = ul.id
  WHERE ul.google_place_id = home_place_id
    AND (current_user_id IS NULL OR r.user_id != current_user_id)
    AND r.rating >= 4
  ORDER BY s.rating DESC NULLS LAST, s.review_count DESC NULLS LAST;
END;
$$;
