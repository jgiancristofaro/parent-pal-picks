
-- Update the handle_new_user function to properly handle the signup data format
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.profiles (
    id, 
    first_name, 
    last_name, 
    full_name, 
    phone_number, 
    profile_privacy_setting, 
    phone_number_searchable
  )
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data ->> 'first_name', ''),
    COALESCE(NEW.raw_user_meta_data ->> 'last_name', ''),
    TRIM(CONCAT(
      COALESCE(NEW.raw_user_meta_data ->> 'first_name', ''), 
      ' ', 
      COALESCE(NEW.raw_user_meta_data ->> 'last_name', '')
    )),
    NEW.raw_user_meta_data ->> 'phone_number',
    COALESCE(
      (NEW.raw_user_meta_data ->> 'profile_privacy_setting')::public.profile_privacy_enum,
      'private'::public.profile_privacy_enum
    ),
    COALESCE((NEW.raw_user_meta_data ->> 'phone_number_searchable')::boolean, false)
  );
  RETURN NEW;
END;
$$;
