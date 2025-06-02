
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { SearchInput } from "@/components/search/SearchInput";
import { HomeSelector } from "@/components/search/HomeSelector";
import { LocalScopeFilter } from "@/components/search/LocalScopeFilter";

interface UserLocation {
  id: string;
  location_nickname: string;
}

interface UserLocationDetails {
  location_nickname: string;
  building_identifier: string | null;
  zip_code: string;
}

interface SearchFiltersProps {
  searchTerm: string;
  onSearchTermChange: (term: string) => void;
  friendRecommendedOnly: boolean;
  onFriendRecommendedOnlyChange: (value: boolean) => void;
  userLocations: UserLocation[];
  selectedUserHomeId: string | null;
  onSelectedUserHomeIdChange: (id: string | null) => void;
  selectedUserHomeDetails: UserLocationDetails | undefined;
  localSearchScope: string;
  onLocalSearchScopeChange: (scope: string) => void;
}

export const SearchFilters = ({
  searchTerm,
  onSearchTermChange,
  friendRecommendedOnly,
  onFriendRecommendedOnlyChange,
  userLocations,
  selectedUserHomeId,
  onSelectedUserHomeIdChange,
  selectedUserHomeDetails,
  localSearchScope,
  onLocalSearchScopeChange,
}: SearchFiltersProps) => {
  return (
    <>
      {/* Search Bar */}
      <SearchInput 
        searchTerm={searchTerm}
        onSearchTermChange={onSearchTermChange}
      />

      {/* Home Selection */}
      <HomeSelector 
        userLocations={userLocations}
        selectedUserHomeId={selectedUserHomeId}
        onSelectedUserHomeIdChange={onSelectedUserHomeIdChange}
      />

      {/* Dynamic Local Options Filter */}
      <LocalScopeFilter 
        selectedUserHomeDetails={selectedUserHomeDetails}
        localSearchScope={localSearchScope}
        onLocalSearchScopeChange={onLocalSearchScopeChange}
      />

      {/* Friend Recommended Filter */}
      <div className="mb-4 p-4 bg-white rounded-lg border border-gray-200">
        <div className="flex items-center space-x-3">
          <Switch
            id="friend-recommended"
            checked={friendRecommendedOnly}
            onCheckedChange={onFriendRecommendedOnlyChange}
          />
          <Label htmlFor="friend-recommended" className="text-sm font-medium">
            Friend-Recommended Only
          </Label>
        </div>
        <p className="text-xs text-gray-500 mt-2">
          Show only sitters recommended by people you follow.
        </p>
      </div>
    </>
  );
};
