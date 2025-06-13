
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const useAdminProductMutations = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

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

  const deleteProductMutation = useMutation({
    mutationFn: async ({ productId, reason }: { productId: string; reason?: string }) => {
      const { data, error } = await supabase.rpc('admin_delete_product', {
        target_product_id: productId,
        deletion_reason: reason || 'Admin deletion',
      });

      if (error) throw error;
      return data;
    },
    onSuccess: (data: any) => {
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
      toast({
        title: "Success",
        description: `Product "${data.product_name}" deleted successfully. ${data.deleted_review_count} reviews were also removed.`,
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: `Failed to delete product: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  return {
    updateProduct: updateProductMutation.mutate,
    setVerifiedStatus: setVerifiedStatusMutation.mutate,
    mergeDuplicates: mergeDuplicatesMutation.mutate,
    deleteProduct: deleteProductMutation.mutate,
    isUpdating: updateProductMutation.isPending,
    isSettingVerification: setVerifiedStatusMutation.isPending,
    isMerging: mergeDuplicatesMutation.isPending,
    isDeleting: deleteProductMutation.isPending,
  };
};
