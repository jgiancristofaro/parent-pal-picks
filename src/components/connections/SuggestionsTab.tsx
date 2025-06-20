
import React, { useState } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader2, Search, Users, AlertCircle, Sparkles } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useConnectionSuggestions } from '@/hooks/useConnectionSuggestions';
import { useAdvancedProfileSearch } from '@/hooks/useAdvancedProfileSearch';
import { useDebouncedSearch } from '@/hooks/useDebouncedSearch';
import { ParentSearchResultCard } from '@/components/search/ParentSearchResultCard';
import { Alert, AlertDescription } from '@/components/ui/alert';

export const SuggestionsTab = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [cityFilter, setCityFilter] = useState('');
  const [workplaceFilter, setWorkplaceFilter] = useState('');
  const [showAdvancedSearch, setShowAdvancedSearch] = useState(false);
  
  const debouncedSearchTerm = useDebouncedSearch(searchTerm, 500);
  
  // Use suggestions when no search term, otherwise use advanced search
  const { 
    data: suggestionsData, 
    isLoading: suggestionsLoading, 
    error: suggestionsError 
  } = useConnectionSuggestions(1, 20);
  
  const { 
    data: searchResults, 
    isLoading: searchLoading, 
    error: searchError 
  } = useAdvancedProfileSearch({
    searchTerm: debouncedSearchTerm,
    city: cityFilter,
    workplace: workplaceFilter,
    pageNumber: 1,
    pageSize: 20
  });

  const isSearchActive = debouncedSearchTerm.trim().length > 0;
  const displayData = isSearchActive ? searchResults : suggestionsData;
  const isLoading = isSearchActive ? searchLoading : suggestionsLoading;
  const error = isSearchActive ? searchError : suggestionsError;

  const handleFollowStatusChange = () => {
    // Refresh data when follow status changes
    console.log('Follow status changed, refreshing connection suggestions');
  };

  // Log debugging information
  console.log('SuggestionsTab debug:', {
    user: user?.id,
    isSearchActive,
    displayData: displayData?.length || 0,
    isLoading,
    error: error?.message,
    suggestionsData: suggestionsData?.length || 0,
    searchResults: searchResults?.length || 0
  });

  return (
    <div className="space-y-6">
      {/* Search Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="w-5 h-5" />
            Find People
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="Search by name, username, or phone number..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1"
            />
            <Button
              variant="outline"
              onClick={() => setShowAdvancedSearch(!showAdvancedSearch)}
            >
              Advanced
            </Button>
          </div>
          
          {showAdvancedSearch && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
              <Input
                placeholder="Filter by city..."
                value={cityFilter}
                onChange={(e) => setCityFilter(e.target.value)}
              />
              <Input
                placeholder="Filter by workplace..."
                value={workplaceFilter}
                onChange={(e) => setWorkplaceFilter(e.target.value)}
              />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Results Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {isSearchActive ? (
              <>
                <Search className="w-5 h-5" />
                Search Results
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                Suggested Connections
              </>
            )}
          </CardTitle>
          {!isSearchActive && (
            <p className="text-sm text-gray-600">
              Discover people through mutual connections, community leaders, and your local area
            </p>
          )}
        </CardHeader>
        <CardContent>
          {/* Error handling */}
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                {isSearchActive ? 'Error loading search results' : 'Error loading suggestions'}: {error.message}
              </AlertDescription>
            </Alert>
          )}

          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
              <span className="ml-2 text-gray-600">
                {isSearchActive ? 'Searching...' : 'Finding suggestions...'}
              </span>
            </div>
          ) : displayData && displayData.length > 0 ? (
            <div className="space-y-4">
              {displayData.map((profile) => (
                <div key={profile.user_id} className="relative">
                  <ParentSearchResultCard
                    profile={{
                      id: profile.user_id,
                      full_name: profile.full_name,
                      username: profile.username,
                      avatar_url: profile.avatar_url,
                      profile_privacy_setting: profile.profile_privacy_setting,
                      follow_status: profile.follow_status
                    }}
                    onFollowStatusChange={handleFollowStatusChange}
                  />
                  {!isSearchActive && profile.mutual_connections_count > 0 && (
                    <div className="absolute top-2 right-2 bg-purple-100 text-purple-700 text-xs px-2 py-1 rounded-full font-medium">
                      {profile.mutual_connections_count} mutual connection{profile.mutual_connections_count > 1 ? 's' : ''}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 mb-2">
                {isSearchActive ? 'No results found for your search.' : 'No suggestions available at the moment.'}
              </p>
              <p className="text-gray-500 text-sm">
                {isSearchActive ? 
                  'Try adjusting your search terms.' : 
                  'Connect with more people to get personalized suggestions based on your network.'
                }
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
