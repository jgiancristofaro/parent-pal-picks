
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface CreateSitterAndReviewRequest {
  first_name: string;
  last_name: string;
  email?: string;
  phone_number?: string;
  user_id: string;
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
      first_name,
      last_name,
      email,
      phone_number,
      user_id,
      service_location_id,
      rating,
      title,
      content,
      certification_checkbox_value
    }: CreateSitterAndReviewRequest = await req.json()

    console.log('Received request to create sitter and review:', {
      first_name,
      last_name,
      email: email ? 'provided' : 'not provided',
      phone_number: phone_number ? 'provided' : 'not provided',
      user_id,
      service_location_id,
      rating,
      title,
      certification_checkbox_value
    });

    // Validation 1: At least one of email or phone_number must be provided
    if (!email && !phone_number) {
      return new Response(
        JSON.stringify({ error: 'Please provide either an email or a phone number for the sitter' }),
        { 
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    // Validation 2: Required fields validation
    if (!first_name || !last_name || !user_id || !service_location_id || !rating || !title || !content) {
      return new Response(
        JSON.stringify({ error: 'All required fields must be provided' }),
        { 
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    // Validation 3: Certification checkbox must be true
    if (certification_checkbox_value !== true) {
      return new Response(
        JSON.stringify({ error: 'Certification checkbox must be checked' }),
        { 
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    // Validation 4: Verify service_location_id belongs to the user
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

    // Duplicate Check 1: Check for email duplicates in profiles table
    if (email) {
      const { data: profileEmailCheck } = await supabase
        .from('profiles')
        .select('id')
        .eq('full_name', `${first_name.trim()} ${last_name.trim()}`)
        .limit(1)

      if (profileEmailCheck && profileEmailCheck.length > 0) {
        return new Response(
          JSON.stringify({ error: 'A profile with this name already exists. Please search for the existing sitter to review.' }),
          { 
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          }
        )
      }

      // Check for email duplicates in sitters table
      const { data: sitterEmailCheck } = await supabase
        .from('sitters')
        .select('id')
        .eq('name', `${first_name.trim()} ${last_name.trim()}`)
        .limit(1)

      if (sitterEmailCheck && sitterEmailCheck.length > 0) {
        return new Response(
          JSON.stringify({ error: 'A sitter with this name already exists. Please search for the existing sitter to review.' }),
          { 
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          }
        )
      }
    }

    // Duplicate Check 2: Check for phone number duplicates
    if (phone_number) {
      const normalizedPhone = phone_number.replace(/\D/g, ''); // Remove non-digits

      // Check profiles table for phone duplicates
      const { data: profilePhoneCheck } = await supabase
        .from('profiles')
        .select('id, phone_number')

      if (profilePhoneCheck) {
        const phoneExists = profilePhoneCheck.some(profile => 
          profile.phone_number && profile.phone_number.replace(/\D/g, '') === normalizedPhone
        )

        if (phoneExists) {
          return new Response(
            JSON.stringify({ error: 'A profile with this phone number already exists. Please search for the existing sitter to review.' }),
            { 
              status: 400,
              headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            }
          )
        }
      }

      // Check sitters table for phone duplicates
      const { data: sitterPhoneCheck } = await supabase
        .from('sitters')
        .select('id, phone_number')

      if (sitterPhoneCheck) {
        const phoneExists = sitterPhoneCheck.some(sitter => 
          sitter.phone_number && sitter.phone_number.replace(/\D/g, '') === normalizedPhone
        )

        if (phoneExists) {
          return new Response(
            JSON.stringify({ error: 'A sitter with this phone number already exists. Please search for the existing sitter to review.' }),
            { 
              status: 400,
              headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            }
          )
        }
      }
    }

    // Create Sitter
    const sitterName = `${first_name.trim()} ${last_name.trim()}`
    const sitterData = {
      name: sitterName,
      phone_number: phone_number ? phone_number.trim() : null,
      phone_number_searchable: false, // Default to private
      rating: rating, // Initialize with first review rating
      review_count: 1, // First review
      created_by_user_id: user_id
    }

    console.log('Creating sitter with data:', sitterData);

    const { data: newSitter, error: sitterError } = await supabase
      .from('sitters')
      .insert([sitterData])
      .select()
      .single()

    if (sitterError) {
      console.error('Error creating sitter:', sitterError);
      return new Response(
        JSON.stringify({ error: 'Failed to create sitter profile' }),
        { 
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    console.log('Sitter created successfully:', newSitter.id);

    // Create Review
    const reviewData = {
      user_id: user_id,
      sitter_id: newSitter.id,
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
      
      // Rollback: Delete the created sitter since review creation failed
      await supabase
        .from('sitters')
        .delete()
        .eq('id', newSitter.id)

      return new Response(
        JSON.stringify({ error: 'Failed to create review' }),
        { 
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    console.log('Review created successfully:', newReview.id);

    // Log activity in activity_feed for the new review
    const { error: activityError } = await supabase
      .from('activity_feed')
      .insert([{
        user_id: user_id,
        activity_type: 'sitter_review',
        review_id: newReview.id,
        sitter_id: newSitter.id
      }])

    if (activityError) {
      console.error('Error creating activity feed entry:', activityError);
      // Don't fail the entire operation for activity feed errors
    }

    console.log('Activity feed entry created successfully');

    return new Response(
      JSON.stringify({ 
        success: true, 
        sitter_id: newSitter.id,
        review_id: newReview.id,
        message: 'Sitter profile created and review submitted successfully!'
      }),
      { 
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )

  } catch (error) {
    console.error('Unexpected error in create_sitter_and_review:', error);
    return new Response(
      JSON.stringify({ error: 'An unexpected error occurred' }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})
