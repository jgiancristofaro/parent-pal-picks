
import { Button } from "@/components/ui/button";
import { LocationFormProps } from "./location-form/types";
import { BasicInfoFields } from "./location-form/BasicInfoFields";
import { BuildingIdentifierField } from "./location-form/BuildingIdentifierField";
import { AddressDetailsSection } from "./location-form/AddressDetailsSection";
import { PrimaryHomeCheckbox } from "./location-form/PrimaryHomeCheckbox";
import { useLocationForm } from "./location-form/useLocationForm";

export const LocationForm = ({ initialData, onSuccess }: LocationFormProps) => {
  const {
    formData,
    handleSubmit,
    handleInputChange,
    handleDwellingTypeChange,
    saveLocationMutation,
  } = useLocationForm(initialData, onSuccess);

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <BasicInfoFields
        formData={formData}
        onInputChange={handleInputChange}
        onDwellingTypeChange={handleDwellingTypeChange}
      />

      <BuildingIdentifierField
        formData={formData}
        onInputChange={handleInputChange}
      />

      <AddressDetailsSection
        formData={formData}
        onInputChange={handleInputChange}
      />

      <PrimaryHomeCheckbox
        formData={formData}
        onInputChange={handleInputChange}
      />

      <div className="flex justify-end space-x-2 pt-4">
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
