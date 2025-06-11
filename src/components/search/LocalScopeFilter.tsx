
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { MapPin } from "lucide-react";

interface UserLocationDetails {
  id: string;
  location_nickname: string;
  dwelling_type: string;
  google_place_id: string | null;
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
  onLocalSearchScopeChange,
}: LocalScopeFilterProps) => {
  if (!selectedUserHomeDetails) return null;

  const hasValidGooglePlaceId = selectedUserHomeDetails.google_place_id && 
    selectedUserHomeDetails.google_place_id.trim() !== '';
  
  const canSearchBuilding = hasValidGooglePlaceId && 
    selectedUserHomeDetails.dwelling_type === 'APARTMENT_BUILDING';

  return (
    <div className="mb-4 p-4 bg-white rounded-lg border border-gray-200">
      <div className="flex items-center space-x-3 mb-3">
        <MapPin className="h-5 w-5 text-purple-600" />
        <Label className="text-sm font-medium">
          Search scope for "{selectedUserHomeDetails.location_nickname}":
        </Label>
      </div>
      
      <RadioGroup value={localSearchScope} onValueChange={onLocalSearchScopeChange}>
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="ANY" id="any" />
            <Label htmlFor="any" className="text-sm">
              All sitters (no location filter)
            </Label>
          </div>
          
          {canSearchBuilding && (
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="BUILDING" id="building" />
              <Label htmlFor="building" className="text-sm">
                Only in my building
              </Label>
            </div>
          )}
          
          {selectedUserHomeDetails.zip_code && (
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="AREA_ZIP" id="area" />
              <Label htmlFor="area" className="text-sm">
                In my area (ZIP: {selectedUserHomeDetails.zip_code})
              </Label>
            </div>
          )}
        </div>
      </RadioGroup>
      
      {!canSearchBuilding && selectedUserHomeDetails.dwelling_type === 'APARTMENT_BUILDING' && (
        <p className="text-xs text-gray-500 mt-2">
          Building search unavailable - address needs verification for precise location matching.
        </p>
      )}
      
      {selectedUserHomeDetails.dwelling_type !== 'APARTMENT_BUILDING' && (
        <p className="text-xs text-gray-500 mt-2">
          Building search is only available for apartment buildings.
        </p>
      )}
    </div>
  );
};
