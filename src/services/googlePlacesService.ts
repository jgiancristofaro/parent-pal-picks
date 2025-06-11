
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
    const { data: result, error } = await supabase.functions.invoke('google-api-proxy', {
      body: data,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (error) {
      console.error('Error calling Google API proxy:', error);
      throw new Error('Failed to call Google API');
    }

    return result;
  }

  async geocodeAddress(address: string): Promise<PlaceDetails[]> {
    try {
      const response = await fetch(`https://jmyfwrbwpbbbmoournsg.supabase.co/functions/v1/google-api-proxy?endpoint=geocode`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpteWZ3cmJ3cGJiYm1vb3VybnNnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgxMDgyNTQsImV4cCI6MjA2MzY4NDI1NH0.rV3Tvvw1FeKarR5DSVoensPWowEHIr_WRBL__hqZNe0`,
        },
        body: JSON.stringify({ address }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Geocoding failed');
      }

      return data.results || [];
    } catch (error) {
      console.error('Geocoding error:', error);
      throw error;
    }
  }

  async getPlaceDetails(placeId: string): Promise<PlaceDetails | null> {
    try {
      const response = await fetch(`https://jmyfwrbwpbbbmoournsg.supabase.co/functions/v1/google-api-proxy?endpoint=place-details`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpteWZ3cmJ3cGJiYm1vb3VybnNnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgxMDgyNTQsImV4cCI6MjA2MzY4NDI1NH0.rV3Tvvw1FeKarR5DSVoensPWowEHIr_WRBL__hqZNe0`,
        },
        body: JSON.stringify({ place_id: placeId }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to get place details');
      }

      return data.result || null;
    } catch (error) {
      console.error('Place details error:', error);
      throw error;
    }
  }

  async getPlaceAutocomplete(input: string, types = 'address'): Promise<AutocompletePrediction[]> {
    try {
      const response = await fetch(`https://jmyfwrbwpbbbmoournsg.supabase.co/functions/v1/google-api-proxy?endpoint=place-autocomplete`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpteWZ3cmJ3cGJiYm1vb3VybnNnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgxMDgyNTQsImV4cCI6MjA2MzY4NDI1NH0.rV3Tvvw1FeKarR5DSVoensPWowEHIr_WRBL__hqZNe0`,
        },
        body: JSON.stringify({ input, types }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Autocomplete failed');
      }

      return data.predictions || [];
    } catch (error) {
      console.error('Autocomplete error:', error);
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
