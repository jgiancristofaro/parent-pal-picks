
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface EditReviewData {
  id: string;
  rating: number;
  title: string;
  content: string;
  product_id?: string;
  sitter_id?: string;
}

export const useEditReview = () => {
  const [isUpdating, setIsUpdating] = useState(false);
  const { toast } = useToast();

  const updateReview = async (reviewData: EditReviewData) => {
    setIsUpdating(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('update_review', {
        body: {
          review_id: reviewData.id,
          new_rating: reviewData.rating,
          new_title: reviewData.title,
          new_content: reviewData.content,
        }
      });

      if (error) {
        console.error("Error updating review:", error);
        toast({
          title: "Error",
          description: "Failed to update review",
          variant: "destructive",
        });
        return false;
      }

      if (data?.error) {
        toast({
          title: "Error",
          description: data.error,
          variant: "destructive",
        });
        return false;
      }

      if (data?.success) {
        toast({
          title: "Success",
          description: "Your review has been updated!",
        });
        return true;
      }

      return false;
    } catch (err) {
      console.error("Unexpected error:", err);
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsUpdating(false);
    }
  };

  return { updateReview, isUpdating };
};
