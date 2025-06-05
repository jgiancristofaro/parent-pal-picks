
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useSitterReviews = (sitterId: string | undefined) => {
  return useQuery({
    queryKey: ['sitter-reviews', sitterId],
    queryFn: async () => {
      if (!sitterId) return [];
      
      console.log('Fetching reviews for sitter ID:', sitterId);
      
      // First, fetch the reviews
      const { data: reviewsData, error: reviewsError } = await supabase
        .from('reviews')
        .select(`
          id,
          user_id,
          rating,
          title,
          content,
          created_at
        `)
        .eq('sitter_id', sitterId)
        .order('created_at', { ascending: false });

      if (reviewsError) {
        console.error('Error fetching sitter reviews:', reviewsError);
        throw reviewsError;
      }

      if (!reviewsData || reviewsData.length === 0) {
        console.log('No reviews found for sitter');
        return [];
      }

      // Extract unique user IDs from reviews
      const userIds = [...new Set(reviewsData.map(review => review.user_id))];
      
      // Fetch profiles for all users who wrote reviews
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('id, full_name, avatar_url')
        .in('id', userIds);

      if (profilesError) {
        console.error('Error fetching user profiles:', profilesError);
        throw profilesError;
      }

      // Create a map of user profiles for quick lookup
      const profilesMap = new Map();
      profilesData?.forEach(profile => {
        profilesMap.set(profile.id, profile);
      });

      // Combine reviews with profile data
      const combinedData = reviewsData.map(review => ({
        ...review,
        profiles: profilesMap.get(review.user_id) || {
          full_name: 'Anonymous',
          avatar_url: null
        }
      }));

      console.log('Sitter reviews found:', combinedData.length);
      return combinedData;
    },
    enabled: !!sitterId,
  });
};
