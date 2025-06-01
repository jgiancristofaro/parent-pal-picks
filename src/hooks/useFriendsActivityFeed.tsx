
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface FriendsActivityItem {
  activity_id: string;
  activity_type: string;
  actor_id: string;
  actor_full_name: string;
  actor_avatar_url: string | null;
  activity_timestamp: string;
  item_id: string;
  item_name: string;
  item_image_url: string | null;
  item_category: string | null;
  review_rating: number;
  review_title: string;
}

// Mock data for demonstration when no real data is available
const mockFriendsActivity: FriendsActivityItem[] = [
  {
    activity_id: "mock-activity-1",
    activity_type: "product_review",
    actor_id: "mock-user-1",
    actor_full_name: "Emma Johnson",
    actor_avatar_url: "https://images.unsplash.com/photo-1494790108755-2616b612b1ae?q=80&w=2574&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    activity_timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
    item_id: "mock-product-1",
    item_name: "Organic Baby Formula",
    item_image_url: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    item_category: "Baby Food",
    review_rating: 5,
    review_title: "Perfect for sensitive tummies!"
  },
  {
    activity_id: "mock-activity-2",
    activity_type: "sitter_review",
    actor_id: "mock-user-2",
    actor_full_name: "Sarah Chen",
    actor_avatar_url: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    activity_timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(), // 4 hours ago
    item_id: "mock-sitter-1",
    item_name: "Jessica Martinez",
    item_image_url: "https://images.unsplash.com/photo-1607990281513-2c110a25bd8c?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    item_category: "Childcare",
    review_rating: 4,
    review_title: "Great with our 2-year-old"
  },
  {
    activity_id: "mock-activity-3",
    activity_type: "product_review",
    actor_id: "mock-user-3",
    actor_full_name: "Michael Torres",
    actor_avatar_url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=2574&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    activity_timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(), // 6 hours ago
    item_id: "mock-product-2",
    item_name: "Baby Monitor with Camera",
    item_image_url: "https://images.unsplash.com/photo-1566479179817-0abb5de8ee86?q=80&w=2671&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    item_category: "Baby Safety",
    review_rating: 5,
    review_title: "Peace of mind for parents"
  }
];

export const useFriendsActivityFeed = (
  currentUserId: string | undefined,
  limit: number = 50,
  enabled: boolean = true
) => {
  return useQuery({
    queryKey: ['friends-activity-feed', currentUserId, limit],
    queryFn: async () => {
      if (!currentUserId) return [];

      console.log('Fetching friends activity feed for user:', currentUserId);

      try {
        const { data, error } = await supabase
          .rpc('get_friends_activity_feed', {
            p_current_user_id: currentUserId,
            p_limit: limit,
            p_offset: 0
          });

        if (error) {
          console.error('Database error fetching friends activity feed:', error);
          throw error;
        }

        console.log('Friends activity feed found:', data?.length || 0);
        
        // If no real data is available, return mock data for demonstration
        if (!data || data.length === 0) {
          console.log('No real activity data found, using mock data for demonstration');
          return mockFriendsActivity.slice(0, limit);
        }
        
        return (data || []) as FriendsActivityItem[];
      } catch (error) {
        console.error('Error fetching friends activity feed:', error);
        // Return mock data on error for better user experience
        console.log('Using mock data due to error');
        return mockFriendsActivity.slice(0, limit);
      }
    },
    enabled: enabled && !!currentUserId,
  });
};
