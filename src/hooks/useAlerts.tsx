
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useAlerts = (userId?: string) => {
  const queryClient = useQueryClient();

  // Check for new alerts status
  const { data: alertsStatus, isLoading: isLoadingAlerts } = useQuery({
    queryKey: ['alerts-status', userId],
    queryFn: async () => {
      if (!userId) return { has_new_alerts: false };
      
      const { data, error } = await supabase.rpc('get_new_alerts_status', {
        user_id: userId
      });

      if (error) throw error;
      return data;
    },
    enabled: !!userId,
    refetchInterval: 30000, // Check every 30 seconds
  });

  // Mark alerts as viewed
  const markAlertsAsViewedMutation = useMutation({
    mutationFn: async () => {
      if (!userId) throw new Error('No user ID provided');
      
      const { error } = await supabase.rpc('mark_alerts_as_viewed', {
        user_id: userId
      });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['alerts-status', userId] });
    },
  });

  return {
    hasNewAlerts: alertsStatus?.has_new_alerts || false,
    isLoadingAlerts,
    markAlertsAsViewed: markAlertsAsViewedMutation.mutate,
    isMarkingAsViewed: markAlertsAsViewedMutation.isPending,
  };
};
