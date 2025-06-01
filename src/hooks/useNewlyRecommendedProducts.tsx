
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface NewlyRecommendedProduct {
  product_id: string;
  product_name: string;
  product_image_url: string | null;
  product_category: string | null;
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

      // Get products recommended by followed users (reviews with rating >= 4)
      const { data, error } = await supabase
        .from('reviews')
        .select(`
          product_id,
          user_id,
          created_at,
          products!inner(
            name,
            image_url,
            category
          ),
          profiles!inner(
            full_name,
            avatar_url
          )
        `)
        .not('product_id', 'is', null)
        .gte('rating', 4)
        .in('user_id', 
          // Subquery to get followed users
          supabase
            .from('user_follows')
            .select('following_id')
            .eq('follower_id', currentUserId)
        )
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) {
        console.error('Error fetching newly recommended products:', error);
        throw error;
      }

      const transformedData = (data || []).map(item => ({
        product_id: item.product_id!,
        product_name: item.products.name,
        product_image_url: item.products.image_url,
        product_category: item.products.category,
        recommender_user_id: item.user_id,
        recommender_full_name: item.profiles.full_name,
        recommender_avatar_url: item.profiles.avatar_url,
        recommendation_timestamp: item.created_at
      })) as NewlyRecommendedProduct[];

      console.log('Newly recommended products found:', transformedData.length);
      return transformedData;
    },
    enabled: enabled && !!currentUserId,
  });
};
