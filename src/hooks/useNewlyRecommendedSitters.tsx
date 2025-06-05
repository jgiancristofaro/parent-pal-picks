
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface NewlyRecommendedSitter {
  sitter_id: string;
  sitter_name: string;
  sitter_profile_image_url: string | null;
  sitter_rating: number | null;
  recommender_user_id: string;
  recommender_full_name: string;
  recommender_avatar_url: string | null;
  recommendation_timestamp: string;
}

export const useNewlyRecommendedSitters = (
  currentUserId: string | undefined,
  limit: number = 10,
  enabled: boolean = true
) => {
  return useQuery({
    queryKey: ['newly-recommended-sitters', currentUserId, limit],
    queryFn: async () => {
      if (!currentUserId) return [];

      console.log('Fetching newly recommended sitters for user:', currentUserId);

      const { data, error } = await supabase
        .rpc('get_newly_recommended_sitters_from_followed_users', {
          p_current_user_id: currentUserId,
          p_limit: limit,
          p_offset: 0
        });

      if (error) {
        console.error('Error fetching newly recommended sitters:', error);
        throw error;
      }

      console.log('Newly recommended sitters found:', data?.length || 0);
      return (data || []) as NewlyRecommendedSitter[];
    },
    enabled: enabled && !!currentUserId,
  });
};
