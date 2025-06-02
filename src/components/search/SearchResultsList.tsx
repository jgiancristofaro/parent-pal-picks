
import { ParentSearchResultCard } from "@/components/search/ParentSearchResultCard";

interface ProfileWithFollowStatus {
  id: string;
  full_name: string;
  username: string | null;
  avatar_url: string | null;
  profile_privacy_setting: string;
  follow_status: 'following' | 'request_pending' | 'not_following';
}

interface SearchResultsListProps {
  searchResults: ProfileWithFollowStatus[];
  searchTerm: string;
  phoneNumber: string;
  isSearching: boolean;
  onFollowStatusChange: () => void;
}

export const SearchResultsList = ({
  searchResults,
  searchTerm,
  phoneNumber,
  isSearching,
  onFollowStatusChange
}: SearchResultsListProps) => {
  if (searchResults.length > 0) {
    return (
      <div className="space-y-3">
        <h3 className="text-lg font-semibold">Search Results</h3>
        {searchResults.map((profile) => (
          <ParentSearchResultCard 
            key={profile.id} 
            profile={profile} 
            onFollowStatusChange={onFollowStatusChange}
          />
        ))}
      </div>
    );
  }

  if (searchResults.length === 0 && (searchTerm || phoneNumber) && !isSearching) {
    return (
      <div className="text-center py-8 text-gray-500">
        No users found. Try a different search term.
      </div>
    );
  }

  return null;
};
