
// Direct fetch test service to bypass Supabase client
export const testGooglePlacesDirectFetch = async () => {
  console.log('🔍 Testing Google Places Service with Direct Fetch...');
  
  try {
    // Construct the Edge Function URL directly
    const edgeFunctionUrl = 'https://jmyfwrbwpbbbmoournsg.supabase.co/functions/v1/google-api-proxy';
    
    // Test data payload
    const testData = {
      endpoint: 'place-autocomplete',
      input: 'New York',
      types: 'address'
    };

    console.log('📤 Sending direct fetch request to:', edgeFunctionUrl);
    console.log('📤 Request payload:', testData);

    // Make direct fetch request with proper headers
    const response = await fetch(edgeFunctionUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpteWZ3cmJ3cGJiYm1vb3VybnNnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgxMDgyNTQsImV4cCI6MjA2MzY4NDI1NH0.rV3Tvvw1FeKarR5DSVoensPWowEHIr_WRBL__hqZNe0`,
        'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpteWZ3cmJ3cGJiYm1vb3VybnNnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgxMDgyNTQsImV4cCI6MjA2MzY4NDI1NH0.rV3Tvvw1FeKarR5DSVoensPWowEHIr_WRBL__hqZNe0'
      },
      body: JSON.stringify(testData)
    });

    console.log('📥 Direct fetch response status:', response.status);
    console.log('📥 Direct fetch response headers:', Object.fromEntries(response.headers.entries()));

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Direct fetch failed with status:', response.status);
      console.error('❌ Error response body:', errorText);
      
      return {
        success: false,
        error: `Direct fetch failed with status ${response.status}: ${errorText}`,
        details: {
          status: response.status,
          statusText: response.statusText,
          errorBody: errorText
        }
      };
    }

    const result = await response.json();
    console.log('📥 Direct fetch response data:', result);

    if (result.error) {
      console.error('❌ Google API Error in direct fetch:', result);
      return {
        success: false,
        error: `Google API Error: ${result.error}`,
        details: result
      };
    }

    console.log('✅ Direct fetch test successful! Google Places API is working');
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
    console.error('❌ Direct fetch test failed with error:', error);
    return {
      success: false,
      error: `Direct fetch test failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
      details: error
    };
  }
};
