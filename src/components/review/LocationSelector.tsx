
import React from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface UserLocation {
  id: string;
  location_nickname: string;
}

interface LocationSelectorProps {
  userLocations: UserLocation[];
  selectedLocationId: string;
  onLocationChange: (locationId: string) => void;
}

export const LocationSelector = ({ 
  userLocations, 
  selectedLocationId, 
  onLocationChange 
}: LocationSelectorProps) => {
  if (userLocations.length === 0) {
    return (
      <div className="text-sm text-gray-500 bg-gray-50 p-3 rounded-lg">
        Add a home in your settings to tag this review to a specific location.
      </div>
    );
  }

  return (
    <div>
      <label className="block text-sm font-medium mb-2">Which home was this service for?</label>
      <Select value={selectedLocationId} onValueChange={onLocationChange}>
        <SelectTrigger>
          <SelectValue placeholder="Select a home (Optional)" />
        </SelectTrigger>
        <SelectContent>
          {userLocations.map((location) => (
            <SelectItem key={location.id} value={location.id}>
              {location.location_nickname}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
