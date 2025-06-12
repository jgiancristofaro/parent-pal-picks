
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface FlaggedContentItem {
  flag_id: string;
  content_type: string;
  content_id: string;
  reported_by_user_id: string;
  reporter_name: string;
  reason: string;
  status: string;
  created_at: string;
  content_data: {
    id: string;
    rating: number;
    title: string;
    content: string;
    author_name: string;
    sitter_name?: string;
    product_name?: string;
    created_at: string;
  };
}

export const useFlagContent = () => {
  const { toast } = useToast();

  const flagContentMutation = useMutation({
    mutationFn: async ({ contentType, contentId, reason }: { 
      contentType: string; 
      contentId: string; 
      reason: string; 
    }) => {
      const { data, error } = await supabase.rpc('flag_content', {
        p_content_type: contentType,
        p_content_id: contentId,
        p_reason: reason,
      });

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      if (data.error) {
        toast({
          title: "Error",
          description: data.error,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Content Flagged",
          description: "Thank you for reporting this content. We'll review it shortly.",
        });
      }
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: `Failed to flag content: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  return {
    flagContent: flagContentMutation.mutate,
    isFlagging: flagContentMutation.isPending,
  };
};

export const useAdminFlaggedContent = (status = 'pending') => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: flaggedContent = [], isLoading } = useQuery({
    queryKey: ['admin-flagged-content', status],
    queryFn: async (): Promise<FlaggedContentItem[]> => {
      const { data, error } = await supabase.rpc('admin_get_flagged_content', {
        p_status: status,
      });

      if (error) throw error;
      return data || [];
    },
  });

  const resolveFlagMutation = useMutation({
    mutationFn: async ({ flagId, action, reason }: { 
      flagId: string; 
      action: 'dismiss' | 'delete_content'; 
      reason?: string; 
    }) => {
      const { data, error } = await supabase.rpc('admin_resolve_flag', {
        p_flag_id: flagId,
        p_action: action,
        p_reason: reason || 'Resolved by admin',
      });

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-flagged-content'] });
      toast({
        title: "Success",
        description: "Flag resolved successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: `Failed to resolve flag: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  return {
    flaggedContent,
    isLoading,
    resolveFlag: resolveFlagMutation.mutate,
    isResolving: resolveFlagMutation.isPending,
  };
};
