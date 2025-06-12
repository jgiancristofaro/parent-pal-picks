
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface FlaggedContent {
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

export const useAdminFlags = () => {
  const [flags, setFlags] = useState<FlaggedContent[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const fetchFlags = async (status = 'pending') => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase.rpc('admin_get_flagged_content', {
        p_status: status,
        p_limit: 50,
        p_offset: 0
      });

      if (error) {
        console.error('Error fetching flagged content:', error);
        toast({
          title: "Error",
          description: "Failed to load flagged content",
          variant: "destructive",
        });
        return;
      }

      setFlags(data || []);
      
    } catch (error) {
      console.error('Error in fetchFlags:', error);
      toast({
        title: "Error",
        description: "Failed to load flagged content",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const resolveFlag = async (flagId: string, action: 'dismiss' | 'delete_content', reason?: string) => {
    try {
      const { data, error } = await supabase.rpc('admin_resolve_flag', {
        p_flag_id: flagId,
        p_action: action,
        p_reason: reason || 'Resolved by admin'
      });

      if (error) {
        console.error('Error resolving flag:', error);
        toast({
          title: "Error",
          description: "Failed to resolve flag",
          variant: "destructive",
        });
        return false;
      }

      if (data?.success) {
        // Remove flag from local state
        setFlags(prev => prev.filter(flag => flag.flag_id !== flagId));

        toast({
          title: "Success",
          description: action === 'delete_content' ? 
            "Content deleted and flag resolved" : 
            "Flag dismissed successfully",
        });

        return true;
      }

      return false;
    } catch (error) {
      console.error('Error in resolveFlag:', error);
      return false;
    }
  };

  useEffect(() => {
    fetchFlags();
  }, []);

  return {
    flags,
    loading,
    fetchFlags,
    resolveFlag,
    refreshFlags: fetchFlags
  };
};
