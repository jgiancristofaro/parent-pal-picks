
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
      
      console.log('Fetching profile for user:', targetUserId);
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', targetUserId)
        .single();

      if (error) {
        console.error('Error fetching profile:', error);
        throw error;
      }

      console.log('Profile data:', data);
      return data;
    },
    enabled: !!targetUserId,
  });
};
