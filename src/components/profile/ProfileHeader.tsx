
import { useQueryClient } from "@tanstack/react-query";
import { FollowButton } from "@/components/FollowButton";
import { AdminActions } from "@/components/admin/AdminActions";
import { useAdmin } from "@/hooks/useAdmin";

interface ProfileHeaderProps {
  profileData: {
    id?: string;
    name: string;
    role: string;
    joinedYear: number;
    profileImage: string;
    bio?: string;
    username?: string;
    profile_privacy_setting?: string;
    follow_status?: 'following' | 'request_pending' | 'not_following' | 'own_profile';
  };
  isOwnProfile?: boolean;
}

export const ProfileHeader = ({ profileData, isOwnProfile = false }: ProfileHeaderProps) => {
  const queryClient = useQueryClient();
  const { isAdmin } = useAdmin();

  const handleFollowStatusChange = () => {
    if (profileData.id) {
      queryClient.invalidateQueries({ queryKey: ['profile', profileData.id] });
    }
  };

  const renderActionButton = () => {
    if (isOwnProfile) {
      return (
        <a 
          href="/profile/edit"
          className="mt-4 px-6 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
        >
          Edit Profile
        </a>
      );
    }

    if (isAdmin && profileData.id) {
      return (
        <div className="mt-4">
          <AdminActions 
            userId={profileData.id}
            userType="user"
          />
        </div>
      );
    }

    if (profileData.id && profileData.follow_status && profileData.follow_status !== 'own_profile') {
      return (
        <div className="mt-4">
          <FollowButton
            targetProfile={{
              id: profileData.id,
              full_name: profileData.name,
              profile_privacy_setting: profileData.profile_privacy_setting || 'private',
              follow_status: profileData.follow_status
            }}
            onStatusChange={handleFollowStatusChange}
            size="default"
            variant="default"
          />
        </div>
      );
    }

    return null;
  };

  return (
    <div className="bg-white pb-6">
      <div className="flex flex-col items-center pt-6 pb-4">
        <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-white shadow-md mb-4">
          <img 
            src={profileData.profileImage} 
            alt={profileData.name} 
            className="w-full h-full object-cover"
          />
        </div>
        <h1 className="text-2xl font-bold">{profileData.name}</h1>
        {profileData.username && (
          <p className="text-gray-500 text-sm">@{profileData.username}</p>
        )}
        <p className="text-purple-500">{profileData.role}</p>
        <p className="text-gray-500 text-sm">Joined {profileData.joinedYear}</p>
        {profileData.bio && (
          <p className="text-gray-600 text-center mt-3 px-6 max-w-md">{profileData.bio}</p>
        )}
        
        {renderActionButton()}
      </div>
    </div>
  );
};
