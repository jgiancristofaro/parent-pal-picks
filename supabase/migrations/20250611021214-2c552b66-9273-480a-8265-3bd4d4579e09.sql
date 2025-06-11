
-- Alter the user_locations table to make building_identifier nullable
ALTER TABLE public.user_locations 
ALTER COLUMN building_identifier DROP NOT NULL;
