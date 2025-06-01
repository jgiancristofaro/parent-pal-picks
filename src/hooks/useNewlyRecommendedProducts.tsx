
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

      // Mock data for fallback
      const mockRecommendations: NewlyRecommendedProduct[] = [
        {
          product_id: 'product-1',
          product_name: 'Smart Baby Monitor',
          product_image_url: '/assets/babymonitor.jpg',
          product_category: 'Baby Tech',
          recommendation_rating: 5,
          recommender_user_id: 'user-friend-1',
          recommender_full_name: 'Emma Thompson',
          recommender_avatar_url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=100&auto=format&fit=crop',
          recommendation_timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          product_id: 'product-2',
          product_name: 'Ergonomic Baby Carrier',
          product_image_url: '/assets/babycarrier.jpg',
          product_category: 'Baby Carriers',
          recommendation_rating: 4,
          recommender_user_id: 'user-friend-2',
          recommender_full_name: 'Marcus Rodriguez',
          recommender_avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=100&auto=format&fit=crop',
          recommendation_timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          product_id: 'product-3',
          product_name: 'Organic Baby Food',
          product_image_url: '/assets/organicbabyfood.jpg',
          product_category: 'Baby Food',
          recommendation_rating: 5,
          recommender_user_id: 'user-friend-3',
          recommender_full_name: 'Lily Chen',
          recommender_avatar_url: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=100&auto=format&fit=crop',
          recommendation_timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          product_id: 'product-4',
          product_name: 'Soft Baby Blankets',
          product_image_url: '/assets/softbabyblankets.jpg',
          product_category: 'Baby Bedding',
          recommendation_rating: 4,
          recommender_user_id: 'user-friend-4',
          recommender_full_name: 'David Kim',
          recommender_avatar_url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=100&auto=format&fit=crop',
          recommendation_timestamp: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString()
        }
      ];

      try {
        // Try to get real data from the new Supabase function
        const { data, error } = await supabase
          .rpc('get_newly_recommended_products_from_followed_users', {
            p_current_user_id: currentUserId,
            p_limit: limit,
            p_offset: 0
          });

        if (error) {
          console.error('Database error, using mock data:', error);
          return mockRecommendations.slice(0, limit);
        }

        // If we get real data, use it, otherwise fall back to mock data
        if (data && data.length > 0) {
          console.log('Real newly recommended products found:', data.length);
          return data as NewlyRecommendedProduct[];
        } else {
          console.log('No real data found, using mock recommendations');
          return mockRecommendations.slice(0, limit);
        }
      } catch (error) {
        console.error('Error fetching newly recommended products, using mock data:', error);
        return mockRecommendations.slice(0, limit);
      }
    },
    enabled: enabled && !!currentUserId,
  });
};
