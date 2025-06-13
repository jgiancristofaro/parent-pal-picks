
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

interface FavoriteItem {
  id: string;
  item_id: string;
  item_type: 'sitter' | 'product';
  created_at: string;
}

interface FavoriteSitter {
  id: string;
  name: string;
  profile_image_url: string;
  rating: number;
  experience: string;
  bio: string;
  hourly_rate: number;
}

interface FavoriteProduct {
  id: string;
  name: string;
  image_url: string;
  category: string;
  brand_name: string;
  average_rating: number;
}

interface UserFavoritesReturn {
  sitterFavorites: FavoriteSitter[];
  productFavorites: FavoriteProduct[];
}

export const useUserFavorites = (userId?: string): {
  data: UserFavoritesReturn;
  isLoading: boolean;
  error: any;
} => {
  const { user } = useAuth();
  const targetUserId = userId || user?.id;

  const { data: favorites = [], isLoading: favoritesLoading, error: favoritesError } = useQuery({
    queryKey: ['user-favorites', targetUserId],
    queryFn: async () => {
      if (!targetUserId) throw new Error('No user ID provided');
      
      const { data, error } = await supabase
        .from('user_favorites')
        .select('*')
        .eq('user_id', targetUserId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as FavoriteItem[];
    },
    enabled: !!targetUserId,
  });

  // Fetch sitter details for favorited sitters
  const sitterIds = favorites.filter(f => f.item_type === 'sitter').map(f => f.item_id);
  const { data: sitters = [], isLoading: sittersLoading } = useQuery({
    queryKey: ['favorite-sitters', sitterIds],
    queryFn: async () => {
      if (sitterIds.length === 0) return [];
      
      const { data, error } = await supabase
        .from('sitters')
        .select('id, name, profile_image_url, rating, experience, bio, hourly_rate')
        .in('id', sitterIds);

      if (error) throw error;
      return data as FavoriteSitter[];
    },
    enabled: sitterIds.length > 0,
  });

  // Fetch product details for favorited products
  const productIds = favorites.filter(f => f.item_type === 'product').map(f => f.item_id);
  const { data: products = [], isLoading: productsLoading } = useQuery({
    queryKey: ['favorite-products', productIds],
    queryFn: async () => {
      if (productIds.length === 0) return [];
      
      const { data, error } = await supabase
        .from('products')
        .select('id, name, image_url, category, brand_name, average_rating')
        .in('id', productIds);

      if (error) throw error;
      return data as FavoriteProduct[];
    },
    enabled: productIds.length > 0,
  });

  return {
    data: {
      sitterFavorites: sitters,
      productFavorites: products,
    },
    isLoading: favoritesLoading || sittersLoading || productsLoading,
    error: favoritesError,
  };
};
