
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { AdminReview } from "./useAdminProductsTypes";

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
