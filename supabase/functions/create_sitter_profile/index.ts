
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface CreateSitterProfileRequest {
  first_name: string;
  last_name: string;
  email?: string;
  phone_number?: string;
  user_id: string;
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
      user_id
    }: CreateSitterProfileRequest = await req.json()

    console.log('Received request to create sitter profile:', {
      first_name,
      last_name,
      email: email ? 'provided' : 'not provided',
      phone_number: phone_number ? 'provided' : 'not provided',
      user_id
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
    if (!first_name || !last_name || !user_id) {
      return new Response(
        JSON.stringify({ error: 'All required fields must be provided' }),
        { 
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    // Duplicate Check 1: Check for name duplicates in profiles table
    const { data: profileNameCheck } = await supabase
      .from('profiles')
      .select('id')
      .eq('full_name', `${first_name.trim()} ${last_name.trim()}`)
      .limit(1)

    if (profileNameCheck && profileNameCheck.length > 0) {
      return new Response(
        JSON.stringify({ error: 'A profile with this name already exists. Please search for the existing sitter to review.' }),
        { 
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    // Check for name duplicates in sitters table
    const { data: sitterNameCheck } = await supabase
      .from('sitters')
      .select('id')
      .eq('name', `${first_name.trim()} ${last_name.trim()}`)
      .limit(1)

    if (sitterNameCheck && sitterNameCheck.length > 0) {
      return new Response(
        JSON.stringify({ error: 'A sitter with this name already exists. Please search for the existing sitter to review.' }),
        { 
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
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
      rating: 0, // Initialize with no rating yet
      review_count: 0, // No reviews yet
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

    return new Response(
      JSON.stringify({ 
        success: true, 
        sitter: newSitter,
        message: 'Sitter profile created successfully!'
      }),
      { 
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )

  } catch (error) {
    console.error('Unexpected error in create_sitter_profile:', error);
    return new Response(
      JSON.stringify({ error: 'An unexpected error occurred' }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})
