
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

interface FriendReview {
  review_id: string;
  reviewer_id: string;
  reviewer_full_name: string;
  reviewer_avatar_url: string | null;
  rating: number;
  title: string;
  content: string;
  created_at: string;
  has_verified_experience: boolean;
}

export const useFriendReviews = (itemType: 'product' | 'sitter', itemId: string | undefined) => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['friend-reviews', user?.id, itemType, itemId],
    queryFn: async () => {
      if (!user?.id || !itemId) return [];

      console.log('Fetching friend reviews for:', itemType, itemId);

      const { data, error } = await supabase
        .rpc('get_friend_reviews', {
          p_user_id: user.id,
          p_item_type: itemType,
          p_item_id: itemId
        });

      if (error) {
        console.error('Error fetching friend reviews:', error);
        throw error;
      }

      console.log('Friend reviews found:', data?.length || 0);
      return (data || []) as FriendReview[];
    },
    enabled: !!user?.id && !!itemId,
  });
};
