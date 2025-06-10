
import { SearchFilters } from "@/components/search/SearchFilters";
import { HyperLocalSitters } from "@/components/search/HyperLocalSitters";
import { SearchResultsGrid } from "@/components/search/SearchResultsGrid";
import { SitterSearchResultCard } from "@/components/review/SitterSearchResultCard";
import { NoResultsMessage } from "./NoResultsMessage";

interface SitterSearchContentProps {
  mode: 'discovery' | 'review';
  currentUserId: string;
  sitterSearchTerm: string;
  setSitterSearchTerm: (term: string) => void;
  sitterFriendRecommendedOnly: boolean;
  setSitterFriendRecommendedOnly: (value: boolean) => void;
  userLocations: any[];
  selectedUserHomeId: string | null;
  setSelectedUserHomeId: (id: string | null) => void;
  selectedUserHomeDetails: any;
  localSearchScope: string;
  setLocalSearchScope: (scope: string) => void;
  displayedSitters: any[];
  localSittersLoading: boolean;
  shouldFetchLocalSitters: boolean;
  handleSelectForReview: (item: any) => void;
  handleCreateNewForReview: () => void;
}

export const SitterSearchContent = ({
  mode,
  currentUserId,
  sitterSearchTerm,
  setSitterSearchTerm,
  sitterFriendRecommendedOnly,
  setSitterFriendRecommendedOnly,
  userLocations,
  selectedUserHomeId,
  setSelectedUserHomeId,
  selectedUserHomeDetails,
  localSearchScope,
  setLocalSearchScope,
  displayedSitters,
  localSittersLoading,
  shouldFetchLocalSitters,
  handleSelectForReview,
  handleCreateNewForReview,
}: SitterSearchContentProps) => {
  return (
    <div className="p-4">
      {/* Search Filters */}
      <SearchFilters
        searchTerm={sitterSearchTerm}
        onSearchTermChange={setSitterSearchTerm}
        friendRecommendedOnly={sitterFriendRecommendedOnly}
        onFriendRecommendedOnlyChange={setSitterFriendRecommendedOnly}
        userLocations={userLocations}
        selectedUserHomeId={selectedUserHomeId}
        onSelectedUserHomeIdChange={setSelectedUserHomeId}
        selectedUserHomeDetails={selectedUserHomeDetails}
        localSearchScope={localSearchScope}
        onLocalSearchScopeChange={setLocalSearchScope}
      />

      {/* Original Hyper-Local Component - Only show in discovery mode when no filters are active */}
      {mode === 'discovery' && !sitterSearchTerm && !sitterFriendRecommendedOnly && localSearchScope === "ANY" && userLocations.length > 0 && (
        <HyperLocalSitters 
          currentUserId={currentUserId}
          selectedLocationId={userLocations[0]?.id}
          locationNickname={userLocations[0]?.location_nickname}
          searchScope="BUILDING"
        />
      )}

      {/* Results Section */}
      {displayedSitters.length > 0 ? (
        mode === 'review' ? (
          <div className="space-y-3">
            {displayedSitters.map((sitter) => (
              <SitterSearchResultCard
                key={sitter.id}
                sitter={sitter}
                onSelectSitter={() => handleSelectForReview(sitter)}
              />
            ))}
          </div>
        ) : (
          <SearchResultsGrid 
            displayedSitters={displayedSitters}
            searchTerm={sitterSearchTerm}
            friendRecommendedOnly={sitterFriendRecommendedOnly}
            localSearchScope={localSearchScope}
            selectedUserHomeDetails={selectedUserHomeDetails}
            localSittersLoading={localSittersLoading}
            shouldFetchLocalSitters={shouldFetchLocalSitters}
          />
        )
      ) : (
        <NoResultsMessage 
          type="sitter" 
          mode={mode} 
          onCreateNew={handleCreateNewForReview} 
        />
      )}
    </div>
  );
};
