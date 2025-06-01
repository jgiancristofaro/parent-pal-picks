
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
        return (data || []) as FriendsActivityItem[];
      } catch (error) {
        console.error('Error fetching friends activity feed:', error);
        throw error;
      }
    },
    enabled: enabled && !!currentUserId,
  });
};
