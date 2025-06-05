
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useSitterReviews = (sitterId: string | undefined) => {
  return useQuery({
    queryKey: ['sitter-reviews', sitterId],
    queryFn: async () => {
      if (!sitterId) return [];
      
      console.log('Fetching reviews for sitter ID:', sitterId);
      
      const { data, error } = await supabase
        .from('reviews')
        .select(`
          *,
          profiles (
            full_name,
            avatar_url
          )
        `)
        .eq('sitter_id', sitterId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching sitter reviews:', error);
        throw error;
      }

      console.log('Sitter reviews found:', data?.length || 0);
      return data || [];
    },
    enabled: !!sitterId,
  });
};
