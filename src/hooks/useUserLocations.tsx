
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";

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
  const [user, setUser] = useState<User | null | undefined>(undefined);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    console.log('useUserLocations: Initializing authentication check');
    
    const getInitialUser = async () => {
      try {
        console.log('useUserLocations: Fetching initial user session');
        const { data: { user }, error } = await supabase.auth.getUser();
        
        if (error) {
          console.error('useUserLocations: Error getting initial user:', error);
        } else {
          console.log('useUserLocations: Initial user fetch result:', user ? 'authenticated' : 'not authenticated');
        }
        
        setUser(user);
        setAuthLoading(false);
      } catch (error) {
        console.error('useUserLocations: Exception during initial user fetch:', error);
        setUser(null);
        setAuthLoading(false);
      }
    };

    getInitialUser();

    // Set up auth state listener for future changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('useUserLocations: Auth state changed:', event, session?.user ? 'authenticated' : 'not authenticated');
      setUser(session?.user ?? null);
      setAuthLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  return useQuery({
    queryKey: ['user-locations'],
    queryFn: async () => {
      console.log('useUserLocations: Starting queryFn execution');
      
      if (!user) {
        console.log('useUserLocations: No authenticated user, returning empty array');
        return [];
      }

      try {
        console.log('useUserLocations: Fetching user locations for user:', user.id);
        
        const { data, error } = await supabase
          .from('user_locations')
          .select('*')
          .eq('user_id', user.id)
          .order('is_primary', { ascending: false })
          .order('location_nickname');

        if (error) {
          console.error('useUserLocations: Supabase error fetching user locations:', {
            error,
            code: error.code,
            message: error.message,
            details: error.details,
            hint: error.hint
          });
          throw error;
        }

        console.log('useUserLocations: Successfully fetched user locations:', data?.length || 0, 'locations');
        return data as UserLocation[];
      } catch (error) {
        console.error('useUserLocations: Exception in queryFn:', error);
        throw error;
      }
    },
    enabled: !authLoading && user !== undefined,
  });
};
