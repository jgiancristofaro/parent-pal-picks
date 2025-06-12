
-- Add role column to profiles table if it doesn't exist
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS role TEXT NOT NULL DEFAULT 'USER';

-- Create an index on the role column for better performance
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);

-- Update any existing profiles that don't have a role set
UPDATE public.profiles 
SET role = 'USER' 
WHERE role IS NULL OR role = '';
