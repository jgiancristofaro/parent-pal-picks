import React, { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useSuggestedProfiles } from '@/hooks/useSuggestedProfiles';
import { ParentSearchResultCard } from '@/components/search/ParentSearchResultCard';
import { Loader2, Users, AlertCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface SuggestionsSectionProps {
  onComplete: (followedCount: number) => void;
}

const getSuggestionTypeDisplayName = (suggestionType: string): string => {
  switch (suggestionType) {
    case 'global_community_leader':
      return 'Community Leader';
    case 'mutual_connections':
      return 'Mutual Connections';
    case 'location_based':
      return 'Near You';
    case 'similar_interests':
      return 'Similar Interests';
    default:
      return suggestionType.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  }
};

const getSuggestionTypeStyles = (suggestionType: string): string => {
  switch (suggestionType) {
    case 'global_community_leader':
      return 'bg-yellow-100 text-yellow-800 border border-yellow-200';
    default:
      return 'bg-blue-100 text-blue-700';
  }
};

export const SuggestionsSection = ({ onComplete }: SuggestionsSectionProps) => {
  const { suggestedProfiles, isLoading, error } = useSuggestedProfiles();
  const { user, session } = useAuth();

  useEffect(() => {
    console.log('🎯 SuggestionsSection mounted with:', {
      user: user?.id,
      session: !!session,
      profilesCount: suggestedProfiles.length,
      isLoading,
      error: error?.message
    });
  }, [user, session, suggestedProfiles, isLoading, error]);

  const handleFollowStatusChange = () => {
    console.log('👥 Follow status changed');
    onComplete(1);
  };

  if (isLoading) {
    console.log('⏳ Showing loading state');
    return (
      <Card className="w-full">
        <CardContent className="pt-6 text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-purple-600" />
          <p className="text-gray-600">Finding people you may know...</p>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    console.error('❌ Showing error state:', error);
    return (
      <Card>
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 p-3 bg-red-100 rounded-full w-fit">
            <AlertCircle className="h-8 w-8 text-red-600" />
          </div>
          <CardTitle className="text-xl">Error Loading Suggestions</CardTitle>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {error.message || 'Failed to load suggestions'}
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  console.log('📊 Rendering suggestions section with profiles:', suggestedProfiles);

  return (
    <Card>
      <CardHeader className="text-center">
        <div className="mx-auto mb-4 p-3 bg-purple-100 rounded-full w-fit">
          <Users className="h-8 w-8 text-purple-600" />
        </div>
        <CardTitle className="text-xl">People You May Know</CardTitle>
        <p className="text-gray-600 text-sm">
          Follow at least one person to start building your network and get personalized recommendations.
        </p>
        <div className="text-xs text-gray-500 mt-2">
          Found {suggestedProfiles.length} suggestions
        </div>
      </CardHeader>
      <CardContent>
        {suggestedProfiles.length > 0 ? (
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {suggestedProfiles.slice(0, 8).map((profile) => {
              console.log('🎨 Rendering profile card:', profile);
              return (
                <div key={profile.id} className="relative">
                  <ParentSearchResultCard
                    profile={profile}
                    onFollowStatusChange={handleFollowStatusChange}
                  />
                  {profile.suggestion_type && (
                    <div className={`absolute top-2 right-2 text-xs px-2 py-1 rounded-full font-medium ${getSuggestionTypeStyles(profile.suggestion_type)}`}>
                      {getSuggestionTypeDisplayName(profile.suggestion_type)}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-8">
            <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No suggestions available at the moment.</p>
            <p className="text-gray-500 text-sm mt-2">Try again later or explore the app to find people to follow.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
