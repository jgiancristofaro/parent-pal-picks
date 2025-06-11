
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
  private async callGoogleAPI(endpoint: string, data: any) {
    console.log(`GooglePlacesService: Calling ${endpoint} with data:`, data);
    
    try {
      const { data: result, error } = await supabase.functions.invoke('google-api-proxy', {
        body: data,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (error) {
        console.error(`GooglePlacesService: Supabase function error for ${endpoint}:`, error);
        throw new Error(`Failed to call Google API: ${error.message}`);
      }

      console.log(`GooglePlacesService: Success response from ${endpoint}:`, result);
      return result;
    } catch (error) {
      console.error(`GooglePlacesService: Network/parsing error for ${endpoint}:`, error);
      throw new Error(`Failed to call Google API: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async geocodeAddress(address: string): Promise<PlaceDetails[]> {
    try {
      console.log('GooglePlacesService: Geocoding address:', address);
      
      const { data: result, error } = await supabase.functions.invoke('google-api-proxy', {
        body: { 
          endpoint: 'geocode',
          address 
        },
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (error) {
        console.error('GooglePlacesService: Geocoding error:', error);
        throw new Error(`Geocoding failed: ${error.message}`);
      }

      return result?.results || [];
    } catch (error) {
      console.error('GooglePlacesService: Geocoding error:', error);
      throw error;
    }
  }

  async getPlaceDetails(placeId: string): Promise<PlaceDetails | null> {
    try {
      console.log('GooglePlacesService: Getting place details for:', placeId);
      
      const { data: result, error } = await supabase.functions.invoke('google-api-proxy', {
        body: { 
          endpoint: 'place-details',
          place_id: placeId 
        },
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (error) {
        console.error('GooglePlacesService: Place details error:', error);
        throw new Error(`Place details failed: ${error.message}`);
      }

      return result?.result || null;
    } catch (error) {
      console.error('GooglePlacesService: Place details error:', error);
      throw error;
    }
  }

  async getPlaceAutocomplete(input: string, types = 'address'): Promise<AutocompletePrediction[]> {
    try {
      console.log('GooglePlacesService: Getting autocomplete for:', input, 'types:', types);
      
      const { data: result, error } = await supabase.functions.invoke('google-api-proxy', {
        body: { 
          endpoint: 'place-autocomplete',
          input, 
          types 
        },
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (error) {
        console.error('GooglePlacesService: Autocomplete error:', error);
        throw new Error(`Autocomplete failed: ${error.message}`);
      }

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
