
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { LocationFormData } from "./types";

interface PrimaryHomeCheckboxProps {
  formData: LocationFormData;
  onInputChange: (field: keyof LocationFormData, value: string | boolean) => void;
}

export const PrimaryHomeCheckbox = ({ 
  formData, 
  onInputChange 
}: PrimaryHomeCheckboxProps) => {
  return (
    <div className="flex items-center space-x-2">
      <Checkbox
        id="is_primary"
        checked={formData.is_primary}
        onCheckedChange={(checked) => onInputChange('is_primary', checked as boolean)}
      />
      <Label htmlFor="is_primary" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
        Set as primary home
      </Label>
    </div>
  );
};
