
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface FlagContentData {
  contentType: 'review';
  contentId: string;
  reason: string;
}

export const useFlagContent = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const flagContent = async (data: FlagContentData) => {
    setIsSubmitting(true);
    
    try {
      const { data: result, error } = await supabase.rpc('flag_content', {
        p_content_type: data.contentType,
        p_content_id: data.contentId,
        p_reason: data.reason
      });

      if (error) {
        console.error('Error flagging content:', error);
        toast({
          title: "Error",
          description: "Failed to flag content",
          variant: "destructive",
        });
        return false;
      }

      // Type cast the response
      const response = result as { error?: string; success?: boolean };

      if (response?.error) {
        toast({
          title: "Error",
          description: response.error,
          variant: "destructive",
        });
        return false;
      }

      if (response?.success) {
        toast({
          title: "Content Flagged",
          description: "Thank you for reporting this content. We'll review it soon.",
        });
        return true;
      }

      return false;
    } catch (err) {
      console.error('Unexpected error:', err);
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  return { flagContent, isSubmitting };
};
