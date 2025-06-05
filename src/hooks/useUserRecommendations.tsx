
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface UserRecommendation {
  id: string;
  name: string;
  profile_image_url?: string;
  image_url?: string;
  rating?: number;
  experience?: string;
  bio?: string;
  hourly_rate?: number;
  category?: string;
  brand_name?: string;
  average_rating?: number;
  profile_owner_review: {
    rating: number;
    review_text_snippet: string;
  };
}

export const useUserRecommendations = (userId: string | undefined, itemType: 'sitter' | 'product') => {
  return useQuery({
    queryKey: ['user-recommendations', userId, itemType],
    queryFn: async () => {
      if (!userId) return [];
      
      console.log('Fetching user recommendations for user:', userId, 'type:', itemType);
      const { data, error } = await supabase.rpc('get_user_recommendations_with_review_snippets', {
        profile_owner_user_id: userId,
        item_type: itemType
      });

      if (error) {
        console.error('Error fetching user recommendations:', error);
        throw error;
      }

      console.log('User recommendations data:', data);
      return (data as UserRecommendation[]) || [];
    },
    enabled: !!userId,
  });
};
