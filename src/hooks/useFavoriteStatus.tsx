
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useFavoriteStatus = (itemId: string, itemType: 'sitter' | 'product') => {
  return useQuery({
    queryKey: ['favorite-status', itemId, itemType],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('user_favorites')
        .select('id')
        .eq('item_id', itemId)
        .eq('item_type', itemType)
        .maybeSingle();

      if (error) throw error;
      return !!data; // Returns true if favorite exists, false otherwise
    },
    enabled: !!itemId && !!itemType,
  });
};
