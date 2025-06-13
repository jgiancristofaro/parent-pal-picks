
-- Create admin product deletion function
CREATE OR REPLACE FUNCTION public.admin_delete_product(target_product_id uuid, deletion_reason text DEFAULT 'No reason provided'::text)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
AS $function$
DECLARE
  admin_user_id UUID;
  product_review_count INTEGER;
  product_name TEXT;
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

  -- Check if target product exists and get details
  SELECT name, review_count INTO product_name, product_review_count
  FROM public.products 
  WHERE id = target_product_id;

  IF product_name IS NULL THEN
    RAISE EXCEPTION 'Product not found.';
  END IF;

  -- Log the action before deletion
  INSERT INTO public.audit_log (admin_id, action_type, target_id, reason)
  VALUES (admin_user_id, 'delete_product', target_product_id, 
    format('Deleted product "%s" with %s reviews. Reason: %s', product_name, product_review_count, deletion_reason));

  -- Delete product (this will cascade to related records due to foreign key constraints)
  DELETE FROM public.products WHERE id = target_product_id;

  RETURN json_build_object(
    'success', true,
    'action', 'delete_product',
    'target_product_id', target_product_id,
    'product_name', product_name,
    'deleted_review_count', product_review_count
  );
END;
$function$;
