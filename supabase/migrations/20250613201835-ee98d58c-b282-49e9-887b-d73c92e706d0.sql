
-- Create the user_favorites table
CREATE TABLE public.user_favorites (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  item_id UUID NOT NULL,
  item_type TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create a composite index for efficient lookups
CREATE UNIQUE INDEX idx_user_favorites_unique ON public.user_favorites (user_id, item_id, item_type);

-- Enable Row Level Security
ALTER TABLE public.user_favorites ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view their own favorites" 
  ON public.user_favorites 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own favorites" 
  ON public.user_favorites 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own favorites" 
  ON public.user_favorites 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Create RPC function to add a favorite
CREATE OR REPLACE FUNCTION public.add_favorite(p_item_id uuid, p_item_type text)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_user_id UUID;
  v_favorite_id UUID;
BEGIN
  -- Get the current user ID
  v_user_id := auth.uid();
  
  IF v_user_id IS NULL THEN
    RETURN json_build_object('error', 'User not authenticated');
  END IF;
  
  -- Validate item_type
  IF p_item_type NOT IN ('sitter', 'product') THEN
    RETURN json_build_object('error', 'Invalid item type. Must be "sitter" or "product"');
  END IF;
  
  -- Insert the favorite (will fail if duplicate due to unique index)
  BEGIN
    INSERT INTO public.user_favorites (user_id, item_id, item_type)
    VALUES (v_user_id, p_item_id, p_item_type)
    RETURNING id INTO v_favorite_id;
    
    RETURN json_build_object('success', true, 'favorite_id', v_favorite_id);
  EXCEPTION
    WHEN unique_violation THEN
      RETURN json_build_object('error', 'Item already in favorites');
  END;
END;
$$;

-- Create RPC function to remove a favorite
CREATE OR REPLACE FUNCTION public.remove_favorite(p_item_id uuid, p_item_type text)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_user_id UUID;
  v_deleted_count INTEGER;
BEGIN
  -- Get the current user ID
  v_user_id := auth.uid();
  
  IF v_user_id IS NULL THEN
    RETURN json_build_object('error', 'User not authenticated');
  END IF;
  
  -- Delete the favorite
  DELETE FROM public.user_favorites
  WHERE user_id = v_user_id 
    AND item_id = p_item_id 
    AND item_type = p_item_type;
  
  GET DIAGNOSTICS v_deleted_count = ROW_COUNT;
  
  IF v_deleted_count > 0 THEN
    RETURN json_build_object('success', true, 'message', 'Favorite removed');
  ELSE
    RETURN json_build_object('error', 'Favorite not found');
  END IF;
END;
$$;
