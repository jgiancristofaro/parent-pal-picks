
import { supabase } from "@/integrations/supabase/client";

export const testGooglePlacesService = async () => {
  console.log('🔍 Testing Google Places Service...');
  
  try {
    // Test with a simple autocomplete request
    const testData = {
      endpoint: 'place-autocomplete',
      input: 'New York',
      types: 'address'
    };

    console.log('📤 Sending test request to google-api-proxy:', testData);

    const { data: result, error } = await supabase.functions.invoke('google-api-proxy', {
      body: JSON.stringify(testData),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    console.log('📥 Raw response from Edge Function:', { result, error });

    if (error) {
      console.error('❌ Edge Function Error:', error);
      return {
        success: false,
        error: `Edge Function Error: ${error.message}`,
        details: error
      };
    }

    if (!result) {
      console.error('❌ No result returned from Edge Function');
      return {
        success: false,
        error: 'No result returned from Edge Function'
      };
    }

    if (result.error) {
      console.error('❌ Google API Error:', result);
      return {
        success: false,
        error: `Google API Error: ${result.error}`,
        details: result
      };
    }

    console.log('✅ Test successful! Google Places API is working');
    console.log('📊 Result summary:', {
      status: result.status,
      predictions: result.predictions?.length || 0,
      firstPrediction: result.predictions?.[0]?.description
    });

    return {
      success: true,
      data: result,
      summary: {
        status: result.status,
        predictionsCount: result.predictions?.length || 0,
        firstPrediction: result.predictions?.[0]?.description
      }
    };

  } catch (error) {
    console.error('❌ Test failed with error:', error);
    return {
      success: false,
      error: `Test failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
      details: error
    };
  }
};
