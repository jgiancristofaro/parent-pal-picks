
import { Header } from "@/components/Header";
import { BottomNavigation } from "@/components/BottomNavigation";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { HyperLocalSitters } from "@/components/search/HyperLocalSitters";
import { SearchInput } from "@/components/search/SearchInput";
import { HomeSelector } from "@/components/search/HomeSelector";
import { LocalScopeFilter } from "@/components/search/LocalScopeFilter";
import { SearchResultsGrid } from "@/components/search/SearchResultsGrid";
import { useSearchFilters } from "@/hooks/useSearchFilters";
import { useSitterData } from "@/hooks/useSitterData";

const Search = () => {
  // Mock current user ID for demonstration - in a real app this would come from auth
  const mockCurrentUserId = "user-2";

  // Custom hooks for managing state and data
  const {
    searchTerm,
    setSearchTerm,
    friendRecommendedOnly,
    setFriendRecommendedOnly,
    selectedUserHomeId,
    setSelectedUserHomeId,
    localSearchScope,
    setLocalSearchScope,
  } = useSearchFilters();

  const {
    userLocations,
    selectedUserHomeDetails,
    localSittersLoading,
    shouldFetchLocalSitters,
    displayedSitters
  } = useSitterData({
    mockCurrentUserId,
    selectedUserHomeId,
    localSearchScope,
    searchTerm,
    friendRecommendedOnly
  });

  return (
    <div className="min-h-screen pb-20 bg-purple-50">
      <Header title="Find a sitter" showBack={true} showSettings={false} />
      
      <div className="p-4">
        {/* Search Bar */}
        <SearchInput 
          searchTerm={searchTerm}
          onSearchTermChange={setSearchTerm}
        />

        {/* Home Selection */}
        <HomeSelector 
          userLocations={userLocations}
          selectedUserHomeId={selectedUserHomeId}
          onSelectedUserHomeIdChange={setSelectedUserHomeId}
        />

        {/* Dynamic Local Options Filter */}
        <LocalScopeFilter 
          selectedUserHomeDetails={selectedUserHomeDetails}
          localSearchScope={localSearchScope}
          onLocalSearchScopeChange={setLocalSearchScope}
        />

        {/* Friend Recommended Filter */}
        <div className="mb-4 p-4 bg-white rounded-lg border border-gray-200">
          <div className="flex items-center space-x-3">
            <Switch
              id="friend-recommended"
              checked={friendRecommendedOnly}
              onCheckedChange={setFriendRecommendedOnly}
            />
            <Label htmlFor="friend-recommended" className="text-sm font-medium">
              Friend-Recommended Only
            </Label>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Show only sitters recommended by people you follow.
          </p>
        </div>

        {/* Original Hyper-Local Component - Only show when no filters are active */}
        {!searchTerm && !friendRecommendedOnly && localSearchScope === "ANY" && userLocations.length > 0 && (
          <HyperLocalSitters 
            currentUserId={mockCurrentUserId}
            selectedLocationId={userLocations[0]?.id}
            locationNickname={userLocations[0]?.location_nickname}
            searchScope="BUILDING"
          />
        )}

        {/* Results Section */}
        <SearchResultsGrid 
          displayedSitters={displayedSitters}
          searchTerm={searchTerm}
          friendRecommendedOnly={friendRecommendedOnly}
          localSearchScope={localSearchScope}
          selectedUserHomeDetails={selectedUserHomeDetails}
          localSittersLoading={localSittersLoading}
          shouldFetchLocalSitters={shouldFetchLocalSitters}
        />
      </div>
      
      <BottomNavigation />
    </div>
  );
};

export default Search;
