
import { Header } from "@/components/Header";
import { BottomNavigation } from "@/components/BottomNavigation";
import { HyperLocalSitters } from "@/components/search/HyperLocalSitters";
import { SearchFilters } from "@/components/search/SearchFilters";
import { DemoLinkSection } from "@/components/search/DemoLinkSection";
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
        {/* Demo Link */}
        <DemoLinkSection />

        {/* Search Filters */}
        <SearchFilters
          searchTerm={searchTerm}
          onSearchTermChange={setSearchTerm}
          friendRecommendedOnly={friendRecommendedOnly}
          onFriendRecommendedOnlyChange={setFriendRecommendedOnly}
          userLocations={userLocations}
          selectedUserHomeId={selectedUserHomeId}
          onSelectedUserHomeIdChange={setSelectedUserHomeId}
          selectedUserHomeDetails={selectedUserHomeDetails}
          localSearchScope={localSearchScope}
          onLocalSearchScopeChange={setLocalSearchScope}
        />

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
