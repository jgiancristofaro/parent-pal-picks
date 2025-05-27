
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useHyperLocalSitters = (
  currentUserId: string | undefined, 
  selectedLocationId: string | undefined,
  enabled: boolean = true
) => {
  return useQuery({
    queryKey: ['hyper-local-sitters', currentUserId, selectedLocationId],
    queryFn: async () => {
      if (!currentUserId || !selectedLocationId) return [];

      console.log('Fetching hyper-local sitters for user:', currentUserId, 'location:', selectedLocationId);

      const { data, error } = await supabase
        .rpc('get_sitters_for_user_location', {
          current_user_id_param: currentUserId,
          selected_user_location_id_param: selectedLocationId
        });

      if (error) {
        console.error('Error fetching hyper-local sitters:', error);
        throw error;
      }

      console.log('Hyper-local sitters found:', data?.length || 0);
      return data || [];
    },
    enabled: enabled && !!currentUserId && !!selectedLocationId,
  });
};
