
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

interface UserLocationDetails {
  id: string;
  location_nickname: string;
  dwelling_type: string;
  building_identifier: string | null;
  zip_code: string;
}

interface LocalScopeFilterProps {
  selectedUserHomeDetails: UserLocationDetails | undefined;
  localSearchScope: string;
  onLocalSearchScopeChange: (scope: string) => void;
}

export const LocalScopeFilter = ({ 
  selectedUserHomeDetails, 
  localSearchScope, 
  onLocalSearchScopeChange 
}: LocalScopeFilterProps) => {
  if (!selectedUserHomeDetails) return null;

  const canFilterByBuilding = selectedUserHomeDetails?.dwelling_type === 'APARTMENT_BUILDING' && 
                              selectedUserHomeDetails?.building_identifier && 
                              selectedUserHomeDetails.building_identifier.trim() !== '';

  return (
    <div className="mb-4 p-4 bg-white rounded-lg border border-gray-200">
      <Label className="text-sm font-medium mb-3 block">Find sitters reviewed by others:</Label>
      <RadioGroup value={localSearchScope} onValueChange={onLocalSearchScopeChange}>
        {/* Building Option - Only show for apartment buildings with building identifier */}
        {canFilterByBuilding && (
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="BUILDING" id="building" />
            <Label htmlFor="building" className="text-sm cursor-pointer">
              In my building ({selectedUserHomeDetails.building_identifier})
            </Label>
          </div>
        )}
        
        {/* Area/Zip Option */}
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="AREA_ZIP" id="area" />
          <Label htmlFor="area" className="text-sm cursor-pointer">
            In my area ({selectedUserHomeDetails.zip_code})
          </Label>
        </div>
        
        {/* Anywhere Option */}
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="ANY" id="anywhere" />
          <Label htmlFor="anywhere" className="text-sm cursor-pointer">
            Anywhere
          </Label>
        </div>
      </RadioGroup>
    </div>
  );
};
