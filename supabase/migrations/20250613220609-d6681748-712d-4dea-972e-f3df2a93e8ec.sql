
-- Step 1: Add first_name and last_name columns to profiles table
-- We'll add them as nullable first, then populate them, then make them non-nullable

ALTER TABLE public.profiles 
ADD COLUMN first_name text,
ADD COLUMN last_name text;

-- Step 2: Create a function to split full_name into first_name and last_name
CREATE OR REPLACE FUNCTION migrate_full_names()
RETURNS void
LANGUAGE plpgsql
AS $$
DECLARE
  profile_record RECORD;
  name_parts text[];
  first_name_val text;
  last_name_val text;
BEGIN
  -- Loop through all profiles that have a full_name but no first_name/last_name
  FOR profile_record IN 
    SELECT id, full_name 
    FROM public.profiles 
    WHERE full_name IS NOT NULL 
    AND (first_name IS NULL OR last_name IS NULL)
  LOOP
    -- Split the full_name at the first space
    name_parts := string_to_array(trim(profile_record.full_name), ' ');
    
    -- Handle different name scenarios
    IF array_length(name_parts, 1) = 1 THEN
      -- Only one name provided, use it as first name and set last name as empty string
      first_name_val := name_parts[1];
      last_name_val := '';
    ELSIF array_length(name_parts, 1) >= 2 THEN
      -- Multiple names: first element is first name, rest combined as last name
      first_name_val := name_parts[1];
      last_name_val := array_to_string(name_parts[2:array_length(name_parts, 1)], ' ');
    ELSE
      -- Edge case: empty or null full_name
      first_name_val := '';
      last_name_val := '';
    END IF;
    
    -- Update the profile with the split names
    UPDATE public.profiles 
    SET 
      first_name = first_name_val,
      last_name = last_name_val
    WHERE id = profile_record.id;
    
  END LOOP;
  
  RAISE NOTICE 'Migration completed successfully';
END;
$$;

-- Step 3: Execute the migration function
SELECT migrate_full_names();

-- Step 4: Set default values for any remaining NULL entries
UPDATE public.profiles 
SET 
  first_name = COALESCE(first_name, ''),
  last_name = COALESCE(last_name, '')
WHERE first_name IS NULL OR last_name IS NULL;

-- Step 5: Make the columns non-nullable now that they're populated
ALTER TABLE public.profiles 
ALTER COLUMN first_name SET NOT NULL,
ALTER COLUMN last_name SET NOT NULL;

-- Step 6: Drop the migration function as it's no longer needed
DROP FUNCTION migrate_full_names();

-- Optional: Add a comment to mark full_name as deprecated
COMMENT ON COLUMN public.profiles.full_name IS 'DEPRECATED: Use first_name and last_name instead';
