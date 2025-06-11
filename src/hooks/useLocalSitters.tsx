
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

      // First, get the location details to extract the Google Place ID
      const { data: locationData, error: locationError } = await supabase
        .from('user_locations')
        .select('google_place_id, zip_code, dwelling_type')
        .eq('id', selectedLocationId)
        .eq('user_id', currentUserId)
        .single();

      if (locationError) {
        console.error('Error fetching location details:', locationError);
        throw locationError;
      }

      if (!locationData) {
        console.log('No location found for the given ID');
        return [];
      }

      let data = [];

      if (searchScope === 'BUILDING' && locationData.google_place_id) {
        // Use the new search_sitters function for building-level search
        const { data: sittersData, error } = await supabase
          .rpc('search_sitters', {
            home_place_id: locationData.google_place_id,
            current_user_id: currentUserId
          });

        if (error) {
          console.error('Error fetching local sitters by Google Place ID:', error);
          throw error;
        }

        data = sittersData || [];
      } else if (searchScope === 'AREA_ZIP' && locationData.zip_code) {
        // For ZIP-based search, use the existing logic
        const { data: sittersData, error } = await supabase
          .rpc('get_local_sitters', {
            current_user_id_param: currentUserId,
            selected_user_location_id_param: selectedLocationId,
            search_scope_param: searchScope
          });

        if (error) {
          console.error('Error fetching local sitters by ZIP:', error);
          throw error;
        }

        data = sittersData || [];
      }

      console.log('Local sitters found:', data?.length || 0, 'for scope:', searchScope);
      return data || [];
    },
    enabled: enabled && !!currentUserId && !!selectedLocationId,
  });
};
