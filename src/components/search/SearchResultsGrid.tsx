
import { SitterCard } from "@/components/SitterCard";

interface Sitter {
  id: string;
  name: string;
  image: string;
  rating: number;
  experience?: string;
  recommendedBy?: string;
  friendRecommendationCount: number;
  workedInUserLocationNickname?: string;
}

interface UserLocationDetails {
  location_nickname: string;
  building_identifier: string | null;
  zip_code: string;
}

interface SearchResultsGridProps {
  displayedSitters: Sitter[];
  searchTerm: string;
  friendRecommendedOnly: boolean;
  localSearchScope: string;
  selectedUserHomeDetails: UserLocationDetails | undefined;
  localSittersLoading: boolean;
  shouldFetchLocalSitters: boolean;
}

export const SearchResultsGrid = ({
  displayedSitters,
  searchTerm,
  friendRecommendedOnly,
  localSearchScope,
  selectedUserHomeDetails,
  localSittersLoading,
  shouldFetchLocalSitters
}: SearchResultsGridProps) => {
  const getResultsTitle = () => {
    if (searchTerm) return `Search Results (${displayedSitters.length} found)`;
    if (friendRecommendedOnly) return 'Friend-Recommended Sitters';
    if (localSearchScope === "BUILDING" && selectedUserHomeDetails) {
      return `Sitters from ${selectedUserHomeDetails.building_identifier} (${displayedSitters.length} found)`;
    }
    if (localSearchScope === "AREA_ZIP" && selectedUserHomeDetails) {
      return `Sitters from ${selectedUserHomeDetails.zip_code} area (${displayedSitters.length} found)`;
    }
    return `All Sitters (${displayedSitters.length} found)`;
  };

  const getLocalRecommendationType = () => {
    if (localSearchScope === "BUILDING") return 'BUILDING' as const;
    if (localSearchScope === "AREA_ZIP") return 'AREA_ZIP' as const;
    return null;
  };

  const getLocationContextName = () => {
    if (localSearchScope === "BUILDING") return selectedUserHomeDetails?.building_identifier || null;
    if (localSearchScope === "AREA_ZIP") return selectedUserHomeDetails?.zip_code || null;
    return null;
  };

  if (localSittersLoading) {
    return (
      <div className="mt-6">
        <h2 className="text-xl font-semibold mb-4">{getResultsTitle()}</h2>
        <div className="text-center py-8">
          <p className="text-gray-500">Loading sitters...</p>
        </div>
      </div>
    );
  }

  if (displayedSitters.length === 0) {
    return (
      <div className="mt-6">
        <h2 className="text-xl font-semibold mb-4">{getResultsTitle()}</h2>
        <div className="text-center py-8">
          {searchTerm && (
            <>
              <p className="text-gray-500">No sitters found matching "{searchTerm}"</p>
              <p className="text-gray-400 text-sm mt-2">Try searching with a different name.</p>
            </>
          )}
          {!searchTerm && friendRecommendedOnly && (
            <>
              <p className="text-gray-500">No friend-recommended sitters found.</p>
              <p className="text-gray-400 text-sm mt-2">Try following more friends or search without the filter.</p>
            </>
          )}
          {!searchTerm && !friendRecommendedOnly && shouldFetchLocalSitters && (
            <>
              <p className="text-gray-500">No local sitters found yet.</p>
              <p className="text-gray-400 text-sm mt-2">Try searching anywhere or check back later.</p>
            </>
          )}
          {!searchTerm && !friendRecommendedOnly && !shouldFetchLocalSitters && (
            <>
              <p className="text-gray-500">No sitters found.</p>
              <p className="text-gray-400 text-sm mt-2">Check back later for new sitter profiles.</p>
            </>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="mt-6">
      <h2 className="text-xl font-semibold mb-4">{getResultsTitle()}</h2>
      <div className="grid grid-cols-2 gap-4">
        {displayedSitters.map((sitter) => (
          <SitterCard
            key={sitter.id}
            id={sitter.id}
            name={sitter.name}
            image={sitter.image}
            rating={sitter.rating}
            experience={sitter.experience}
            friendRecommendationCount={sitter.friendRecommendationCount}
            workedInUserLocationNickname={sitter.workedInUserLocationNickname}
            localRecommendationType={getLocalRecommendationType()}
            locationContextName={getLocationContextName()}
          />
        ))}
      </div>
    </div>
  );
};
