
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { AdminProduct } from "./admin/useAdminProductsTypes";

export const useAdminProduct = (productId: string) => {
  const { data: product, isLoading, error } = useQuery({
    queryKey: ['admin-product', productId],
    queryFn: async (): Promise<AdminProduct | null> => {
      console.log('Fetching admin product by ID:', productId);
      
      const { data, error } = await supabase
        .from('products')
        .select(`
          id,
          name,
          brand_name,
          category,
          description,
          image_url,
          price,
          external_purchase_link,
          average_rating,
          review_count,
          is_verified,
          created_at,
          updated_at
        `)
        .eq('id', productId)
        .single();

      if (error) {
        console.error('Error fetching admin product:', error);
        throw error;
      }

      console.log('Successfully fetched admin product:', data);
      return data;
    },
    enabled: !!productId, // Only run query if productId is provided
    staleTime: 30000, // Cache for 30 seconds
    gcTime: 5 * 60 * 1000, // Keep in cache for 5 minutes
  });

  return {
    product,
    isLoading,
    error,
  };
};
