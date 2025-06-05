
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useSitterProfile = (sitterId: string | undefined) => {
  return useQuery({
    queryKey: ['sitter-profile', sitterId],
    queryFn: async () => {
      if (!sitterId) return null;
      
      console.log('Fetching sitter profile for ID:', sitterId);
      
      const { data, error } = await supabase
        .from('sitters')
        .select('*')
        .eq('id', sitterId)
        .single();

      if (error) {
        console.error('Error fetching sitter profile:', error);
        throw error;
      }

      console.log('Sitter profile data:', data);
      return data;
    },
    enabled: !!sitterId,
  });
};
