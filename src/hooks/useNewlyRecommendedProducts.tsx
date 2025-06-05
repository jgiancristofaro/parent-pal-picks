
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface NewlyRecommendedProduct {
  product_id: string;
  product_name: string;
  product_image_url: string | null;
  product_category: string | null;
  recommendation_rating: number;
  recommender_user_id: string;
  recommender_full_name: string;
  recommender_avatar_url: string | null;
  recommendation_timestamp: string;
}

export const useNewlyRecommendedProducts = (
  currentUserId: string | undefined,
  limit: number = 10,
  enabled: boolean = true
) => {
  return useQuery({
    queryKey: ['newly-recommended-products', currentUserId, limit],
    queryFn: async () => {
      if (!currentUserId) return [];

      console.log('Fetching newly recommended products for user:', currentUserId);

      const { data, error } = await supabase
        .rpc('get_newly_recommended_products_from_followed_users', {
          p_current_user_id: currentUserId,
          p_limit: limit,
          p_offset: 0
        });

      if (error) {
        console.error('Error fetching newly recommended products:', error);
        throw error;
      }

      console.log('Newly recommended products found:', data?.length || 0);
      return (data || []) as NewlyRecommendedProduct[];
    },
    enabled: enabled && !!currentUserId,
  });
};
