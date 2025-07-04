
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
  review_rating: number | null;
  review_title: string | null;
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

      const { data, error } = await supabase
        .rpc('get_network_activity', {
          p_user_id: currentUserId,
          p_page_number: 1,
          p_page_size: limit
        });

      if (error) {
        console.error('Error fetching friends activity:', error);
        throw error;
      }

      console.log('Friends activity found:', data?.length || 0);
      return (data || []) as FriendsActivityItem[];
    },
    enabled: enabled && !!currentUserId,
  });
};
