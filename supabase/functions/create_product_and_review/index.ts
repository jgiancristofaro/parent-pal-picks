
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    );

    // Get current user
    const { data: { user }, error: userError } = await supabaseClient.auth.getUser();
    if (userError || !user) {
      return new Response(
        JSON.stringify({ error: 'User not authenticated' }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 401 
        }
      );
    }

    const requestData = await req.json();
    const {
      // Product details
      name,
      brand_name,
      category_id,
      price,
      external_purchase_link,
      description,
      image_url,
      // Review details
      rating,
      title,
      content,
      has_verified_experience
    } = requestData;

    // Validate required fields
    if (!name || !brand_name || !category_id || !price || !rating || !title || !content || !has_verified_experience) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400 
        }
      );
    }

    // Step 1: Perform strict duplicate check
    const { data: duplicates, error: duplicateError } = await supabaseClient
      .from('products')
      .select('id')
      .eq('name', name.trim())
      .eq('brand_name', brand_name.trim())
      .eq('category_id', category_id)
      .limit(1);

    if (duplicateError) {
      console.error('Duplicate check error:', duplicateError);
      return new Response(
        JSON.stringify({ error: 'Failed to check for duplicates' }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 500 
        }
      );
    }

    if (duplicates && duplicates.length > 0) {
      return new Response(
        JSON.stringify({ error: 'A product with this exact name, brand, and category already exists' }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 409 
        }
      );
    }

    // Step 3: Insert new product
    const { data: newProduct, error: productError } = await supabaseClient
      .from('products')
      .insert({
        name: name.trim(),
        brand_name: brand_name.trim(),
        category_id,
        price: parseFloat(price),
        external_purchase_link: external_purchase_link?.trim() || null,
        description: description?.trim() || null,
        image_url,
        created_by_user_id: user.id,
        average_rating: rating, // Initial rating from first review
        review_count: 1 // Initial count
      })
      .select()
      .single();

    if (productError) {
      console.error('Product creation error:', productError);
      return new Response(
        JSON.stringify({ error: 'Failed to create product' }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 500 
        }
      );
    }

    // Step 4: Insert new review
    const { data: newReview, error: reviewError } = await supabaseClient
      .from('reviews')
      .insert({
        user_id: user.id,
        product_id: newProduct.id,
        rating,
        title: title.trim(),
        content: content.trim(),
        has_verified_experience
      })
      .select()
      .single();

    if (reviewError) {
      console.error('Review creation error:', reviewError);
      // Rollback: delete the product if review creation fails
      await supabaseClient
        .from('products')
        .delete()
        .eq('id', newProduct.id);
      
      return new Response(
        JSON.stringify({ error: 'Failed to create review' }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 500 
        }
      );
    }

    // Step 6: Log in activity feed
    const { error: activityError } = await supabaseClient
      .from('activity_feed')
      .insert({
        user_id: user.id,
        activity_type: 'product_review',
        review_id: newReview.id,
        product_id: newProduct.id
      });

    if (activityError) {
      console.error('Activity feed error:', activityError);
      // Don't fail the whole operation for activity feed issues
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        product: newProduct,
        review: newReview
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Function error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    );
  }
})
