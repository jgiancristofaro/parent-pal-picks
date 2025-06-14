
-- Drop and recreate policies to optimize performance
-- Note: We need to drop and recreate because ALTER POLICY doesn't support changing command types

-- Optimize policies for the 'products' table
DROP POLICY IF EXISTS "Only authenticated users can insert products" ON public.products;
CREATE POLICY "Only authenticated users can insert products" ON public.products 
FOR INSERT TO authenticated WITH CHECK (auth.uid() IS NOT NULL);

-- Optimize policies for the 'sitters' table  
DROP POLICY IF EXISTS "Only authenticated users can insert sitters" ON public.sitters;
CREATE POLICY "Only authenticated users can insert sitters" ON public.sitters 
FOR INSERT TO authenticated WITH CHECK (auth.uid() IS NOT NULL);

-- Consolidate multiple permissive RLS policies into single policies to improve performance

-- Consolidation for 'flagged_content' table
DROP POLICY IF EXISTS "Admins can view all flags" ON public.flagged_content;
DROP POLICY IF EXISTS "Users can create flags" ON public.flagged_content;
DROP POLICY IF EXISTS "Users can flag content and view their own flags" ON public.flagged_content;
CREATE POLICY "Consolidated flagged_content policy" ON public.flagged_content FOR ALL
USING (auth.uid() = reported_by_user_id OR EXISTS(SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'ADMIN'))
WITH CHECK (auth.uid() IS NOT NULL OR EXISTS(SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'ADMIN'));

-- Consolidation for 'follow_requests' table - DELETE operations
DROP POLICY IF EXISTS "Requester can manage own requests" ON public.follow_requests;
DROP POLICY IF EXISTS "Requesters can delete their pending requests" ON public.follow_requests;
DROP POLICY IF EXISTS "Users can delete requests they sent" ON public.follow_requests;
CREATE POLICY "Consolidated follow_requests_delete" ON public.follow_requests FOR DELETE USING (auth.uid() = requester_id);

-- Remove duplicate indexes from the 'profiles' table (corrected approach)
DROP INDEX IF EXISTS public.profiles_full_name_gin_idx;
DROP INDEX IF EXISTS public.profiles_username_gin_idx;
-- Drop the constraint instead of trying to drop the index directly
ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_username_unique;
