
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

      const { data, error } = await supabase
        .rpc('get_friends_activity_feed', {
          p_current_user_id: currentUserId,
          p_limit: limit,
          p_offset: 0
        });

      if (error) {
        console.error('Error fetching friends activity feed:', error);
        throw error;
      }

      console.log('Friends activity feed found:', data?.length || 0);
      // Debug logging to check actor_id values
      data?.forEach((activity: FriendsActivityItem, index: number) => {
        console.log(`Activity ${index}:`, {
          activity_id: activity.activity_id,
          actor_id: activity.actor_id,
          actor_name: activity.actor_full_name,
          current_user_id: currentUserId,
          is_same_as_current: activity.actor_id === currentUserId
        });
      });
      
      return (data || []) as FriendsActivityItem[];
    },
    enabled: enabled && !!currentUserId,
  });
};
