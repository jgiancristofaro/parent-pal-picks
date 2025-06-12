
import { useQueryClient } from "@tanstack/react-query";
import { FollowButton } from "@/components/FollowButton";
import { useAdmin } from "@/hooks/useAdmin";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Settings, Ban, Edit } from "lucide-react";
import { useNavigate } from "react-router-dom";

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
  const navigate = useNavigate();

  const handleFollowStatusChange = () => {
    if (profileData.id) {
      queryClient.invalidateQueries({ queryKey: ['profile', profileData.id] });
    }
  };

  const AdminActions = () => {
    if (!isAdmin || isOwnProfile || !profileData.id) return null;

    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="mt-4">
            <Settings className="w-4 h-4 mr-2" />
            Admin Actions
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onClick={() => navigate(`/admin/users/${profileData.id}/edit`)}>
            <Edit className="w-4 h-4 mr-2" />
            Edit User
          </DropdownMenuItem>
          <DropdownMenuItem className="text-red-600">
            <Ban className="w-4 h-4 mr-2" />
            Suspend User
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
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
        
        {isOwnProfile ? (
          <a 
            href="/profile/edit"
            className="mt-4 px-6 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
          >
            Edit Profile
          </a>
        ) : (
          <div className="mt-4 flex flex-col items-center gap-2">
            {/* Show admin actions if admin, otherwise show follow button */}
            {isAdmin ? (
              <AdminActions />
            ) : (
              profileData.id && profileData.follow_status && profileData.follow_status !== 'own_profile' && (
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
              )
            )}
          </div>
        )}
      </div>
    </div>
  );
};
