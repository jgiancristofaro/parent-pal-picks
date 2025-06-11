
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface GeocodeRequest {
  endpoint: string;
  address: string;
}

interface PlaceDetailsRequest {
  endpoint: string;
  place_id: string;
}

interface PlaceAutocompleteRequest {
  endpoint: string;
  input: string;
  types?: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const GOOGLE_API_KEY = Deno.env.get('GOOGLE_API_KEY')

    console.log('=== GOOGLE API PROXY DEBUG START ===')
    console.log('Request method:', req.method)
    console.log('Request URL:', req.url)
    console.log('Request headers:', Object.fromEntries(req.headers.entries()))
    console.log('API Key exists:', !!GOOGLE_API_KEY)

    if (!GOOGLE_API_KEY) {
      console.error('Google API key not configured')
      return new Response(
        JSON.stringify({ 
          error: 'Google API key not configured'
        }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    let requestBody: any = {}

    // Parse request body for POST requests
    if (req.method === 'POST') {
      try {
        const contentType = req.headers.get('content-type') || ''
        console.log('Content-Type header:', contentType)
        
        if (contentType.includes('application/json')) {
          const bodyText = await req.text()
          console.log('Raw request body length:', bodyText.length)
          console.log('Raw request body:', bodyText)
          
          if (bodyText.trim()) {
            requestBody = JSON.parse(bodyText)
            console.log('Parsed request body:', JSON.stringify(requestBody, null, 2))
          } else {
            console.error('Empty request body received')
            return new Response(
              JSON.stringify({ 
                error: 'Request body is required'
              }),
              { 
                status: 400, 
                headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
              }
            )
          }
        } else {
          console.error('Invalid content type:', contentType)
          return new Response(
            JSON.stringify({ 
              error: 'Content-Type must be application/json'
            }),
            { 
              status: 400, 
              headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
            }
          )
        }
      } catch (parseError) {
        console.error('Failed to parse request body:', parseError)
        return new Response(
          JSON.stringify({ 
            error: 'Invalid JSON in request body',
            details: parseError.message
          }),
          { 
            status: 400, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        )
      }
    } else {
      console.error('Only POST method is supported')
      return new Response(
        JSON.stringify({ 
          error: 'Only POST method is supported'
        }),
        { 
          status: 405, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    const endpoint = requestBody.endpoint
    console.log('Processing endpoint:', endpoint)

    if (!endpoint) {
      console.error('Endpoint is required but not provided')
      return new Response(
        JSON.stringify({ 
          error: 'Endpoint is required'
        }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    let googleUrl: string

    switch (endpoint) {
      case 'geocode':
        if (!requestBody?.address) {
          return new Response(
            JSON.stringify({ 
              error: 'Address is required for geocoding'
            }),
            { 
              status: 400, 
              headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
            }
          )
        }
        googleUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(requestBody.address)}&key=${GOOGLE_API_KEY}`
        break

      case 'place-details':
        if (!requestBody?.place_id) {
          return new Response(
            JSON.stringify({ 
              error: 'Place ID is required for place details'
            }),
            { 
              status: 400, 
              headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
            }
          )
        }
        googleUrl = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${requestBody.place_id}&fields=place_id,formatted_address,address_components,geometry&key=${GOOGLE_API_KEY}`
        break

      case 'place-autocomplete':
        if (!requestBody?.input) {
          return new Response(
            JSON.stringify({ 
              error: 'Input is required for place autocomplete'
            }),
            { 
              status: 400, 
              headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
            }
          )
        }
        const types = requestBody.types || 'address'
        googleUrl = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(requestBody.input)}&types=${types}&key=${GOOGLE_API_KEY}`
        break

      default:
        return new Response(
          JSON.stringify({ 
            error: `Invalid endpoint: ${endpoint}. Use geocode, place-details, or place-autocomplete`
          }),
          { 
            status: 400, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        )
    }

    console.log('Making request to Google API URL (key redacted):', googleUrl.replace(GOOGLE_API_KEY, '[REDACTED]'))

    // Make request to Google API
    const response = await fetch(googleUrl)
    const data = await response.json()

    console.log('Google API response status:', response.status)
    console.log('Google API response data:', JSON.stringify(data, null, 2))

    // Check for Google API errors
    if (data.status && data.status !== 'OK') {
      console.error('Google API error:', data)
      return new Response(
        JSON.stringify({ 
          error: 'Google API error', 
          details: data.error_message || data.status
        }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    console.log('=== GOOGLE API PROXY SUCCESS ===')

    return new Response(
      JSON.stringify(data),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error) {
    console.error('Error in google-api-proxy:', error)
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error', 
        details: error instanceof Error ? error.message : 'Unknown error'
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})
