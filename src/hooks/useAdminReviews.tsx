
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

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

export const useAdminReviews = (itemType: 'sitter' | 'product', itemId: string) => {
  const [reviews, setReviews] = useState<AdminReview[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const fetchReviews = async () => {
    if (!itemId) return;
    
    try {
      setLoading(true);
      
      const { data, error } = await supabase.rpc('admin_get_item_reviews', {
        item_type: itemType,
        item_id: itemId
      });

      if (error) {
        console.error('Error fetching reviews:', error);
        toast({
          title: "Error",
          description: "Failed to load reviews",
          variant: "destructive",
        });
        return;
      }

      setReviews(data || []);
      
    } catch (error) {
      console.error('Error in fetchReviews:', error);
      toast({
        title: "Error",
        description: "Failed to load reviews",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const deleteReview = async (reviewId: string, reason: string) => {
    try {
      const { data, error } = await supabase.rpc('admin_delete_review', {
        review_id: reviewId,
        deletion_reason: reason
      });

      if (error) {
        console.error('Error deleting review:', error);
        toast({
          title: "Error",
          description: "Failed to delete review",
          variant: "destructive",
        });
        return false;
      }

      // Remove review from local state
      setReviews(prev => prev.filter(review => review.id !== reviewId));

      toast({
        title: "Success",
        description: "Review deleted successfully",
      });

      return true;
    } catch (error) {
      console.error('Error in deleteReview:', error);
      return false;
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [itemType, itemId]);

  return {
    reviews,
    loading,
    deleteReview,
    refreshReviews: fetchReviews
  };
};
