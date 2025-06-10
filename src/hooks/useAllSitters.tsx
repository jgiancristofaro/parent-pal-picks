
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useAllSitters = (enabled: boolean = true) => {
  return useQuery({
    queryKey: ['all-sitters'],
    queryFn: async () => {
      console.log('Fetching all sitters from database');

      const { data, error } = await supabase
        .from('sitters')
        .select('id, name, profile_image_url, rating, experience, bio')
        .order('name');

      if (error) {
        console.error('Error fetching all sitters:', error);
        throw error;
      }

      console.log('All sitters found:', data?.length || 0);
      return data || [];
    },
    enabled,
  });
};
