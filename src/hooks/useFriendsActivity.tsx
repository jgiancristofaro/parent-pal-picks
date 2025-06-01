
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

export const useFriendsActivity = (
  currentUserId: string | undefined,
  limit: number = 10,
  enabled: boolean = true
) => {
  return useQuery({
    queryKey: ['friends-activity', currentUserId, limit],
    queryFn: async () => {
      if (!currentUserId) return [];

      console.log('Fetching friends activity for user:', currentUserId);

      // Mock data for fallback
      const mockActivity: FriendsActivityItem[] = [
        {
          activity_id: "review-1",
          activity_type: "sitter_review",
          actor_id: "user-friend-1",
          actor_full_name: "Olivia Bennett",
          actor_avatar_url: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=100&auto=format&fit=crop",
          activity_timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          item_id: "sitter-123",
          item_name: "Sarah Johnson",
          item_image_url: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=100&auto=format&fit=crop",
          item_category: null,
          review_rating: 5,
          review_title: "Excellent babysitter"
        },
        {
          activity_id: "review-2",
          activity_type: "product_review", 
          actor_id: "user-friend-2",
          actor_full_name: "Ethan Chen",
          actor_avatar_url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=100&auto=format&fit=crop",
          activity_timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
          item_id: "product-456",
          item_name: "Baby Monitor Pro",
          item_image_url: "/assets/babymonitor.jpg",
          item_category: "Baby Tech",
          review_rating: 4,
          review_title: "Great product"
        },
        {
          activity_id: "review-3",
          activity_type: "product_review",
          actor_id: "user-friend-3", 
          actor_full_name: "Sarah Williams",
          actor_avatar_url: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=100&auto=format&fit=crop",
          activity_timestamp: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
          item_id: "product-789",
          item_name: "Organic Baby Bottles",
          item_image_url: "/assets/organicbabyfood.jpg",
          item_category: "Baby Food",
          review_rating: 5,
          review_title: "Perfect for my baby"
        }
      ];

      try {
        // Try to get real data from the new Supabase function
        const { data, error } = await supabase
          .rpc('get_friends_activity_feed', {
            p_current_user_id: currentUserId,
            p_limit: limit,
            p_offset: 0
          });

        if (error) {
          console.error('Database error, using mock data:', error);
          return mockActivity.slice(0, limit);
        }

        // If we get real data, use it, otherwise fall back to mock data
        if (data && data.length > 0) {
          console.log('Real friends activity found:', data.length);
          return data as FriendsActivityItem[];
        } else {
          console.log('No real data found, using mock activity');
          return mockActivity.slice(0, limit);
        }
      } catch (error) {
        console.error('Error fetching friends activity, using mock data:', error);
        return mockActivity.slice(0, limit);
      }
    },
    enabled: enabled && !!currentUserId,
  });
};
