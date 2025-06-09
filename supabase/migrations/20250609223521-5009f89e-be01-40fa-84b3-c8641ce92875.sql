
-- Update all sitters with null profile images to use the default image
UPDATE public.sitters 
SET profile_image_url = '/assets/defaultsitter.jpg'
WHERE profile_image_url IS NULL;

-- Update all sitters with Unsplash placeholder images to use the default image
UPDATE public.sitters 
SET profile_image_url = '/assets/defaultsitter.jpg'
WHERE profile_image_url LIKE 'https://images.unsplash.com/%';
