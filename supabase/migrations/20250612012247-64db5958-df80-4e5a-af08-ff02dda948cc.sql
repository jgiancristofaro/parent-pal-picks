
-- Create flagged_content table for content moderation
CREATE TABLE public.flagged_content (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  content_type TEXT NOT NULL CHECK (content_type IN ('review')),
  content_id UUID NOT NULL,
  reported_by_user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  reason TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'resolved')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  resolved_at TIMESTAMP WITH TIME ZONE,
  resolved_by_admin_id UUID REFERENCES auth.users(id)
);

-- Add Row Level Security
ALTER TABLE public.flagged_content ENABLE ROW LEVEL SECURITY;

-- Policy for users to flag content (can only see their own flags)
CREATE POLICY "Users can flag content and view their own flags" 
  ON public.flagged_content 
  FOR SELECT 
  USING (auth.uid() = reported_by_user_id);

-- Policy for users to create flags
CREATE POLICY "Users can create flags" 
  ON public.flagged_content 
  FOR INSERT 
  WITH CHECK (auth.uid() = reported_by_user_id);

-- Policy for admins to view all flags
CREATE POLICY "Admins can view all flags" 
  ON public.flagged_content 
  FOR ALL 
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role = 'ADMIN'
    )
  );

-- Add trigger to update updated_at timestamp
CREATE TRIGGER update_flagged_content_updated_at
  BEFORE UPDATE ON public.flagged_content
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create RPC function for users to flag content
CREATE OR REPLACE FUNCTION public.flag_content(
  p_content_type TEXT,
  p_content_id UUID,
  p_reason TEXT
)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_user_id UUID;
  v_flag_id UUID;
  v_content_exists BOOLEAN;
BEGIN
  -- Get the current user ID
  v_user_id := auth.uid();
  
  IF v_user_id IS NULL THEN
    RETURN json_build_object('error', 'User not authenticated');
  END IF;
  
  -- Validate content type
  IF p_content_type NOT IN ('review') THEN
    RETURN json_build_object('error', 'Invalid content type');
  END IF;
  
  -- Validate content exists
  IF p_content_type = 'review' THEN
    SELECT EXISTS(
      SELECT 1 FROM public.reviews WHERE id = p_content_id
    ) INTO v_content_exists;
  END IF;
  
  IF NOT v_content_exists THEN
    RETURN json_build_object('error', 'Content not found');
  END IF;
  
  -- Check if user has already flagged this content
  IF EXISTS(
    SELECT 1 FROM public.flagged_content 
    WHERE content_type = p_content_type 
    AND content_id = p_content_id 
    AND reported_by_user_id = v_user_id
    AND status = 'pending'
  ) THEN
    RETURN json_build_object('error', 'You have already flagged this content');
  END IF;
  
  -- Insert the flag
  INSERT INTO public.flagged_content (
    content_type, 
    content_id, 
    reported_by_user_id, 
    reason
  ) VALUES (
    p_content_type, 
    p_content_id, 
    v_user_id, 
    p_reason
  ) RETURNING id INTO v_flag_id;
  
  RETURN json_build_object('success', true, 'flag_id', v_flag_id);
END;
$$;

-- Create RPC function for admins to get flagged content
CREATE OR REPLACE FUNCTION public.admin_get_flagged_content(
  p_status TEXT DEFAULT 'pending',
  p_limit INTEGER DEFAULT 50,
  p_offset INTEGER DEFAULT 0
)
RETURNS TABLE(
  flag_id UUID,
  content_type TEXT,
  content_id UUID,
  reported_by_user_id UUID,
  reporter_name TEXT,
  reason TEXT,
  status TEXT,
  created_at TIMESTAMP WITH TIME ZONE,
  content_data JSON
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Check if caller is admin
  IF NOT EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role = 'ADMIN'
  ) THEN
    RAISE EXCEPTION 'Access denied. Admin role required.';
  END IF;

  RETURN QUERY
  SELECT 
    fc.id as flag_id,
    fc.content_type,
    fc.content_id,
    fc.reported_by_user_id,
    p.full_name as reporter_name,
    fc.reason,
    fc.status,
    fc.created_at,
    CASE 
      WHEN fc.content_type = 'review' THEN
        json_build_object(
          'id', r.id,
          'rating', r.rating,
          'title', r.title,
          'content', r.content,
          'author_name', rp.full_name,
          'sitter_name', s.name,
          'product_name', prod.name,
          'created_at', r.created_at
        )
      ELSE NULL
    END as content_data
  FROM public.flagged_content fc
  LEFT JOIN public.profiles p ON fc.reported_by_user_id = p.id
  LEFT JOIN public.reviews r ON fc.content_id = r.id AND fc.content_type = 'review'
  LEFT JOIN public.profiles rp ON r.user_id = rp.id
  LEFT JOIN public.sitters s ON r.sitter_id = s.id
  LEFT JOIN public.products prod ON r.product_id = prod.id
  WHERE fc.status = p_status
  ORDER BY fc.created_at DESC
  LIMIT p_limit OFFSET p_offset;
END;
$$;

-- Create RPC function for admins to resolve flags
CREATE OR REPLACE FUNCTION public.admin_resolve_flag(
  p_flag_id UUID,
  p_action TEXT, -- 'dismiss' or 'delete_content'
  p_reason TEXT DEFAULT 'Resolved by admin'
)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_admin_id UUID;
  v_flag_record RECORD;
BEGIN
  -- Get admin user ID
  v_admin_id := auth.uid();
  
  -- Check if caller is admin
  IF NOT EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = v_admin_id AND role = 'ADMIN'
  ) THEN
    RAISE EXCEPTION 'Access denied. Admin role required.';
  END IF;

  -- Get flag details
  SELECT * INTO v_flag_record
  FROM public.flagged_content
  WHERE id = p_flag_id AND status = 'pending';

  IF v_flag_record IS NULL THEN
    RAISE EXCEPTION 'Flag not found or already resolved.';
  END IF;

  -- Validate action
  IF p_action NOT IN ('dismiss', 'delete_content') THEN
    RAISE EXCEPTION 'Invalid action. Must be "dismiss" or "delete_content".';
  END IF;

  -- Handle delete content action
  IF p_action = 'delete_content' THEN
    IF v_flag_record.content_type = 'review' THEN
      -- Delete the review
      DELETE FROM public.reviews WHERE id = v_flag_record.content_id;
    END IF;
  END IF;

  -- Update flag status to resolved
  UPDATE public.flagged_content
  SET 
    status = 'resolved',
    resolved_at = now(),
    resolved_by_admin_id = v_admin_id,
    updated_at = now()
  WHERE id = p_flag_id;

  -- Log the action
  INSERT INTO public.audit_log (admin_id, action_type, target_id, reason)
  VALUES (v_admin_id, 'resolve_flag', p_flag_id, 
    format('Flag resolved with action: %s. Reason: %s', p_action, p_reason));

  RETURN json_build_object(
    'success', true, 
    'flag_id', p_flag_id,
    'action', p_action
  );
END;
$$;
