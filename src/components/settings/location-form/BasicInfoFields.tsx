
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LocationFormData, DwellingType } from "./types";

interface BasicInfoFieldsProps {
  formData: LocationFormData;
  onInputChange: (field: keyof LocationFormData, value: string | boolean) => void;
  onDwellingTypeChange: (value: string) => void;
}

export const BasicInfoFields = ({ 
  formData, 
  onInputChange, 
  onDwellingTypeChange 
}: BasicInfoFieldsProps) => {
  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="location_nickname">Location Nickname *</Label>
        <Input
          id="location_nickname"
          type="text"
          placeholder="e.g., Main Home, Downtown Apartment"
          value={formData.location_nickname}
          onChange={(e) => onInputChange('location_nickname', e.target.value)}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="dwelling_type">Dwelling Type *</Label>
        <Select value={formData.dwelling_type} onValueChange={onDwellingTypeChange}>
          <SelectTrigger>
            <SelectValue placeholder="Select dwelling type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="APARTMENT_BUILDING">Apartment Building</SelectItem>
            <SelectItem value="SINGLE_FAMILY_HOME">Single Family Home</SelectItem>
            <SelectItem value="TOWNHOUSE">Townhouse</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="zip_code">ZIP Code *</Label>
        <Input
          id="zip_code"
          type="text"
          placeholder="e.g., 10001"
          value={formData.zip_code}
          onChange={(e) => onInputChange('zip_code', e.target.value)}
          required
        />
      </div>
    </>
  );
};
