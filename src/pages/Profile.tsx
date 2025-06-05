
import { Header } from "@/components/Header";
import { BottomNavigation } from "@/components/BottomNavigation";
import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { ProfileStats } from "@/components/profile/ProfileStats";
import { RecommendationsTabs } from "@/components/profile/RecommendationsTabs";
import { useProfile } from "@/hooks/useProfile";
import { useProfileFollowers } from "@/hooks/useProfileFollowers";
import { useProfileFollowing } from "@/hooks/useProfileFollowing";
import { useUserRecommendations } from "@/hooks/useUserRecommendations";
import { useMockProfile, useMockProfileFollowers, useMockProfileFollowing, useMockUserRecommendations } from "@/hooks/useMockProfile";
import { Skeleton } from "@/components/ui/skeleton";
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";

const Profile = () => {
  const { userId } = useParams();
  const isMockProfile = userId === 'mock-user-1';
  
  // Use mock data for the mock profile, real data otherwise
  const { profile: currentUserProfile, isLoading: currentUserLoading } = useProfile();
  const { data: mockProfile, isLoading: mockProfileLoading } = useMockProfile();
  
  const [isOwnProfile, setIsOwnProfile] = useState(false);
  
  const profile = isMockProfile ? mockProfile : currentUserProfile;
  const isLoading = isMockProfile ? mockProfileLoading : currentUserLoading;
  
  // Use appropriate hooks based on profile type
  const { data: realFollowers = [], isLoading: realFollowersLoading } = useProfileFollowers(
    !isMockProfile ? profile?.id : undefined
  );
  const { data: realFollowing = [], isLoading: realFollowingLoading } = useProfileFollowing(
    !isMockProfile ? profile?.id : undefined
  );
  const { data: realSitterRecommendations = [] } = useUserRecommendations(
    !isMockProfile ? profile?.id : undefined, 
    'sitter'
  );
  const { data: realProductRecommendations = [] } = useUserRecommendations(
    !isMockProfile ? profile?.id : undefined, 
    'product'
  );
  
  // Mock data hooks
  const { data: mockFollowers = [] } = useMockProfileFollowers();
  const { data: mockFollowing = [] } = useMockProfileFollowing();
  const { data: mockSitterRecommendations = [] } = useMockUserRecommendations('sitter');
  const { data: mockProductRecommendations = [] } = useMockUserRecommendations('product');
  
  // Select the appropriate data based on profile type
  const followers = isMockProfile ? mockFollowers : realFollowers;
  const following = isMockProfile ? mockFollowing : realFollowing;
  const sitterRecommendations = isMockProfile ? mockSitterRecommendations : realSitterRecommendations;
  const productRecommendations = isMockProfile ? mockProductRecommendations : realProductRecommendations;
  const followersLoading = isMockProfile ? false : realFollowersLoading;
  const followingLoading = isMockProfile ? false : realFollowingLoading;

  useEffect(() => {
    // Check if this is the user's own profile
    if (profile && (!userId || userId === profile.id)) {
      setIsOwnProfile(true);
    } else {
      setIsOwnProfile(false);
    }
  }, [profile, userId]);

  if (isLoading || followersLoading || followingLoading) {
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
    name: profile.full_name || "User",
    role: profile.identity_tag || "Parent",
    joinedYear: new Date(profile.created_at).getFullYear(),
    profileImage: profile.avatar_url || "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=2487&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    bio: profile.bio,
    username: profile.username
  };

  return (
    <div className="min-h-screen pb-20 bg-gray-50">
      <Header title="Profile" showBack={true} />
      
      <ProfileHeader profileData={profileData} isOwnProfile={isOwnProfile && !isMockProfile} />
      <ProfileStats 
        followers={followers.length} 
        following={following.length}
        followersData={followers}
        followingData={following}
      />
      <RecommendationsTabs 
        sitterRecommendations={sitterRecommendations}
        productRecommendations={productRecommendations}
      />
      
      <BottomNavigation />
    </div>
  );
};

export default Profile;
