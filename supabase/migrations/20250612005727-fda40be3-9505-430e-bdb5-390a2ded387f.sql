
-- Add role column to profiles table
ALTER TABLE public.profiles 
ADD COLUMN role text NOT NULL DEFAULT 'USER';

-- Create an index on the role column for better performance
CREATE INDEX idx_profiles_role ON public.profiles(role);

-- Add a check constraint to ensure only valid roles are stored
ALTER TABLE public.profiles 
ADD CONSTRAINT check_valid_role 
CHECK (role IN ('USER', 'ADMIN'));
