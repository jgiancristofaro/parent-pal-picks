
import React from 'react';
import { useAdmin } from '@/hooks/useAdmin';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface AdminReviewActionsProps {
  reviewId: string;
  onDeleted?: () => void;
}

export const AdminReviewActions = ({ reviewId, onDeleted }: AdminReviewActionsProps) => {
  const { isAdmin } = useAdmin();
  const { toast } = useToast();

  if (!isAdmin) return null;

  const handleDeleteReview = async () => {
    if (!confirm('Are you sure you want to delete this review? This action cannot be undone.')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('reviews')
        .delete()
        .eq('id', reviewId);

      if (error) throw error;

      toast({
        title: "Review Deleted",
        description: "The review has been deleted successfully.",
      });

      if (onDeleted) {
        onDeleted();
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: `Failed to delete review: ${error.message}`,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex items-center gap-1 ml-2">
      <Button
        variant="ghost"
        size="sm"
        onClick={handleDeleteReview}
        className="h-6 w-6 p-0 text-red-600 hover:text-red-700"
        title="Delete Review (Admin)"
      >
        <Trash2 className="h-3 w-3" />
      </Button>
    </div>
  );
};
