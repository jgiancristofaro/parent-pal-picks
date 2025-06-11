
import { supabase } from "@/integrations/supabase/client";

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
      const requestBody = {
        endpoint,
        ...requestData
      };

      console.log('GooglePlacesService: Final request body:', requestBody);

      const { data: result, error } = await supabase.functions.invoke('google-api-proxy', {
        body: JSON.stringify(requestBody),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      console.log('GooglePlacesService: Raw response:', { result, error });

      if (error) {
        console.error(`GooglePlacesService: Supabase function error for ${endpoint}:`, error);
        
        // More specific error handling
        if (error.message?.includes('FunctionsHttpError')) {
          throw new Error(`Google API service is currently unavailable. Please try again in a moment.`);
        } else if (error.message?.includes('FunctionsRelayError')) {
          throw new Error(`Network connection error. Please check your internet connection and try again.`);
        } else if (error.message?.includes('non-2xx status code')) {
          throw new Error(`Google API request failed. This might be due to API key configuration or rate limits.`);
        } else {
          throw new Error(`Failed to connect to address service: ${error.message}`);
        }
      }

      if (!result) {
        console.error(`GooglePlacesService: No result returned for ${endpoint}`);
        throw new Error('No response received from address service');
      }

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
