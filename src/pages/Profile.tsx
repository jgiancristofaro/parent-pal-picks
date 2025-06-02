
import { Header } from "@/components/Header";
import { BottomNavigation } from "@/components/BottomNavigation";
import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { ProfileStats } from "@/components/profile/ProfileStats";
import { RecommendationsTabs } from "@/components/profile/RecommendationsTabs";

const Profile = () => {
  // Mock data for demonstration
  const profileData = {
    name: "Sophia Carter",
    role: "Mom",
    joinedYear: 2021,
    profileImage: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=2487&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    followers: 12,
    following: 34
  };

  const recommendedSitters = [
    {
      id: "101",
      name: "Emily Bennett",
      image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=2461&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      rating: 4.9,
      experience: "5 years experience",
      recommendedBy: "3 friends",
      friendRecommendationCount: 3
    },
    {
      id: "102",
      name: "Olivia Harper",
      image: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?q=80&w=2671&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      rating: 4.7,
      experience: "4 years experience",
      recommendedBy: "2 friends",
      friendRecommendationCount: 2
    }
  ];

  return (
    <div className="min-h-screen pb-20 bg-gray-50">
      <Header title="Profile" showBack={true} />
      
      <ProfileHeader profileData={profileData} />
      <ProfileStats followers={profileData.followers} following={profileData.following} />
      <RecommendationsTabs recommendedSitters={recommendedSitters} />
      
      <BottomNavigation />
    </div>
  );
};

export default Profile;
