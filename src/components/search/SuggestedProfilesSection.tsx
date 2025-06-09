
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ParentSearchResultCard } from "./ParentSearchResultCard";
import { Skeleton } from "@/components/ui/skeleton";
import { Users, Heart } from "lucide-react";
import { useSuggestedProfiles } from "@/hooks/useSuggestedProfiles";

interface SuggestedProfilesSectionProps {
  onFollowStatusChange?: () => void;
}

export const SuggestedProfilesSection = ({ onFollowStatusChange }: SuggestedProfilesSectionProps) => {
  const { suggestedProfiles, isLoading } = useSuggestedProfiles();

  if (isLoading) {
    return (
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <Heart size={20} className="text-purple-500" />
            Suggested for You
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

  if (!suggestedProfiles || suggestedProfiles.length === 0) {
    return (
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <Heart size={20} className="text-purple-500" />
            Suggested for You
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Users size={48} className="mx-auto text-gray-400 mb-4" />
            <p className="text-gray-500 mb-2">No suggestions available yet</p>
            <p className="text-sm text-gray-400">
              Follow some parents first to get personalized suggestions!
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <Heart size={20} className="text-purple-500" />
          Suggested for You
        </CardTitle>
        <p className="text-sm text-gray-600 mt-1">
          Parents suggested based on your network connections
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {suggestedProfiles.map((profile) => (
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
              {profile.mutual_connections_count > 0 && (
                <div className="absolute top-2 right-2 bg-purple-100 text-purple-700 text-xs px-2 py-1 rounded-full">
                  {profile.mutual_connections_count} mutual connection{profile.mutual_connections_count > 1 ? 's' : ''}
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
