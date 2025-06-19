
-- Drop the existing restrictive policy that only allows users to update their own profiles
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;

-- Create a new policy that allows users to update their own profile OR allows admins to update any profile
CREATE POLICY "Users can update own profile or admins can update any profile" 
ON public.profiles 
FOR UPDATE 
USING (
  auth.uid() = id OR 
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role = 'ADMIN'
  )
);
