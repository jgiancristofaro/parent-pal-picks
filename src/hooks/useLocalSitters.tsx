
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useLocalSitters = (
  currentUserId: string | undefined, 
  selectedLocationId: string | undefined,
  searchScope: 'BUILDING' | 'AREA_ZIP' = 'BUILDING',
  enabled: boolean = true
) => {
  return useQuery({
    queryKey: ['local-sitters', currentUserId, selectedLocationId, searchScope],
    queryFn: async () => {
      if (!currentUserId || !selectedLocationId) return [];

      console.log('Fetching local sitters for user:', currentUserId, 'location:', selectedLocationId, 'scope:', searchScope);

      const { data, error } = await supabase
        .rpc('get_local_sitters', {
          current_user_id_param: currentUserId,
          selected_user_location_id_param: selectedLocationId,
          search_scope_param: searchScope
        });

      if (error) {
        console.error('Error fetching local sitters:', error);
        throw error;
      }

      console.log('Local sitters found:', data?.length || 0, 'for scope:', searchScope);
      return data || [];
    },
    enabled: enabled && !!currentUserId && !!selectedLocationId,
  });
};
