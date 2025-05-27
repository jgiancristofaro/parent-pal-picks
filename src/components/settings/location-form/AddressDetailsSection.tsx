
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { LocationFormData } from "./types";

interface AddressDetailsSectionProps {
  formData: LocationFormData;
  onInputChange: (field: keyof LocationFormData, value: string | boolean) => void;
}

export const AddressDetailsSection = ({ 
  formData, 
  onInputChange 
}: AddressDetailsSectionProps) => {
  return (
    <div className="space-y-4">
      <Label className="text-base font-medium">Address Details (Optional)</Label>
      <p className="text-sm text-gray-500">These details are for your reference only.</p>
      
      <div className="space-y-2">
        <Label htmlFor="street">Street Address</Label>
        <Input
          id="street"
          type="text"
          placeholder="123 Main Street, Apt 4B"
          value={formData.street}
          onChange={(e) => onInputChange('street', e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="city">City</Label>
        <Input
          id="city"
          type="text"
          placeholder="New York"
          value={formData.city}
          onChange={(e) => onInputChange('city', e.target.value)}
        />
      </div>
    </div>
  );
};
