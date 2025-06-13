
import { Header } from "@/components/Header";
import { BottomNavigation } from "@/components/BottomNavigation";
import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { ProfileStats } from "@/components/profile/ProfileStats";
import { RecommendationsTabs } from "@/components/profile/RecommendationsTabs";
import { FavoritesTabs } from "@/components/profile/FavoritesTabs";
import { useProfile } from "@/hooks/useProfile";
import { useProfileFollowers } from "@/hooks/useProfileFollowers";
import { useProfileFollowing } from "@/hooks/useProfileFollowing";
import { useUserRecommendations } from "@/hooks/useUserRecommendations";
import { useUserFavorites } from "@/hooks/useUserFavorites";
import { Skeleton } from "@/components/ui/skeleton";
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";

const Profile = () => {
  const { userId } = useParams();
  const { user } = useAuth();
  
  // Use the userId from URL params, or fall back to current user's ID
  const profileUserId = userId || user?.id;
  
  // Pass the profileUserId to useProfile hook
  const { data: profile, isLoading: profileLoading } = useProfile(profileUserId);
  const { data: followers = [], isLoading: followersLoading } = useProfileFollowers(profileUserId);
  const { data: following = [], isLoading: followingLoading } = useProfileFollowing(profileUserId);
  const { data: sitterRecommendations = [] } = useUserRecommendations(profileUserId, 'sitter');
  const { data: productRecommendations = [] } = useUserRecommendations(profileUserId, 'product');
  const { data: favoritesData, isLoading: favoritesLoading } = useUserFavorites(profileUserId);
  
  const [isOwnProfile, setIsOwnProfile] = useState(false);

  useEffect(() => {
    // Check if this is the user's own profile
    if (profile && user && (!userId || userId === user.id)) {
      setIsOwnProfile(true);
    } else {
      setIsOwnProfile(false);
    }
  }, [profile, userId, user]);

  if (profileLoading || followersLoading || followingLoading) {
    return (
      <div className="min-h-screen pb-20 bg-gray-50">
        <Header title="Profile" showBack={true} />
        
        <div className="bg-white pb-6">
          <div className="flex flex-col items-center pt-6 pb-4">
            <Skeleton className="w-28 h-28 rounded-full mb-4" />
            <Skeleton className="h-6 w-32 mb-2" />
            <Skeleton className="h-4 w-24 mb-1" />
            <Skeleton className="h-3 w-20" />
          </div>
        </div>
        
        <div className="flex justify-center pb-4">
          <div className="w-[45%] px-4 py-3 text-center border-r border-gray-200">
            <Skeleton className="h-6 w-8 mx-auto mb-1" />
            <Skeleton className="h-4 w-16 mx-auto" />
          </div>
          <div className="w-[45%] px-4 py-3 text-center">
            <Skeleton className="h-6 w-8 mx-auto mb-1" />
            <Skeleton className="h-4 w-16 mx-auto" />
          </div>
        </div>
        
        <BottomNavigation />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen pb-20 bg-gray-50">
        <Header title="Profile" showBack={true} />
        <div className="flex items-center justify-center h-64">
          <p className="text-gray-500">Profile not found</p>
        </div>
        <BottomNavigation />
      </div>
    );
  }

  const profileData = {
    id: profile.id,
    name: profile.full_name || "User",
    role: profile.identity_tag || "Parent",
    joinedYear: new Date(profile.created_at).getFullYear(),
    profileImage: profile.avatar_url || "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=2487&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    bio: profile.bio,
    username: profile.username,
    profile_privacy_setting: profile.profile_privacy_setting,
    follow_status: profile.follow_status
  };

  return (
    <div className="min-h-screen pb-20 bg-gray-50">
      <Header title="Profile" showBack={true} />
      
      <ProfileHeader profileData={profileData} isOwnProfile={isOwnProfile} />
      
      <ProfileStats 
        followers={followers.length} 
        following={following.length}
        followersData={followers}
        followingData={following}
      />

      {/* My Favorites Section - Only show for own profile */}
      {isOwnProfile && !favoritesLoading && (
        <FavoritesTabs 
          sitterFavorites={favoritesData.sitterFavorites}
          productFavorites={favoritesData.productFavorites}
        />
      )}
      
      <RecommendationsTabs 
        sitterRecommendations={sitterRecommendations}
        productRecommendations={productRecommendations}
      />
      
      <BottomNavigation />
    </div>
  );
};

export default Profile;
