
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

  console.warn('DEPRECATION WARNING: create_sitter_and_review function is deprecated. Use create_sitter_profile and create_sitter_review instead.');

  // Return deprecation notice
  return new Response(
    JSON.stringify({ 
      error: 'This function is deprecated. Please use create_sitter_profile and create_sitter_review functions instead.',
      deprecated: true 
    }),
    { 
      status: 410, // Gone status code
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    }
  )
})
