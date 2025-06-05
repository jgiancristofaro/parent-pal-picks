
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export const useUserLocations = () => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['user-locations', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      
      console.log('Fetching user locations for user:', user.id);
      
      const { data, error } = await supabase
        .from('user_locations')
        .select('*')
        .eq('user_id', user.id)
        .order('is_primary', { ascending: false })
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching user locations:', error);
        throw error;
      }

      console.log('User locations found:', data?.length || 0);
      return data || [];
    },
    enabled: !!user?.id,
  });
};
