
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Home } from "lucide-react";

interface UserLocation {
  id: string;
  location_nickname: string;
  dwelling_type: string;
}

interface HomeSelectorProps {
  userLocations: UserLocation[];
  selectedUserHomeId: string | null;
  onSelectedUserHomeIdChange: (id: string | null) => void;
}

export const HomeSelector = ({ 
  userLocations, 
  selectedUserHomeId, 
  onSelectedUserHomeIdChange 
}: HomeSelectorProps) => {
  if (userLocations.length === 0) return null;

  return (
    <div className="mb-4 p-4 bg-white rounded-lg border border-gray-200">
      <div className="flex items-center space-x-3 mb-3">
        <Home className="h-5 w-5 text-purple-600" />
        <Label className="text-sm font-medium">Search for sitters near:</Label>
      </div>
      <Select value={selectedUserHomeId || ""} onValueChange={onSelectedUserHomeIdChange}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select your home" />
        </SelectTrigger>
        <SelectContent>
          {userLocations.map((location) => (
            <SelectItem key={location.id} value={location.id}>
              {location.location_nickname} ({location.dwelling_type.replace('_', ' ').toLowerCase()})
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
