
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { AdminProduct } from "./admin/useAdminProductsTypes";
import { useAdminProductMutations } from "./admin/useAdminProductMutations";

export const useAdminProducts = (searchTerm = '', page = 0, pageSize = 50) => {
  const { data: products = [], isLoading, error, isFetching } = useQuery({
    queryKey: ['admin-products', searchTerm, page, pageSize],
    queryFn: async (): Promise<AdminProduct[]> => {
      console.log('Fetching admin products with search term:', searchTerm);
      
      const { data, error } = await supabase.rpc('admin_get_all_products', {
        search_term: searchTerm,
        page_limit: pageSize,
        page_offset: page * pageSize,
      });

      if (error) {
        console.error('Error fetching admin products:', error);
        throw error;
      }

      console.log('Successfully fetched admin products:', data?.length || 0, 'results');
      return data || [];
    },
    staleTime: 30000, // Cache for 30 seconds
    gcTime: 5 * 60 * 1000, // Keep in cache for 5 minutes
  });

  const mutations = useAdminProductMutations();

  return {
    products,
    isLoading,
    isFetching,
    error,
    ...mutations,
  };
};

// Re-export the reviews hook for convenience
export { useAdminProductReviews } from "./admin/useAdminProductReviews";
