
-- Add is_verified column to sitters table
ALTER TABLE public.sitters 
ADD COLUMN is_verified boolean NOT NULL DEFAULT false;

-- Add is_verified column to products table  
ALTER TABLE public.products 
ADD COLUMN is_verified boolean NOT NULL DEFAULT false;

-- Create admin_update_sitter_details function
CREATE OR REPLACE FUNCTION public.admin_update_sitter_details(
  target_sitter_id uuid,
  new_name text DEFAULT NULL,
  new_profile_image_url text DEFAULT NULL,
  new_bio text DEFAULT NULL,
  new_experience text DEFAULT NULL,
  new_hourly_rate numeric DEFAULT NULL,
  new_phone_number text DEFAULT NULL,
  new_email text DEFAULT NULL,
  new_certifications text[] DEFAULT NULL
)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  admin_user_id uuid;
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

  -- Check if sitter exists
  IF NOT EXISTS (
    SELECT 1 FROM public.sitters WHERE id = target_sitter_id
  ) THEN
    RAISE EXCEPTION 'Sitter not found.';
  END IF;

  -- Update sitter details (only update non-null values)
  UPDATE public.sitters 
  SET 
    name = COALESCE(new_name, name),
    profile_image_url = COALESCE(new_profile_image_url, profile_image_url),
    bio = COALESCE(new_bio, bio),
    experience = COALESCE(new_experience, experience),
    hourly_rate = COALESCE(new_hourly_rate, hourly_rate),
    phone_number = COALESCE(new_phone_number, phone_number),
    email = COALESCE(new_email, email),
    certifications = COALESCE(new_certifications, certifications),
    updated_at = now()
  WHERE id = target_sitter_id;

  -- Log the action
  INSERT INTO public.audit_log (admin_id, action_type, target_id, reason)
  VALUES (admin_user_id, 'update_sitter_details', target_sitter_id, 'Updated sitter profile details');

  RETURN json_build_object('success', true, 'sitter_id', target_sitter_id);
END;
$$;

-- Create admin_update_product_details function
CREATE OR REPLACE FUNCTION public.admin_update_product_details(
  target_product_id uuid,
  new_name text DEFAULT NULL,
  new_brand_name text DEFAULT NULL,
  new_category text DEFAULT NULL,
  new_description text DEFAULT NULL,
  new_image_url text DEFAULT NULL,
  new_price numeric DEFAULT NULL,
  new_external_purchase_link text DEFAULT NULL
)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  admin_user_id uuid;
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

  -- Check if product exists
  IF NOT EXISTS (
    SELECT 1 FROM public.products WHERE id = target_product_id
  ) THEN
    RAISE EXCEPTION 'Product not found.';
  END IF;

  -- Update product details (only update non-null values)
  UPDATE public.products 
  SET 
    name = COALESCE(new_name, name),
    brand_name = COALESCE(new_brand_name, brand_name),
    category = COALESCE(new_category, category),
    description = COALESCE(new_description, description),
    image_url = COALESCE(new_image_url, image_url),
    price = COALESCE(new_price, price),
    external_purchase_link = COALESCE(new_external_purchase_link, external_purchase_link),
    updated_at = now()
  WHERE id = target_product_id;

  -- Log the action
  INSERT INTO public.audit_log (admin_id, action_type, target_id, reason)
  VALUES (admin_user_id, 'update_product_details', target_product_id, 'Updated product details');

  RETURN json_build_object('success', true, 'product_id', target_product_id);
END;
$$;

-- Create admin_set_verified_status function
CREATE OR REPLACE FUNCTION public.admin_set_verified_status(
  item_type text, -- 'sitter' or 'product'
  item_id uuid,
  verified_status boolean
)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  admin_user_id uuid;
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

  IF item_type = 'sitter' THEN
    -- Update sitter verified status
    UPDATE public.sitters 
    SET is_verified = verified_status, updated_at = now()
    WHERE id = item_id;
    
    IF NOT FOUND THEN
      RAISE EXCEPTION 'Sitter not found.';
    END IF;
    
  ELSIF item_type = 'product' THEN
    -- Update product verified status
    UPDATE public.products 
    SET is_verified = verified_status, updated_at = now()
    WHERE id = item_id;
    
    IF NOT FOUND THEN
      RAISE EXCEPTION 'Product not found.';
    END IF;
  ELSE
    RAISE EXCEPTION 'Invalid item type. Must be "sitter" or "product".';
  END IF;

  -- Log the action
  INSERT INTO public.audit_log (admin_id, action_type, target_id, reason)
  VALUES (admin_user_id, 'set_verified_status', item_id, 
    format('Set %s verified status to %s', item_type, verified_status));

  RETURN json_build_object('success', true, 'item_id', item_id, 'verified_status', verified_status);
END;
$$;

-- Create admin_merge_duplicates function
CREATE OR REPLACE FUNCTION public.admin_merge_duplicates(
  item_type text, -- 'sitter' or 'product' 
  source_id uuid,
  target_id uuid,
  merge_reason text DEFAULT 'Duplicate merge'
)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  admin_user_id uuid;
  review_count integer;
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

  -- Validate item type
  IF item_type NOT IN ('sitter', 'product') THEN
    RAISE EXCEPTION 'Invalid item type. Must be "sitter" or "product".';
  END IF;

  IF item_type = 'sitter' THEN
    -- Check both sitters exist
    IF NOT EXISTS (SELECT 1 FROM public.sitters WHERE id = source_id) THEN
      RAISE EXCEPTION 'Source sitter not found.';
    END IF;
    IF NOT EXISTS (SELECT 1 FROM public.sitters WHERE id = target_id) THEN
      RAISE EXCEPTION 'Target sitter not found.';
    END IF;
    
    -- Move reviews from source to target
    UPDATE public.reviews 
    SET sitter_id = target_id, updated_at = now()
    WHERE sitter_id = source_id;
    
    GET DIAGNOSTICS review_count = ROW_COUNT;
    
    -- Delete source sitter
    DELETE FROM public.sitters WHERE id = source_id;
    
  ELSE -- product
    -- Check both products exist
    IF NOT EXISTS (SELECT 1 FROM public.products WHERE id = source_id) THEN
      RAISE EXCEPTION 'Source product not found.';
    END IF;
    IF NOT EXISTS (SELECT 1 FROM public.products WHERE id = target_id) THEN
      RAISE EXCEPTION 'Target product not found.';
    END IF;
    
    -- Move reviews from source to target
    UPDATE public.reviews 
    SET product_id = target_id, updated_at = now()
    WHERE product_id = source_id;
    
    GET DIAGNOSTICS review_count = ROW_COUNT;
    
    -- Delete source product
    DELETE FROM public.products WHERE id = source_id;
  END IF;

  -- Log the action
  INSERT INTO public.audit_log (admin_id, action_type, target_id, reason)
  VALUES (admin_user_id, 'merge_duplicates', target_id, 
    format('%s - Merged %s into %s, moved %s reviews', merge_reason, source_id, target_id, review_count));

  RETURN json_build_object(
    'success', true, 
    'source_id', source_id,
    'target_id', target_id,
    'reviews_moved', review_count
  );
END;
$$;

-- Create admin_delete_review function
CREATE OR REPLACE FUNCTION public.admin_delete_review(
  review_id uuid,
  deletion_reason text DEFAULT 'Admin deletion'
)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  admin_user_id uuid;
  review_data record;
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

  -- Get review data before deletion for logging
  SELECT user_id, sitter_id, product_id INTO review_data
  FROM public.reviews 
  WHERE id = review_id;
  
  IF review_data IS NULL THEN
    RAISE EXCEPTION 'Review not found.';
  END IF;

  -- Log the action before deletion
  INSERT INTO public.audit_log (admin_id, action_type, target_id, reason)
  VALUES (admin_user_id, 'delete_review', review_id, deletion_reason);

  -- Delete the review
  DELETE FROM public.reviews WHERE id = review_id;

  RETURN json_build_object('success', true, 'review_id', review_id);
END;
$$;

-- Create admin_get_all_sitters function
CREATE OR REPLACE FUNCTION public.admin_get_all_sitters(
  search_term text DEFAULT '',
  page_limit integer DEFAULT 50,
  page_offset integer DEFAULT 0
)
RETURNS TABLE(
  id uuid,
  name text,
  profile_image_url text,
  bio text,
  experience text,
  hourly_rate numeric,
  phone_number text,
  email text,
  certifications text[],
  rating numeric,
  review_count integer,
  is_verified boolean,
  created_at timestamp with time zone,
  updated_at timestamp with time zone
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
    s.id,
    s.name,
    s.profile_image_url,
    s.bio,
    s.experience,
    s.hourly_rate,
    s.phone_number,
    s.email,
    s.certifications,
    s.rating,
    s.review_count,
    s.is_verified,
    s.created_at,
    s.updated_at
  FROM public.sitters s
  WHERE (
    search_term = '' OR
    s.name ILIKE '%' || search_term || '%' OR
    s.email ILIKE '%' || search_term || '%'
  )
  ORDER BY s.created_at DESC
  LIMIT page_limit OFFSET page_offset;
END;
$$;

-- Create admin_get_all_products function
CREATE OR REPLACE FUNCTION public.admin_get_all_products(
  search_term text DEFAULT '',
  page_limit integer DEFAULT 50,
  page_offset integer DEFAULT 0
)
RETURNS TABLE(
  id uuid,
  name text,
  brand_name text,
  category text,
  description text,
  image_url text,
  price numeric,
  external_purchase_link text,
  average_rating numeric,
  review_count integer,
  is_verified boolean,
  created_at timestamp with time zone,
  updated_at timestamp with time zone
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
    p.id,
    p.name,
    p.brand_name,
    p.category,
    p.description,
    p.image_url,
    p.price,
    p.external_purchase_link,
    p.average_rating,
    p.review_count,
    p.is_verified,
    p.created_at,
    p.updated_at
  FROM public.products p
  WHERE (
    search_term = '' OR
    p.name ILIKE '%' || search_term || '%' OR
    p.brand_name ILIKE '%' || search_term || '%' OR
    p.category ILIKE '%' || search_term || '%'
  )
  ORDER BY p.created_at DESC
  LIMIT page_limit OFFSET page_offset;
END;
$$;

-- Create admin_get_item_reviews function
CREATE OR REPLACE FUNCTION public.admin_get_item_reviews(
  item_type text, -- 'sitter' or 'product'
  item_id uuid
)
RETURNS TABLE(
  id uuid,
  user_id uuid,
  user_full_name text,
  rating integer,
  title text,
  content text,
  created_at timestamp with time zone,
  updated_at timestamp with time zone
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

  IF item_type = 'sitter' THEN
    RETURN QUERY
    SELECT 
      r.id,
      r.user_id,
      p.full_name as user_full_name,
      r.rating,
      r.title,
      r.content,
      r.created_at,
      r.updated_at
    FROM public.reviews r
    JOIN public.profiles p ON r.user_id = p.id
    WHERE r.sitter_id = item_id
    ORDER BY r.created_at DESC;
    
  ELSIF item_type = 'product' THEN
    RETURN QUERY
    SELECT 
      r.id,
      r.user_id,
      p.full_name as user_full_name,
      r.rating,
      r.title,
      r.content,
      r.created_at,
      r.updated_at
    FROM public.reviews r
    JOIN public.profiles p ON r.user_id = p.id
    WHERE r.product_id = item_id
    ORDER BY r.created_at DESC;
    
  ELSE
    RAISE EXCEPTION 'Invalid item type. Must be "sitter" or "product".';
  END IF;
END;
$$;
