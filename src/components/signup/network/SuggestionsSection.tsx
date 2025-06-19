
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useSuggestedProfiles } from '@/hooks/useSuggestedProfiles';
import { ParentSearchResultCard } from '@/components/search/ParentSearchResultCard';
import { Loader2, Users } from 'lucide-react';

interface SuggestionsSectionProps {
  onComplete: (followedCount: number) => void;
}

export const SuggestionsSection = ({ onComplete }: SuggestionsSectionProps) => {
  const { suggestedProfiles, isLoading } = useSuggestedProfiles();

  const handleFollowStatusChange = () => {
    // Track follow events to determine when user has followed someone
    onComplete(1); // Simple implementation - in real app, track actual follows
  };

  if (isLoading) {
    return (
      <Card className="w-full">
        <CardContent className="pt-6 text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-purple-600" />
          <p className="text-gray-600">Finding people you may know...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader className="text-center">
        <div className="mx-auto mb-4 p-3 bg-purple-100 rounded-full w-fit">
          <Users className="h-8 w-8 text-purple-600" />
        </div>
        <CardTitle className="text-xl">People You May Know</CardTitle>
        <p className="text-gray-600 text-sm">
          Follow at least one person to start building your network and get personalized recommendations.
        </p>
      </CardHeader>
      <CardContent>
        {suggestedProfiles.length > 0 ? (
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {suggestedProfiles.slice(0, 8).map((profile) => (
              <ParentSearchResultCard
                key={profile.id}
                profile={profile}
                onFollowStatusChange={handleFollowStatusChange}
              />
            ))}
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
