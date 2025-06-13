
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface UseFavoriteStatusReturn {
  isFavorited: boolean;
  toggleFavorite: () => void;
  isLoading: boolean;
}

export const useFavoriteStatus = (itemId: string, itemType: 'sitter' | 'product'): UseFavoriteStatusReturn => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Query to check favorite status
  const { data: isFavorited = false, isLoading: isStatusLoading } = useQuery({
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

  // Mutation for toggling favorite status
  const toggleMutation = useMutation({
    mutationFn: async (shouldAdd: boolean) => {
      if (shouldAdd) {
        const { data, error } = await supabase.rpc('add_favorite', {
          p_item_id: itemId,
          p_item_type: itemType
        });
        if (error) throw error;
        // Handle potential error in the response data
        if (data && typeof data === 'object' && 'error' in data && data.error) {
          throw new Error(data.error as string);
        }
        return data;
      } else {
        const { data, error } = await supabase.rpc('remove_favorite', {
          p_item_id: itemId,
          p_item_type: itemType
        });
        if (error) throw error;
        // Handle potential error in the response data
        if (data && typeof data === 'object' && 'error' in data && data.error) {
          throw new Error(data.error as string);
        }
        return data;
      }
    },
    onMutate: async (shouldAdd: boolean) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['favorite-status', itemId, itemType] });

      // Snapshot the previous value
      const previousFavoriteStatus = queryClient.getQueryData(['favorite-status', itemId, itemType]);

      // Optimistically update the cache
      queryClient.setQueryData(['favorite-status', itemId, itemType], shouldAdd);

      // Return a context object with the snapshotted value
      return { previousFavoriteStatus };
    },
    onError: (error: any, variables, context) => {
      // Revert the optimistic update on error
      if (context?.previousFavoriteStatus !== undefined) {
        queryClient.setQueryData(['favorite-status', itemId, itemType], context.previousFavoriteStatus);
      }

      // Show error toast
      toast({
        title: "Error",
        description: error.message || "Failed to update favorite status",
        variant: "destructive",
      });
    },
    onSuccess: (data, shouldAdd) => {
      // Show success toast
      toast({
        title: shouldAdd ? "Added to Favorites" : "Removed from Favorites",
        description: `${itemType === 'sitter' ? 'Sitter' : 'Product'} ${shouldAdd ? 'added to' : 'removed from'} your favorites.`,
      });

      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: ['favorites'] });
      queryClient.invalidateQueries({ queryKey: ['favorite-status', itemId, itemType] });
      queryClient.invalidateQueries({ queryKey: ['user-favorites'] });
    },
  });

  const toggleFavorite = () => {
    const shouldAdd = !isFavorited;
    toggleMutation.mutate(shouldAdd);
  };

  return {
    isFavorited,
    toggleFavorite,
    isLoading: isStatusLoading || toggleMutation.isPending,
  };
};
