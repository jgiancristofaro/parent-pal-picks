
-- Create admin function to delete sitters with audit logging
CREATE OR REPLACE FUNCTION public.admin_delete_sitter(target_sitter_id uuid, deletion_reason text DEFAULT 'No reason provided'::text)
 RETURNS json
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
DECLARE
  admin_user_id UUID;
  sitter_review_count INTEGER;
  sitter_name TEXT;
BEGIN
  -- Get admin user ID
  admin_user_id := auth.uid();
  
  -- Check if caller is admin
  IF NOT EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = admin_user_id AND role = 'ADMIN'
  ) THEN
    RAISE EXCEPTION 'Access denied. Admin role required.';
  END IF;

  -- Check if target sitter exists and get details
  SELECT name, review_count INTO sitter_name, sitter_review_count
  FROM public.sitters 
  WHERE id = target_sitter_id;

  IF sitter_name IS NULL THEN
    RAISE EXCEPTION 'Sitter not found.';
  END IF;

  -- Log the action before deletion
  INSERT INTO public.audit_log (admin_id, action_type, target_id, reason)
  VALUES (admin_user_id, 'delete_sitter', target_sitter_id, 
    format('Deleted sitter "%s" with %s reviews. Reason: %s', sitter_name, sitter_review_count, deletion_reason));

  -- Delete sitter (this will cascade to related records due to foreign key constraints)
  DELETE FROM public.sitters WHERE id = target_sitter_id;

  RETURN json_build_object(
    'success', true,
    'action', 'delete_sitter',
    'target_sitter_id', target_sitter_id,
    'sitter_name', sitter_name,
    'deleted_review_count', sitter_review_count
  );
END;
$function$
