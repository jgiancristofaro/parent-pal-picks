
import { Label } from "@/components/ui/label";
import { LocationFormData } from "./types";
import { AddressAutocomplete } from "./AddressAutocomplete";
import { PlaceDetails, googlePlacesService } from "@/services/googlePlacesService";

interface AddressDetailsSectionProps {
  formData: LocationFormData;
  onInputChange: (field: keyof LocationFormData, value: string | boolean) => void;
  onPlaceSelect?: (placeData: { 
    googlePlaceId: string; 
    standardizedAddress: string; 
    latitude: number; 
    longitude: number;
    extractedComponents: any;
  }) => void;
}

export const AddressDetailsSection = ({ 
  formData, 
  onInputChange,
  onPlaceSelect
}: AddressDetailsSectionProps) => {
  const handlePlaceSelect = (place: PlaceDetails) => {
    const components = googlePlacesService.extractAddressComponents(place.address_components);
    
    // Update the street field with the formatted address
    onInputChange('street', place.formatted_address);
    
    // Update the city field if we have locality
    if (components.city) {
      onInputChange('city', components.city);
    }

    // Call the callback with place data including Google-specific fields
    if (onPlaceSelect) {
      onPlaceSelect({
        googlePlaceId: place.place_id,
        standardizedAddress: place.formatted_address,
        latitude: place.geometry.location.lat,
        longitude: place.geometry.location.lng,
        extractedComponents: components
      });
    }
  };

  return (
    <div className="space-y-4">
      <Label className="text-base font-medium">Address Details (Optional)</Label>
      <p className="text-sm text-gray-500">
        Start typing to search for your address with Google Places autocomplete.
      </p>
      
      <AddressAutocomplete
        value={formData.street}
        onChange={(value) => onInputChange('street', value)}
        onPlaceSelect={handlePlaceSelect}
        placeholder="Start typing your address..."
        label="Street Address"
      />

      <div className="space-y-2">
        <Label htmlFor="city">City</Label>
        <input
          id="city"
          type="text"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="City (auto-filled from address selection)"
          value={formData.city}
          onChange={(e) => onInputChange('city', e.target.value)}
        />
      </div>
    </div>
  );
};
