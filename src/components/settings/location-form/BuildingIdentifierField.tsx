
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { LocationFormData } from "./types";

interface BuildingIdentifierFieldProps {
  formData: LocationFormData;
  onInputChange: (field: keyof LocationFormData, value: string | boolean) => void;
}

export const BuildingIdentifierField = ({ 
  formData, 
  onInputChange 
}: BuildingIdentifierFieldProps) => {
  if (formData.dwelling_type !== 'APARTMENT_BUILDING') {
    return null;
  }

  return (
    <div className="space-y-2">
      <Label htmlFor="building_identifier">Building Identifier *</Label>
      <Input
        id="building_identifier"
        type="text"
        placeholder="e.g., The Grand Plaza Main Tower"
        value={formData.building_identifier}
        onChange={(e) => onInputChange('building_identifier', e.target.value)}
        required
      />
      <p className="text-sm text-gray-500">
        Use a consistent name that neighbors in your building would recognize and use.
      </p>
    </div>
  );
};
