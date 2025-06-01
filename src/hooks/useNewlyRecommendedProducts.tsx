
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

      // Mock data for product recommendations
      const mockRecommendations: NewlyRecommendedProduct[] = [
        {
          product_id: 'product-1',
          product_name: 'Smart Baby Monitor',
          product_image_url: '/assets/babymonitor.jpg',
          product_category: 'Baby Tech',
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
          recommender_user_id: 'user-friend-4',
          recommender_full_name: 'David Kim',
          recommender_avatar_url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=100&auto=format&fit=crop',
          recommendation_timestamp: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString()
        }
      ];

      // Try to get real data, fall back to mock data if needed
      try {
        // For now, just return mock data since we don't have a products recommendation function yet
        console.log('Using mock product recommendations');
        return mockRecommendations.slice(0, limit);
      } catch (error) {
        console.error('Error fetching newly recommended products, using mock data:', error);
        return mockRecommendations.slice(0, limit);
      }
    },
    enabled: enabled && !!currentUserId,
  });
};
