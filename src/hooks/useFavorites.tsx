
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface FavoriteItem {
  id: string;
  user_id: string;
  item_id: string;
  item_type: 'sitter' | 'product';
  created_at: string;
}

export const useFavorites = (itemType?: 'sitter' | 'product') => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch user's favorites
  const { data: favorites = [], isLoading, error } = useQuery({
    queryKey: ['favorites', itemType],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('user_favorites')
        .select('*')
        .eq(itemType ? 'item_type' : 'item_type', itemType || 'item_type')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as FavoriteItem[];
    },
  });

  // Add favorite mutation
  const addFavoriteMutation = useMutation({
    mutationFn: async ({ itemId, itemType }: { itemId: string; itemType: 'sitter' | 'product' }) => {
      const { data, error } = await supabase.functions.invoke('add_favorite', {
        body: { p_item_id: itemId, p_item_type: itemType }
      });

      if (error) throw error;
      if (data.error) throw new Error(data.error);
      return data;
    },
    onSuccess: (data, variables) => {
      toast({
        title: "Added to Favorites",
        description: `${variables.itemType === 'sitter' ? 'Sitter' : 'Product'} added to your favorites.`,
      });
      queryClient.invalidateQueries({ queryKey: ['favorites'] });
      queryClient.invalidateQueries({ queryKey: ['favorite-status', variables.itemId, variables.itemType] });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to add to favorites",
        variant: "destructive",
      });
    },
  });

  // Remove favorite mutation
  const removeFavoriteMutation = useMutation({
    mutationFn: async ({ itemId, itemType }: { itemId: string; itemType: 'sitter' | 'product' }) => {
      const { data, error } = await supabase.functions.invoke('remove_favorite', {
        body: { p_item_id: itemId, p_item_type: itemType }
      });

      if (error) throw error;
      if (data.error) throw new Error(data.error);
      return data;
    },
    onSuccess: (data, variables) => {
      toast({
        title: "Removed from Favorites",
        description: `${variables.itemType === 'sitter' ? 'Sitter' : 'Product'} removed from your favorites.`,
      });
      queryClient.invalidateQueries({ queryKey: ['favorites'] });
      queryClient.invalidateQueries({ queryKey: ['favorite-status', variables.itemId, variables.itemType] });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to remove from favorites",
        variant: "destructive",
      });
    },
  });

  return {
    favorites,
    isLoading,
    error,
    addFavorite: addFavoriteMutation.mutate,
    removeFavorite: removeFavoriteMutation.mutate,
    isAddingFavorite: addFavoriteMutation.isPending,
    isRemovingFavorite: removeFavoriteMutation.isPending,
  };
};
