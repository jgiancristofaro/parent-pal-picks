
-- Restore Joe Giancristofaro's admin role (corrected query)
UPDATE public.profiles 
SET role = 'ADMIN' 
WHERE full_name = 'Joe Giancristofaro';

-- Verify the update
SELECT id, full_name, role, is_community_leader, is_suspended 
FROM public.profiles 
WHERE full_name = 'Joe Giancristofaro' OR role = 'ADMIN';
