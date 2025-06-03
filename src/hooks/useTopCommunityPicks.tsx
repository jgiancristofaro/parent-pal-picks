
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface TopCommunityPick {
  product_id: string;
  product_name: string;
  product_image_url: string;
  product_category: string;
  average_rating: number;
  unique_recommender_count: number;
}

export const useTopCommunityPicks = () => {
  return useQuery({
    queryKey: ['top-community-picks'],
    queryFn: async () => {
      console.log('Fetching top community picks...');
      const { data, error } = await supabase.rpc('get_top_community_picks', {
        time_window_days: 14,
        min_recommendation_rating: 4.0,
        limit_results: 10
      });

      if (error) {
        console.error('Error fetching top community picks:', error);
        throw error;
      }

      console.log('Top community picks data:', data);
      return data as TopCommunityPick[];
    },
  });
};
