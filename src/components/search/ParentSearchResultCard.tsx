
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { FollowButton } from "@/components/FollowButton";

interface Profile {
  id: string;
  full_name: string;
  username: string | null;
  avatar_url: string | null;
  profile_privacy_setting: string;
  follow_status: 'following' | 'request_pending' | 'not_following';
}

interface ParentSearchResultCardProps {
  profile: Profile;
  onFollowStatusChange?: () => void;
}

export const ParentSearchResultCard = ({ profile, onFollowStatusChange }: ParentSearchResultCardProps) => {
  return (
    <Card className="w-full">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Avatar className="h-12 w-12">
              <AvatarImage src={profile.avatar_url || undefined} />
              <AvatarFallback>
                {profile.full_name.split(' ').map(n => n[0]).join('').toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-semibold text-gray-900">{profile.full_name}</h3>
              {profile.username && (
                <p className="text-sm text-gray-500">@{profile.username}</p>
              )}
              <p className="text-xs text-gray-400 capitalize">
                {profile.profile_privacy_setting} profile
              </p>
            </div>
          </div>
          
          <FollowButton
            targetProfile={profile}
            onStatusChange={onFollowStatusChange}
            size="sm"
            variant="default"
          />
        </div>
      </CardContent>
    </Card>
  );
};
