
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useProfileFollowing = (userId: string | undefined) => {
  return useQuery({
    queryKey: ['profile-following', userId],
    queryFn: async () => {
      if (!userId) return [];
      
      console.log('Fetching following for user:', userId);
      
      const { data, error } = await supabase
        .rpc('get_profile_following', {
          target_user_id: userId
        });

      if (error) {
        console.error('Error fetching profile following:', error);
        throw error;
      }

      console.log('Profile following found:', data?.length || 0);
      return data || [];
    },
    enabled: !!userId,
  });
};
