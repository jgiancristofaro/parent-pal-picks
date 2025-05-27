
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface UserLocation {
  id: string;
  location_nickname: string;
  dwelling_type: string;
  building_identifier: string | null;
  zip_code: string;
  address_details: any;
  is_primary: boolean;
  latitude: number | null;
  longitude: number | null;
  created_at: string;
  updated_at: string;
}

export const useUserLocations = () => {
  return useQuery({
    queryKey: ['user-locations'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      const { data, error } = await supabase
        .from('user_locations')
        .select('*')
        .eq('user_id', user.id)
        .order('is_primary', { ascending: false })
        .order('location_nickname');

      if (error) {
        console.error('Error fetching user locations:', error);
        return [];
      }
      return data as UserLocation[];
    },
    enabled: true,
  });
};
