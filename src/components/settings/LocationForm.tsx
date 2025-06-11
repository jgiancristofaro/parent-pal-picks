
import { Button } from "@/components/ui/button";
import { LocationFormProps } from "./location-form/types";
import { BasicInfoFields } from "./location-form/BasicInfoFields";
import { GooglePlacesAutocomplete } from "./location-form/GooglePlacesAutocomplete";
import { UnitNumberField } from "./location-form/UnitNumberField";
import { ManualAddressForm } from "./location-form/ManualAddressForm";
import { PrimaryHomeCheckbox } from "./location-form/PrimaryHomeCheckbox";
import { useLocationForm } from "./location-form/useLocationForm";
import { useState } from "react";

export const LocationForm = ({ initialData, onSuccess }: LocationFormProps) => {
  const [useManualEntry, setUseManualEntry] = useState(false);
  const [unitNumber, setUnitNumber] = useState(initialData?.unit_number || "");
  const [manualAddressData, setManualAddressData] = useState({
    street: initialData?.address_details?.street || "",
    city: initialData?.address_details?.city || "",
    state: initialData?.address_details?.state || "",
    zipCode: initialData?.zip_code || ""
  });

  const {
    formData,
    selectedPlace,
    searchInput,
    handleSubmit,
    handleInputChange,
    handleDwellingTypeChange,
    handlePlaceSelect,
    handleSearchInputChange,
    handleClearAddress,
    saveLocationMutation,
  } = useLocationForm(initialData, onSuccess);

  const handleGooglePlaceSelect = (placeData: {
    googlePlaceId: string;
    standardizedAddress: string;
    latitude: number;
    longitude: number;
    addressComponents: any;
  }) => {
    handlePlaceSelect({
      googlePlaceId: placeData.googlePlaceId,
      standardizedAddress: placeData.standardizedAddress,
      latitude: placeData.latitude,
      longitude: placeData.longitude,
      extractedComponents: placeData.addressComponents
    });
    
    // Update the manual address data as well for display
    setManualAddressData({
      street: placeData.standardizedAddress,
      city: placeData.addressComponents.city || "",
      state: placeData.addressComponents.state || "",
      zipCode: placeData.addressComponents.zip_code || ""
    });
  };

  const handleManualAddressChange = (field: string, value: string) => {
    setManualAddressData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Update the form data as well
    if (field === 'street') {
      handleInputChange('street', value);
    } else if (field === 'city') {
      handleInputChange('city', value);
    } else if (field === 'zipCode') {
      handleInputChange('zip_code', value);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Add unit number to the submission
    const enhancedFormData = {
      ...formData,
      unit_number: unitNumber,
    };
    
    // If using manual entry, make sure the data is properly set
    if (useManualEntry) {
      enhancedFormData.street = manualAddressData.street;
      enhancedFormData.city = manualAddressData.city;
      enhancedFormData.zip_code = manualAddressData.zipCode;
    }
    
    handleSubmit(e, enhancedFormData);
  };

  const handleClearAddressClick = () => {
    handleClearAddress();
    setUseManualEntry(false);
    setManualAddressData({
      street: "",
      city: "",
      state: "",
      zipCode: ""
    });
  };

  return (
    <form onSubmit={handleFormSubmit} className="flex flex-col h-full max-h-[70vh]">
      {/* Scrollable content area with improved padding */}
      <div className="flex-1 overflow-y-auto no-scrollbar space-y-6 p-6">
        {/* 1. Location Nickname */}
        <div className="space-y-2">
          <BasicInfoFields
            formData={formData}
            onInputChange={handleInputChange}
            onDwellingTypeChange={handleDwellingTypeChange}
            isManualEntry={useManualEntry}
            showZipCode={false} // We'll show ZIP separately
          />
        </div>

        {/* 2. Dwelling Type is included in BasicInfoFields above */}

        {/* 3. Google Address Autocomplete */}
        <div className="space-y-4">
          {!useManualEntry ? (
            <GooglePlacesAutocomplete
              searchValue={searchInput}
              onSearchChange={handleSearchInputChange}
              onPlaceSelect={handleGooglePlaceSelect}
              onEscapeHatch={() => setUseManualEntry(true)}
              selectedPlace={selectedPlace}
              onClearAddress={handleClearAddressClick}
            />
          ) : (
            <ManualAddressForm
              formData={manualAddressData}
              onChange={handleManualAddressChange}
              onBackToAutocomplete={() => setUseManualEntry(false)}
            />
          )}
        </div>

        {/* 4. Unit Number Field - only show if address is selected */}
        {(selectedPlace || useManualEntry) && (
          <UnitNumberField
            value={unitNumber}
            onChange={setUnitNumber}
          />
        )}

        {/* 5. ZIP Code - show auto-filled or manual entry */}
        {(selectedPlace || useManualEntry) && (
          <BasicInfoFields
            formData={formData}
            onInputChange={handleInputChange}
            onDwellingTypeChange={handleDwellingTypeChange}
            isManualEntry={useManualEntry}
            showZipCode={true}
          />
        )}

        {/* Selected Address Confirmation - single green version only */}
        {selectedPlace && !useManualEntry && (
          <div className="p-4 bg-green-50 border border-green-200 rounded-md">
            <h4 className="font-medium text-sm mb-2 text-green-800">Selected Address:</h4>
            <p className="text-sm text-green-700">{selectedPlace.standardizedAddress}</p>
            {unitNumber && (
              <p className="text-sm text-green-700 mt-1">Unit: {unitNumber}</p>
            )}
          </div>
        )}

        {/* 6. Primary Home Checkbox with improved spacing */}
        <div className="pb-4">
          <PrimaryHomeCheckbox
            formData={formData}
            onInputChange={handleInputChange}
          />
        </div>
      </div>

      {/* Fixed submit button area */}
      <div className="flex justify-end space-x-2 pt-4 border-t bg-white px-6">
        <Button 
          type="submit" 
          disabled={saveLocationMutation.isPending}
        >
          {saveLocationMutation.isPending 
            ? "Saving..." 
            : (initialData ? "Update Location" : "Add Location")
          }
        </Button>
      </div>
    </form>
  );
};
