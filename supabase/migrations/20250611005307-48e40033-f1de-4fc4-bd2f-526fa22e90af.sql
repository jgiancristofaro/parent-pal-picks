
-- Add new columns to user_locations table for Google Places integration
ALTER TABLE public.user_locations 
ADD COLUMN google_place_id TEXT,
ADD COLUMN standardized_address TEXT;

-- Create index on google_place_id for fast lookups
CREATE INDEX idx_user_locations_google_place_id ON public.user_locations(google_place_id);

-- Add comment to mark building_identifier as deprecated
COMMENT ON COLUMN public.user_locations.building_identifier IS 'DEPRECATED: Use google_place_id and standardized_address instead. Kept for backward compatibility.';
