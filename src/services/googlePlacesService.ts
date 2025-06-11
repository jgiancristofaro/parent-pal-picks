
export interface AddressComponent {
  long_name: string;
  short_name: string;
  types: string[];
}

export interface PlaceGeometry {
  location: {
    lat: number;
    lng: number;
  };
}

export interface PlaceDetails {
  place_id: string;
  formatted_address: string;
  address_components: AddressComponent[];
  geometry: PlaceGeometry;
}

export interface AutocompletePrediction {
  description: string;
  place_id: string;
  structured_formatting: {
    main_text: string;
    secondary_text: string;
  };
}

export interface AutocompleteResponse {
  predictions: AutocompletePrediction[];
  status: string;
}

class GooglePlacesService {
  private async callGoogleAPI(endpoint: string, requestData: any) {
    console.log(`GooglePlacesService: Calling ${endpoint} with data:`, requestData);
    
    try {
      // Construct the Edge Function URL directly
      const edgeFunctionUrl = 'https://jmyfwrbwpbbbmoournsg.supabase.co/functions/v1/google-api-proxy';
      
      const requestBody = {
        endpoint,
        ...requestData
      };

      console.log('GooglePlacesService: Final request body:', requestBody);

      // Make direct fetch request with proper headers
      const response = await fetch(edgeFunctionUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpteWZ3cmJ3cGJiYm1vb3VybnNnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgxMDgyNTQsImV4cCI6MjA2MzY4NDI1NH0.rV3Tvvw1FeKarR5DSVoensPWowEHIr_WRBL__hqZNe0`,
          'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpteWZ3cmJ3cGJiYm1vb3VybnNnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgxMDgyNTQsImV4cCI6MjA2MzY4NDI1NH0.rV3Tvvw1FeKarR5DSVoensPWowEHIr_WRBL__hqZNe0'
        },
        body: JSON.stringify(requestBody)
      });

      console.log('GooglePlacesService: Response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('GooglePlacesService: Direct fetch failed with status:', response.status);
        console.error('GooglePlacesService: Error response body:', errorText);
        
        if (response.status === 500) {
          throw new Error(`Google API service is currently unavailable. Please try again in a moment.`);
        } else if (response.status === 400) {
          throw new Error(`Google API request failed. This might be due to API key configuration or rate limits.`);
        } else {
          throw new Error(`Failed to connect to address service: ${response.status} ${response.statusText}`);
        }
      }

      const result = await response.json();
      console.log('GooglePlacesService: Response data:', result);

      // Check for Google API specific errors in the result
      if (result.error) {
        console.error(`GooglePlacesService: Google API error in result:`, result);
        throw new Error(`Address lookup failed: ${result.error.details || result.error}`);
      }

      console.log(`GooglePlacesService: Success response from ${endpoint}:`, result);
      return result;
    } catch (error) {
      console.error(`GooglePlacesService: Network/parsing error for ${endpoint}:`, error);
      
      if (error instanceof Error && error.message.includes('Google API')) {
        throw error; // Re-throw our custom error
      }
      
      throw new Error(`Address service error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async geocodeAddress(address: string): Promise<PlaceDetails[]> {
    try {
      console.log('GooglePlacesService: Geocoding address:', address);
      
      const result = await this.callGoogleAPI('geocode', { address });
      return result?.results || [];
    } catch (error) {
      console.error('GooglePlacesService: Geocoding error:', error);
      throw error;
    }
  }

  async getPlaceDetails(placeId: string): Promise<PlaceDetails | null> {
    try {
      console.log('GooglePlacesService: Getting place details for:', placeId);
      
      const result = await this.callGoogleAPI('place-details', { place_id: placeId });
      return result?.result || null;
    } catch (error) {
      console.error('GooglePlacesService: Place details error:', error);
      throw error;
    }
  }

  async getPlaceAutocomplete(input: string, types = 'address'): Promise<AutocompletePrediction[]> {
    try {
      console.log('GooglePlacesService: Getting autocomplete for:', input, 'types:', types);
      
      const result = await this.callGoogleAPI('place-autocomplete', { input, types });
      
      console.log('GooglePlacesService: Autocomplete response:', result);
      return result?.predictions || [];
    } catch (error) {
      console.error('GooglePlacesService: Autocomplete error:', error);
      throw error;
    }
  }

  extractAddressComponents(addressComponents: AddressComponent[]) {
    const components: { [key: string]: string } = {};
    
    addressComponents.forEach(component => {
      if (component.types.includes('street_number')) {
        components.street_number = component.long_name;
      }
      if (component.types.includes('route')) {
        components.route = component.long_name;
      }
      if (component.types.includes('locality')) {
        components.city = component.long_name;
      }
      if (component.types.includes('administrative_area_level_1')) {
        components.state = component.short_name;
      }
      if (component.types.includes('postal_code')) {
        components.zip_code = component.long_name;
      }
      if (component.types.includes('country')) {
        components.country = component.long_name;
      }
    });

    return components;
  }
}

export const googlePlacesService = new GooglePlacesService();
