
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface AdminProduct {
  id: string;
  name: string;
  brand_name: string;
  category: string | null;
  description: string | null;
  image_url: string | null;
  price: number | null;
  external_purchase_link: string | null;
  average_rating: number | null;
  review_count: number;
  is_verified: boolean;
  created_at: string;
  updated_at: string;
}

interface AdminReview {
  id: string;
  user_id: string;
  user_full_name: string;
  rating: number;
  title: string;
  content: string;
  created_at: string;
  updated_at: string;
}

export const useAdminProducts = (searchTerm = '', page = 0, pageSize = 50) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: products = [], isLoading, error } = useQuery({
    queryKey: ['admin-products', searchTerm, page, pageSize],
    queryFn: async (): Promise<AdminProduct[]> => {
      const { data, error } = await supabase.rpc('admin_get_all_products', {
        search_term: searchTerm,
        page_limit: pageSize,
        page_offset: page * pageSize,
      });

      if (error) {
        console.error('Error fetching admin products:', error);
        throw error;
      }

      return data || [];
    },
  });

  const updateProductMutation = useMutation({
    mutationFn: async (params: {
      productId: string;
      name?: string;
      brandName?: string;
      category?: string;
      description?: string;
      imageUrl?: string;
      price?: number;
      externalPurchaseLink?: string;
    }) => {
      const { data, error } = await supabase.rpc('admin_update_product_details', {
        target_product_id: params.productId,
        new_name: params.name,
        new_brand_name: params.brandName,
        new_category: params.category,
        new_description: params.description,
        new_image_url: params.imageUrl,
        new_price: params.price,
        new_external_purchase_link: params.externalPurchaseLink,
      });

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
      toast({
        title: "Success",
        description: "Product updated successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: `Failed to update product: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  const setVerifiedStatusMutation = useMutation({
    mutationFn: async ({ productId, verified }: { productId: string; verified: boolean }) => {
      const { data, error } = await supabase.rpc('admin_set_verified_status', {
        item_type: 'product',
        item_id: productId,
        verified_status: verified,
      });

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
      toast({
        title: "Success",
        description: "Product verification status updated",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: `Failed to update verification: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  const mergeDuplicatesMutation = useMutation({
    mutationFn: async ({ sourceId, targetId, reason }: { sourceId: string; targetId: string; reason?: string }) => {
      const { data, error } = await supabase.rpc('admin_merge_duplicates', {
        item_type: 'product',
        source_id: sourceId,
        target_id: targetId,
        merge_reason: reason || 'Duplicate merge',
      });

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
      toast({
        title: "Success",
        description: "Products merged successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: `Failed to merge products: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  return {
    products,
    isLoading,
    error,
    updateProduct: updateProductMutation.mutate,
    setVerifiedStatus: setVerifiedStatusMutation.mutate,
    mergeDuplicates: mergeDuplicatesMutation.mutate,
    isUpdating: updateProductMutation.isPending,
    isSettingVerification: setVerifiedStatusMutation.isPending,
    isMerging: mergeDuplicatesMutation.isPending,
  };
};

export const useAdminProductReviews = (productId: string) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: reviews = [], isLoading } = useQuery({
    queryKey: ['admin-product-reviews', productId],
    queryFn: async (): Promise<AdminReview[]> => {
      const { data, error } = await supabase.rpc('admin_get_item_reviews', {
        item_type: 'product',
        item_id: productId,
      });

      if (error) throw error;
      return data || [];
    },
    enabled: !!productId,
  });

  const deleteReviewMutation = useMutation({
    mutationFn: async ({ reviewId, reason }: { reviewId: string; reason?: string }) => {
      const { data, error } = await supabase.rpc('admin_delete_review', {
        review_id: reviewId,
        deletion_reason: reason || 'Admin deletion',
      });

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-product-reviews'] });
      toast({
        title: "Success",
        description: "Review deleted successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: `Failed to delete review: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  return {
    reviews,
    isLoading,
    deleteReview: deleteReviewMutation.mutate,
    isDeleting: deleteReviewMutation.isPending,
  };
};
