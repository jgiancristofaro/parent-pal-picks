
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

      // First get the list of followed users
      const { data: followedUsers, error: followError } = await supabase
        .from('user_follows')
        .select('following_id')
        .eq('follower_id', currentUserId);

      if (followError) {
        console.error('Error fetching followed users:', followError);
        throw followError;
      }

      if (!followedUsers || followedUsers.length === 0) {
        console.log('No followed users found');
        return [];
      }

      const followedUserIds = followedUsers.map(f => f.following_id);

      // Get products recommended by followed users (reviews with rating >= 4)
      const { data: reviewsData, error } = await supabase
        .from('reviews')
        .select(`
          product_id,
          user_id,
          created_at,
          products!inner(
            name,
            image_url,
            category
          )
        `)
        .not('product_id', 'is', null)
        .gte('rating', 4)
        .in('user_id', followedUserIds)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) {
        console.error('Error fetching newly recommended products:', error);
        throw error;
      }

      // Now get user profiles for the recommenders
      const userIds = [...new Set((reviewsData || []).map(review => review.user_id))];
      
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('id, full_name, avatar_url')
        .in('id', userIds);

      if (profilesError) {
        console.error('Error fetching profiles:', profilesError);
        throw profilesError;
      }

      // Create a map for quick profile lookup
      const profilesMap = new Map(
        (profilesData || []).map(profile => [profile.id, profile])
      );

      const transformedData = (reviewsData || []).map(item => {
        const profile = profilesMap.get(item.user_id);
        return {
          product_id: item.product_id!,
          product_name: item.products.name,
          product_image_url: item.products.image_url,
          product_category: item.products.category,
          recommender_user_id: item.user_id,
          recommender_full_name: profile?.full_name || 'Unknown User',
          recommender_avatar_url: profile?.avatar_url || null,
          recommendation_timestamp: item.created_at
        };
      }) as NewlyRecommendedProduct[];

      console.log('Newly recommended products found:', transformedData.length);
      return transformedData;
    },
    enabled: enabled && !!currentUserId,
  });
};
