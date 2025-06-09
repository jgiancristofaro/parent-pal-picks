
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { CreateSitterProfileRequest } from './types.ts'
import { validateRequest } from './validation.ts'
import { checkNameDuplicates, checkPhoneDuplicates } from './duplicate-checks.ts'
import { prepareSitterData, createSitter } from './sitter-creation.ts'

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
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const requestData: CreateSitterProfileRequest = await req.json()

    console.log('Received request to create sitter profile:', {
      first_name: requestData.first_name,
      last_name: requestData.last_name,
      email: requestData.email ? 'provided' : 'not provided',
      phone_number: requestData.phone_number ? 'provided' : 'not provided',
      user_id: requestData.user_id
    });

    // Validate request
    const validationError = validateRequest(requestData);
    if (validationError) {
      return new Response(
        JSON.stringify({ error: validationError }),
        { 
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    // Check for name duplicates
    const nameError = await checkNameDuplicates(supabase, requestData.first_name, requestData.last_name);
    if (nameError) {
      return new Response(
        JSON.stringify({ error: nameError }),
        { 
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    // Check for phone number duplicates
    if (requestData.phone_number) {
      const phoneError = await checkPhoneDuplicates(supabase, requestData.phone_number);
      if (phoneError) {
        return new Response(
          JSON.stringify({ error: phoneError }),
          { 
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          }
        )
      }
    }

    // Create sitter
    const sitterData = prepareSitterData(requestData);
    const newSitter = await createSitter(supabase, sitterData);

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
