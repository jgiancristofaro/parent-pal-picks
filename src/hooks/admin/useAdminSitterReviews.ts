
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import type { AdminReview } from "./types";

export const useAdminSitterReviews = (sitterId: string) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: reviews = [], isLoading } = useQuery({
    queryKey: ['admin-sitter-reviews', sitterId],
    queryFn: async (): Promise<AdminReview[]> => {
      const { data, error } = await supabase.rpc('admin_get_item_reviews', {
        item_type: 'sitter',
        item_id: sitterId,
      });

      if (error) throw error;
      return data || [];
    },
    enabled: !!sitterId,
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
      queryClient.invalidateQueries({ queryKey: ['admin-sitter-reviews'] });
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
