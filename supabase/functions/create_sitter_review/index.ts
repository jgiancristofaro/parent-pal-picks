
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface CreateSitterReviewRequest {
  user_id: string;
  sitter_id: string;
  service_location_id: string;
  rating: number;
  title: string;
  content: string;
  certification_checkbox_value: boolean;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const {
      user_id,
      sitter_id,
      service_location_id,
      rating,
      title,
      content,
      certification_checkbox_value
    }: CreateSitterReviewRequest = await req.json()

    console.log('Received request to create sitter review:', {
      user_id,
      sitter_id,
      service_location_id,
      rating,
      title,
      certification_checkbox_value
    });

    // Validation: Required fields validation
    if (!user_id || !sitter_id || !service_location_id || !rating || !title || !content) {
      return new Response(
        JSON.stringify({ error: 'All required fields must be provided' }),
        { 
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    // Validation: Certification checkbox must be true
    if (certification_checkbox_value !== true) {
      return new Response(
        JSON.stringify({ error: 'Certification checkbox must be checked' }),
        { 
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    // Validation: Verify service_location_id belongs to the user
    const { data: locationExists, error: locationError } = await supabase
      .from('user_locations')
      .select('id')
      .eq('id', service_location_id)
      .eq('user_id', user_id)
      .single()

    if (locationError || !locationExists) {
      return new Response(
        JSON.stringify({ error: 'Invalid service location or location does not belong to user' }),
        { 
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    // Validation: Verify sitter exists
    const { data: sitterExists, error: sitterError } = await supabase
      .from('sitters')
      .select('id')
      .eq('id', sitter_id)
      .single()

    if (sitterError || !sitterExists) {
      return new Response(
        JSON.stringify({ error: 'Invalid sitter ID' }),
        { 
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    // Create Review
    const reviewData = {
      user_id: user_id,
      sitter_id: sitter_id,
      service_location_id: service_location_id,
      rating: rating,
      title: title.trim(),
      content: content.trim(),
      worked_with_sitter_certification: certification_checkbox_value,
      has_verified_experience: true // Set to true since they worked with the sitter
    }

    console.log('Creating review with data:', reviewData);

    const { data: newReview, error: reviewError } = await supabase
      .from('reviews')
      .insert([reviewData])
      .select()
      .single()

    if (reviewError) {
      console.error('Error creating review:', reviewError);
      return new Response(
        JSON.stringify({ error: 'Failed to create review' }),
        { 
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    console.log('Review created successfully:', newReview.id);

    // Update sitter rating and review count
    const { data: reviewStats, error: statsError } = await supabase
      .from('reviews')
      .select('rating')
      .eq('sitter_id', sitter_id)

    if (!statsError && reviewStats) {
      const avgRating = reviewStats.reduce((sum, review) => sum + review.rating, 0) / reviewStats.length;
      const reviewCount = reviewStats.length;

      await supabase
        .from('sitters')
        .update({ 
          rating: Math.round(avgRating * 100) / 100, // Round to 2 decimal places
          review_count: reviewCount 
        })
        .eq('id', sitter_id)
    }

    // Log activity in activity_feed for the new review
    const { error: activityError } = await supabase
      .from('activity_feed')
      .insert([{
        user_id: user_id,
        activity_type: 'sitter_review',
        review_id: newReview.id,
        sitter_id: sitter_id
      }])

    if (activityError) {
      console.error('Error creating activity feed entry:', activityError);
      // Don't fail the entire operation for activity feed errors
    }

    console.log('Activity feed entry created successfully');

    return new Response(
      JSON.stringify({ 
        success: true, 
        review: newReview,
        message: 'Sitter review submitted successfully!'
      }),
      { 
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )

  } catch (error) {
    console.error('Unexpected error in create_sitter_review:', error);
    return new Response(
      JSON.stringify({ error: 'An unexpected error occurred' }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})
