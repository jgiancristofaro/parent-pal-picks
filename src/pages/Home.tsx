
import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { BottomNavigation } from "@/components/BottomNavigation";
import { useActivityNotifications } from "@/hooks/useActivityNotifications";
import { NotificationBanner } from "@/components/home/NotificationBanner";
import { HeroSection } from "@/components/home/HeroSection";
import { ActionButtons } from "@/components/home/ActionButtons";
import { FriendsActivity } from "@/components/home/FriendsActivity";
import { NewRecommendedSitters } from "@/components/home/NewRecommendedSitters";
import { NewRecommendedProducts } from "@/components/home/NewRecommendedProducts";
import { TopCommunityPicks } from "@/components/home/TopCommunityPicks";
import { useAuth } from "@/contexts/AuthContext";

const Home = () => {
  const { user, profile, isLoading: authLoading } = useAuth();
  
  // Real notification system
  const { 
    notificationMessage, 
    hasNewActivity, 
    markActivityFeedAsViewed 
  } = useActivityNotifications(user?.id);
  
  // Local state for notification banner visibility
  const [showNotification, setShowNotification] = useState(false);

  // Show notification banner when there's new activity
  useEffect(() => {
    if (hasNewActivity && notificationMessage) {
      setShowNotification(true);
    }
  }, [hasNewActivity, notificationMessage]);

  const dismissNotification = () => {
    setShowNotification(false);
  };

  const handleActivityFeedClick = async () => {
    // Mark activity feed as viewed when user clicks the notification
    await markActivityFeedAsViewed();
    setShowNotification(false);
  };

  // Get user name from profile or fallback to User
  const userName = profile?.full_name?.split(' ')[0] || 
                   profile?.first_name || 
                   user?.user_metadata?.first_name || 
                   'User';

  console.log('Home: Rendering with auth state:', { 
    authLoading, 
    hasProfile: !!profile, 
    profileName: profile?.full_name,
    userName,
    userId: user?.id 
  });

  // Show loading state while auth is still loading
  if (authLoading) {
    return (
      <div className="min-h-screen pb-20 bg-gray-50">
        <Header 
          showUserProfileImage={false}
          userProfileImageUrl={profile?.avatar_url}
          userFullName="Loading..."
          showBack={false}
          showSettings={true}
          showLogo={true}
          logoUrl="/assets/logo.png"
        />
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading your home...</p>
          </div>
        </div>
        <BottomNavigation />
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-20 bg-gray-50">
      <Header 
        showUserProfileImage={false}
        userProfileImageUrl={profile?.avatar_url}
        userFullName={userName}
        showBack={false}
        showSettings={true}
        showLogo={true}
        logoUrl="/assets/logo.png"
      />
      
      {/* Conditional Notification Banner - Only shows when there's real new activity */}
      {notificationMessage && showNotification && hasNewActivity && (
        <NotificationBanner
          notificationMessage={notificationMessage}
          onDismiss={dismissNotification}
          onActivityFeedClick={handleActivityFeedClick}
        />
      )}
      
      <HeroSection userName={userName} />
      <ActionButtons />
      <FriendsActivity currentUserId={user?.id} />
      <NewRecommendedSitters currentUserId={user?.id} />
      <NewRecommendedProducts currentUserId={user?.id} />
      <TopCommunityPicks />

      <BottomNavigation />
    </div>
  );
};

export default Home;
