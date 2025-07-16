-- Critical Security Fixes Migration
-- Fix 1: Enable RLS on activity_log table and add policies
ALTER TABLE public.activity_log ENABLE ROW LEVEL SECURITY;

-- Only authenticated users can view activity logs of people they follow
CREATE POLICY "Users can view activity logs of followed users" 
ON public.activity_log 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.user_follows uf 
    WHERE uf.follower_id = auth.uid() 
    AND uf.following_id = activity_log.actor_user_id
  )
);

-- Only the system can insert activity logs (via triggers)
CREATE POLICY "System can insert activity logs" 
ON public.activity_log 
FOR INSERT 
WITH CHECK (true);

-- Only admins can update/delete activity logs
CREATE POLICY "Admins can manage activity logs" 
ON public.activity_log 
FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role = 'ADMIN'
  )
);

-- Fix 2: Enable RLS on categories table and add policies
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

-- Anyone can view categories
CREATE POLICY "Anyone can view categories" 
ON public.categories 
FOR SELECT 
USING (true);

-- Only admins can manage categories
CREATE POLICY "Admins can manage categories" 
ON public.categories 
FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role = 'ADMIN'
  )
);

-- Fix 3: Add UPDATE/DELETE policies for products table
CREATE POLICY "Admins can update products" 
ON public.products 
FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role = 'ADMIN'
  )
);

CREATE POLICY "Admins can delete products" 
ON public.products 
FOR DELETE 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role = 'ADMIN'
  )
);

-- Fix 4: Add UPDATE/DELETE policies for sitters table
CREATE POLICY "Admins can update sitters" 
ON public.sitters 
FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role = 'ADMIN'
  )
);

CREATE POLICY "Admins can delete sitters" 
ON public.sitters 
FOR DELETE 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role = 'ADMIN'
  )
);