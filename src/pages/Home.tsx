
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
  const { user, profile } = useAuth();
  
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

  const userName = profile?.full_name?.split(' ')[0] || 'User';

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
