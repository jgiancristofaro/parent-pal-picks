
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export const useProfile = (userId?: string) => {
  const { user } = useAuth();
  
  // Use the provided userId or fall back to the current user's ID
  const targetUserId = userId || user?.id;
  
  return useQuery({
    queryKey: ['profile', targetUserId],
    queryFn: async () => {
      if (!targetUserId) return null;
      
      console.log('Fetching profile with follow status for user:', targetUserId);
      
      const { data, error } = await supabase
        .rpc('get_profile_with_follow_status', {
          target_user_id: targetUserId
        });

      if (error) {
        console.error('Error fetching profile with follow status:', error);
        throw error;
      }

      console.log('Profile data with follow status:', data);
      return data;
    },
    enabled: !!targetUserId,
  });
};
