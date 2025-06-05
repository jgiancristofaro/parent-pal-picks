
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useProfileFollowers = (userId: string | undefined) => {
  return useQuery({
    queryKey: ['profile-followers', userId],
    queryFn: async () => {
      if (!userId) return [];
      
      console.log('Fetching followers for user:', userId);
      
      const { data, error } = await supabase
        .rpc('get_profile_followers', {
          target_user_id: userId
        });

      if (error) {
        console.error('Error fetching profile followers:', error);
        throw error;
      }

      console.log('Profile followers found:', data?.length || 0);
      return data || [];
    },
    enabled: !!userId,
  });
};
