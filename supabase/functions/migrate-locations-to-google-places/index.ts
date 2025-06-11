
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface LocationRecord {
  id: string;
  location_nickname: string;
  building_identifier: string;
  address_details: any;
  zip_code: string;
}

interface MigrationResult {
  total_processed: number;
  successful_updates: number;
  failed_geocoding: number;
  ambiguous_results: LocationRecord[];
  errors: Array<{id: string, error: string}>;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    console.log('Starting migration of user_locations to Google Places...')

    // Step 1: Fetch all records where google_place_id is null
    const { data: locations, error: fetchError } = await supabase
      .from('user_locations')
      .select('*')
      .is('google_place_id', null)

    if (fetchError) {
      throw new Error(`Failed to fetch locations: ${fetchError.message}`)
    }

    console.log(`Found ${locations?.length || 0} locations to migrate`)

    const migrationResult: MigrationResult = {
      total_processed: 0,
      successful_updates: 0,
      failed_geocoding: 0,
      ambiguous_results: [],
      errors: []
    }

    if (!locations || locations.length === 0) {
      return new Response(
        JSON.stringify({
          message: 'No locations found that need migration',
          result: migrationResult
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    // Step 2: Process each location
    for (const location of locations) {
      migrationResult.total_processed++
      console.log(`Processing location ${location.id}: ${location.location_nickname}`)

      try {
        // Step 3: Combine address fields into a single string
        const addressString = buildAddressString(location)
        console.log(`Built address string: ${addressString}`)

        if (!addressString.trim()) {
          migrationResult.errors.push({
            id: location.id,
            error: 'Could not build valid address string'
          })
          continue
        }

        // Step 4: Call the google-api-proxy to geocode the address
        const geocodeResponse = await fetch(`${supabaseUrl}/functions/v1/google-api-proxy?endpoint=geocode`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${supabaseServiceKey}`,
          },
          body: JSON.stringify({ address: addressString }),
        })

        if (!geocodeResponse.ok) {
          const errorText = await geocodeResponse.text()
          migrationResult.errors.push({
            id: location.id,
            error: `Geocoding API error: ${errorText}`
          })
          migrationResult.failed_geocoding++
          continue
        }

        const geocodeData = await geocodeResponse.json()
        console.log(`Geocoding response for ${location.id}:`, geocodeData)

        // Step 5: Handle the response
        if (!geocodeData.results || geocodeData.results.length === 0) {
          migrationResult.errors.push({
            id: location.id,
            error: 'No geocoding results found'
          })
          migrationResult.failed_geocoding++
          continue
        }

        // Check for high-confidence single result
        if (geocodeData.results.length === 1) {
          const result = geocodeData.results[0]
          
          // Update the record with Google Places data
          const { error: updateError } = await supabase
            .from('user_locations')
            .update({
              google_place_id: result.place_id,
              standardized_address: result.formatted_address,
              latitude: result.geometry?.location?.lat || null,
              longitude: result.geometry?.location?.lng || null,
              updated_at: new Date().toISOString()
            })
            .eq('id', location.id)

          if (updateError) {
            migrationResult.errors.push({
              id: location.id,
              error: `Database update failed: ${updateError.message}`
            })
          } else {
            migrationResult.successful_updates++
            console.log(`Successfully updated location ${location.id}`)
          }

        } else {
          // Multiple results - mark for manual review
          console.log(`Multiple results for location ${location.id}, marking for manual review`)
          migrationResult.ambiguous_results.push(location)
        }

      } catch (error) {
        console.error(`Error processing location ${location.id}:`, error)
        migrationResult.errors.push({
          id: location.id,
          error: error instanceof Error ? error.message : 'Unknown error'
        })
      }

      // Add a small delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 100))
    }

    // Step 6: Log results for manual review
    console.log('Migration completed. Results:', migrationResult)

    if (migrationResult.ambiguous_results.length > 0) {
      console.log('Locations requiring manual review:')
      migrationResult.ambiguous_results.forEach(loc => {
        console.log(`- ID: ${loc.id}, Nickname: ${loc.location_nickname}, Address: ${buildAddressString(loc)}`)
      })
    }

    if (migrationResult.errors.length > 0) {
      console.log('Locations with errors:')
      migrationResult.errors.forEach(err => {
        console.log(`- ID: ${err.id}, Error: ${err.error}`)
      })
    }

    return new Response(
      JSON.stringify({
        message: 'Migration completed',
        result: migrationResult
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )

  } catch (error) {
    console.error('Migration failed:', error)
    return new Response(
      JSON.stringify({ 
        error: 'Migration failed', 
        details: error instanceof Error ? error.message : 'Unknown error' 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})

function buildAddressString(location: LocationRecord): string {
  const parts: string[] = []
  
  // Add address details if available
  if (location.address_details) {
    if (typeof location.address_details === 'string') {
      parts.push(location.address_details)
    } else if (typeof location.address_details === 'object') {
      // Extract street address from address_details object
      if (location.address_details.street) {
        parts.push(location.address_details.street)
      }
      if (location.address_details.city) {
        parts.push(location.address_details.city)
      }
      if (location.address_details.state) {
        parts.push(location.address_details.state)
      }
    }
  }
  
  // Add building identifier if available
  if (location.building_identifier && location.building_identifier.trim()) {
    parts.push(location.building_identifier)
  }
  
  // Add zip code
  if (location.zip_code && location.zip_code.trim()) {
    parts.push(location.zip_code)
  }
  
  return parts.filter(part => part && part.trim()).join(', ')
}
