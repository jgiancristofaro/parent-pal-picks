
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ParentSearchResultCard } from "./ParentSearchResultCard";
import { Skeleton } from "@/components/ui/skeleton";
import { SearchX, Users } from "lucide-react";

interface UnifiedSearchResult {
  id: string;
  full_name: string;
  username: string | null;
  avatar_url: string | null;
  profile_privacy_setting: string;
  follow_status: 'following' | 'request_pending' | 'not_following';
  similarity_score: number;
}

interface UnifiedSearchResultsProps {
  searchResults: UnifiedSearchResult[];
  searchTerm: string;
  isSearching: boolean;
  onFollowStatusChange?: () => void;
}

export const UnifiedSearchResults = ({
  searchResults,
  searchTerm,
  isSearching,
  onFollowStatusChange
}: UnifiedSearchResultsProps) => {
  if (isSearching) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <Users size={20} />
            Search Results
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex items-center space-x-3 p-3">
                <Skeleton className="h-12 w-12 rounded-full" />
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-4 w-48" />
                  <Skeleton className="h-3 w-32" />
                </div>
                <Skeleton className="h-9 w-24" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!searchTerm) {
    return null;
  }

  if (searchResults.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <Users size={20} />
            Search Results
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <SearchX size={48} className="mx-auto text-gray-400 mb-4" />
            <p className="text-gray-500 mb-2">No parents found</p>
            <p className="text-sm text-gray-400">
              Try searching with a different name, username, or phone number
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <Users size={20} />
          Search Results ({searchResults.length})
        </CardTitle>
        <p className="text-sm text-gray-600 mt-1">
          Showing results for "{searchTerm}"
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {searchResults.map((profile, index) => (
            <div key={profile.id} className="relative">
              <ParentSearchResultCard
                profile={{
                  id: profile.id,
                  full_name: profile.full_name,
                  username: profile.username,
                  avatar_url: profile.avatar_url,
                  profile_privacy_setting: profile.profile_privacy_setting,
                  follow_status: profile.follow_status
                }}
                onFollowStatusChange={onFollowStatusChange}
              />
              {profile.similarity_score > 0.8 && (
                <div className="absolute top-2 right-2 bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full">
                  Best match
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
