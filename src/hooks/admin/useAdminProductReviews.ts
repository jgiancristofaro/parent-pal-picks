
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { AdminReview } from "./useAdminProductsTypes";

export const useAdminProductReviews = (productId: string) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: reviews = [], isLoading, error } = useQuery({
    queryKey: ['admin-product-reviews', productId],
    queryFn: async (): Promise<AdminReview[]> => {
      console.log('Fetching admin product reviews for product ID:', productId);
      
      try {
        const { data, error } = await supabase.rpc('admin_get_item_reviews', {
          item_type: 'product',
          item_id: productId,
        });

        if (error) {
          console.error('Supabase RPC error:', error);
          throw new Error(`Failed to fetch reviews: ${error.message}`);
        }

        console.log('Successfully fetched reviews:', data?.length || 0, 'reviews');
        return data || [];
      } catch (err) {
        console.error('Error in admin product reviews fetch:', err);
        throw err;
      }
    },
    enabled: !!productId,
    retry: (failureCount, error) => {
      console.log(`Query retry attempt ${failureCount + 1} for product reviews:`, error);
      return failureCount < 2; // Retry up to 2 times
    },
  });

  const deleteReviewMutation = useMutation({
    mutationFn: async ({ reviewId, reason }: { reviewId: string; reason?: string }) => {
      console.log('Attempting to delete review:', reviewId);
      
      const { data, error } = await supabase.rpc('admin_delete_review', {
        review_id: reviewId,
        deletion_reason: reason || 'Admin deletion',
      });

      if (error) {
        console.error('Failed to delete review:', error);
        throw error;
      }
      
      console.log('Successfully deleted review:', reviewId);
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
      console.error('Delete review mutation error:', error);
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
    error,
    deleteReview: deleteReviewMutation.mutate,
    isDeleting: deleteReviewMutation.isPending,
  };
};
