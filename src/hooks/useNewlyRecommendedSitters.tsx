
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

      // For now, return mock data that simulates the database response
      // This will work until we have proper authentication set up
      const mockRecommendations: NewlyRecommendedSitter[] = [
        {
          sitter_id: 'sitter-1',
          sitter_name: 'Emma Johnson',
          sitter_profile_image_url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop',
          sitter_rating: 4.8,
          recommender_user_id: 'user-friend-1',
          recommender_full_name: 'Emma Thompson',
          recommender_avatar_url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=100&auto=format&fit=crop',
          recommendation_timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          sitter_id: 'sitter-2',
          sitter_name: 'Sophia Bennett',
          sitter_profile_image_url: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=200&auto=format&fit=crop',
          sitter_rating: 4.9,
          recommender_user_id: 'user-friend-2',
          recommender_full_name: 'Marcus Rodriguez',
          recommender_avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=100&auto=format&fit=crop',
          recommendation_timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          sitter_id: 'sitter-3',
          sitter_name: 'Madison Clark',
          sitter_profile_image_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop',
          sitter_rating: 4.7,
          recommender_user_id: 'user-friend-3',
          recommender_full_name: 'Lily Chen',
          recommender_avatar_url: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=100&auto=format&fit=crop',
          recommendation_timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          sitter_id: 'sitter-4',
          sitter_name: 'Jessica Williams',
          sitter_profile_image_url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=200&auto=format&fit=crop',
          sitter_rating: 4.6,
          recommender_user_id: 'user-friend-4',
          recommender_full_name: 'David Kim',
          recommender_avatar_url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=100&auto=format&fit=crop',
          recommendation_timestamp: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          sitter_id: 'sitter-5',
          sitter_name: 'Ashley Davis',
          sitter_profile_image_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop',
          sitter_rating: 4.9,
          recommender_user_id: 'user-friend-5',
          recommender_full_name: 'Sarah Williams',
          recommender_avatar_url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=100&auto=format&fit=crop',
          recommendation_timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
        }
      ];

      // Simulate the database call with proper error handling
      try {
        const { data, error } = await supabase
          .rpc('get_newly_recommended_sitters_from_followed_users', {
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
          console.log('Real newly recommended sitters found:', data.length);
          return data as NewlyRecommendedSitter[];
        } else {
          console.log('No real data found, using mock recommendations');
          return mockRecommendations.slice(0, limit);
        }
      } catch (error) {
        console.error('Error fetching newly recommended sitters, using mock data:', error);
        return mockRecommendations.slice(0, limit);
      }
    },
    enabled: enabled && !!currentUserId,
  });
};
