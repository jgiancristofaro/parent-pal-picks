
-- Update all sitters that currently have the incorrect default image path
UPDATE public.sitters 
SET profile_image_url = '/assets/defaultsitter.jpg'
WHERE profile_image_url = '/lovable-uploads/f42e2470-723a-456b-a809-54e7c0d004b0.png';
