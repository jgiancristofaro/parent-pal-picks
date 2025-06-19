
-- Step 1: Create the hashed_user_contacts table
CREATE TABLE public.hashed_user_contacts (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  hashed_identifier text NOT NULL,
  identifier_type text NOT NULL CHECK (identifier_type IN ('email', 'phone')),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Add unique constraint on (user_id, hashed_identifier)
ALTER TABLE public.hashed_user_contacts 
ADD CONSTRAINT unique_user_hashed_identifier 
UNIQUE (user_id, hashed_identifier);

-- Add index on hashed_identifier for fast lookups
CREATE INDEX idx_hashed_user_contacts_hashed_identifier 
ON public.hashed_user_contacts (hashed_identifier);

-- Add index on user_id for user-specific queries
CREATE INDEX idx_hashed_user_contacts_user_id 
ON public.hashed_user_contacts (user_id);

-- Enable RLS on the new table
ALTER TABLE public.hashed_user_contacts ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view their own hashed contacts" 
  ON public.hashed_user_contacts 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own hashed contacts" 
  ON public.hashed_user_contacts 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own hashed contacts" 
  ON public.hashed_user_contacts 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own hashed contacts" 
  ON public.hashed_user_contacts 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Step 2: Create the match_contacts function
CREATE OR REPLACE FUNCTION public.match_contacts(p_hashed_contacts text[])
RETURNS TABLE(
  user_id uuid,
  full_name text,
  username text,
  avatar_url text,
  profile_privacy_setting profile_privacy_enum,
  matched_identifier_count bigint
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public', 'extensions'
AS $$
BEGIN
  -- Check if user is authenticated
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'Authentication required';
  END IF;

  RETURN QUERY
  SELECT 
    p.id as user_id,
    p.full_name,
    p.username,
    p.avatar_url,
    p.profile_privacy_setting,
    COUNT(huc.hashed_identifier) as matched_identifier_count
  FROM public.hashed_user_contacts huc
  INNER JOIN public.profiles p ON huc.user_id = p.id
  WHERE huc.hashed_identifier = ANY(p_hashed_contacts)
    AND huc.user_id != auth.uid()  -- Exclude current user
    AND p.is_suspended = false     -- Exclude suspended users
  GROUP BY p.id, p.full_name, p.username, p.avatar_url, p.profile_privacy_setting
  ORDER BY matched_identifier_count DESC, p.full_name ASC;
END;
$$;

-- Step 3: Create the add_hashed_contacts function
CREATE OR REPLACE FUNCTION public.add_hashed_contacts(
  p_contacts jsonb  -- Array of objects with {hashed_identifier, identifier_type}
)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public', 'extensions'
AS $$
DECLARE
  v_user_id uuid;
  v_contact jsonb;
  v_inserted_count integer := 0;
  v_skipped_count integer := 0;
BEGIN
  -- Get the current user ID
  v_user_id := auth.uid();
  
  IF v_user_id IS NULL THEN
    RETURN json_build_object('error', 'User not authenticated');
  END IF;

  -- Validate input
  IF p_contacts IS NULL OR jsonb_array_length(p_contacts) = 0 THEN
    RETURN json_build_object('error', 'No contacts provided');
  END IF;

  -- Process each contact
  FOR v_contact IN SELECT * FROM jsonb_array_elements(p_contacts)
  LOOP
    -- Validate contact structure
    IF NOT (v_contact ? 'hashed_identifier' AND v_contact ? 'identifier_type') THEN
      CONTINUE; -- Skip invalid contacts
    END IF;

    -- Validate identifier_type
    IF (v_contact ->> 'identifier_type') NOT IN ('email', 'phone') THEN
      CONTINUE; -- Skip invalid identifier types
    END IF;

    -- Try to insert the contact (will skip if duplicate due to unique constraint)
    BEGIN
      INSERT INTO public.hashed_user_contacts (
        user_id, 
        hashed_identifier, 
        identifier_type
      ) VALUES (
        v_user_id,
        v_contact ->> 'hashed_identifier',
        v_contact ->> 'identifier_type'
      );
      v_inserted_count := v_inserted_count + 1;
    EXCEPTION
      WHEN unique_violation THEN
        v_skipped_count := v_skipped_count + 1;
        CONTINUE; -- Skip duplicates
    END;
  END LOOP;

  RETURN json_build_object(
    'success', true,
    'inserted_count', v_inserted_count,
    'skipped_count', v_skipped_count,
    'total_processed', v_inserted_count + v_skipped_count
  );
END;
$$;

-- Add trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_hashed_user_contacts_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = 'public', 'extensions'
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER trigger_update_hashed_user_contacts_updated_at
  BEFORE UPDATE ON public.hashed_user_contacts
  FOR EACH ROW
  EXECUTE FUNCTION update_hashed_user_contacts_updated_at();
