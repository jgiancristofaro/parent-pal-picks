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
import { FeaturedRecommendations } from "@/components/home/FeaturedRecommendations";

const Home = () => {
  // Mock current user data
  const mockCurrentUser = {
    id: "user-2",
    firstName: "Sophia",
    fullName: "Sophia Carter",
    profileImageUrl: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
  };
  
  // Real notification system
  const { 
    notificationMessage, 
    hasNewActivity, 
    markActivityFeedAsViewed 
  } = useActivityNotifications(mockCurrentUser.id);
  
  // Local state for notification banner visibility
  const [showNotification, setShowNotification] = useState(false);
  
  // Mock data for demonstration
  const featuredProducts = [{
    id: "1",
    name: "Top-rated Baby Monitors",
    image: "/assets/babymonitor.jpg",
    category: "Baby Safety"
  }, {
    id: "2",
    name: "Essential Baby Carriers",
    image: "/assets/babycarrier.jpg",
    category: "Carrying"
  }, {
    id: "3",
    name: "Organic Baby Food",
    image: "/assets/organicbabyfood.jpg",
    category: "Nutrition"
  }, {
    id: "4",
    name: "Soft Baby Blankets",
    image: "/assets/softbabyblankets.jpg",
    category: "Comfort"
  }];
  
  // Mock newly recommended sitters data
  const newlyRecommendedSitters = [
    {
      id: "sitter-new-1",
      name: "Emma Wilson",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=2487&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      rating: 4.8,
      experience: "3 years experience",
      recommendedBy: "Sarah Chen",
      recommendationDate: "2024-01-20T10:00:00Z"
    },
    {
      id: "sitter-new-2",
      name: "Alex Rodriguez",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=2487&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      rating: 4.9,
      experience: "6 years experience",
      recommendedBy: "Mike Johnson",
      recommendationDate: "2024-01-19T15:30:00Z"
    },
    {
      id: "sitter-new-3",
      name: "Jessica Taylor",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=2487&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      rating: 4.7,
      experience: "4 years experience",
      recommendedBy: "Lisa Wang",
      recommendationDate: "2024-01-18T09:15:00Z"
    },
    {
      id: "sitter-new-4",
      name: "David Kim",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=2487&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      rating: 4.6,
      experience: "2 years experience",
      recommendedBy: "Emma Davis",
      recommendationDate: "2024-01-17T14:20:00Z"
    }
  ].sort((a, b) => new Date(b.recommendationDate).getTime() - new Date(a.recommendationDate).getTime());

  // Mock newly recommended products data
  const newlyRecommendedProducts = [
    {
      id: "product-new-1",
      name: "Smart Baby Monitor Pro",
      image: "/assets/babymonitor.jpg",
      category: "Baby Safety",
      recommendedBy: "Jennifer Lopez",
      recommendationDate: "2024-01-20T08:00:00Z"
    },
    {
      id: "product-new-2",
      name: "Ergonomic Baby Carrier",
      image: "/assets/babycarrier.jpg",
      category: "Carrying",
      recommendedBy: "Mark Thompson",
      recommendationDate: "2024-01-19T12:45:00Z"
    },
    {
      id: "product-new-3",
      name: "Organic Baby Formula",
      image: "/assets/organicbabyfood.jpg",
      category: "Nutrition",
      recommendedBy: "Anna Martinez",
      recommendationDate: "2024-01-18T16:30:00Z"
    },
    {
      id: "product-new-4",
      name: "Ultra Soft Baby Blanket",
      image: "/assets/softbabyblankets.jpg",
      category: "Comfort",
      recommendedBy: "Tom Wilson",
      recommendationDate: "2024-01-17T11:10:00Z"
    }
  ].sort((a, b) => new Date(b.recommendationDate).getTime() - new Date(a.recommendationDate).getTime());
  
  // Mock friends activity with enhanced data structure
  const friendActivity = [{
    userId: "101",
    userName: "Olivia Bennett",
    userImage: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=2487&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    action: "Recommended a sitter",
    timeAgo: "2d",
    itemType: "sitter" as const,
    itemId: "sitter-123"
  }, {
    userId: "102",
    userName: "Ethan Chen",
    userImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=2487&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    action: "Booked a sitter",
    timeAgo: "3d",
    itemType: "sitter" as const,
    itemId: "sitter-456"
  }, {
    userId: "103",
    userName: "Sarah Williams",
    userImage: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=2487&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    action: "Recommended baby bottles",
    timeAgo: "4d",
    itemType: "product" as const,
    itemId: "product-789"
  }];

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

  return (
    <div className="min-h-screen pb-20 bg-gray-50">
      <Header 
        showUserProfileImage={true}
        userProfileImageUrl={mockCurrentUser.profileImageUrl}
        userFullName={mockCurrentUser.firstName}
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
      
      <HeroSection userName={mockCurrentUser.firstName} />
      <ActionButtons />
      <FriendsActivity friendActivity={friendActivity} />
      <NewRecommendedSitters newlyRecommendedSitters={newlyRecommendedSitters} />
      <NewRecommendedProducts newlyRecommendedProducts={newlyRecommendedProducts} />
      <FeaturedRecommendations featuredProducts={featuredProducts} />

      <BottomNavigation />
    </div>
  );
};

export default Home;
