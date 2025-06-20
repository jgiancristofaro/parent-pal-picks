
import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

export const useFollowRequestActions = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // Local state to track which requests should show Follow Back button
  const [showFollowBack, setShowFollowBack] = useState<Set<string>>(new Set());

  const respondToRequestMutation = useMutation({
    mutationFn: async ({ requestId, action }: { requestId: string; action: 'approve' | 'deny' }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase.functions.invoke('respond_to_follow_request', {
        body: {
          request_id: requestId,
          current_user_id: user.id,
          response_action: action
        }
      });

      if (error) throw error;
      return { data, requestId, action };
    },
    onSuccess: ({ data, requestId, action }) => {
      if (action === 'approve' && data.follow_back_status === 'not_following') {
        // Add to Follow Back state, don't invalidate queries yet
        setShowFollowBack(prev => new Set(prev).add(requestId));
        toast({
          title: 'Follow request approved',
          description: 'The user can now follow you and see your activity.',
        });
      } else {
        // For deny or when already following, invalidate immediately
        queryClient.invalidateQueries({ queryKey: ['follow-requests'] });
        queryClient.invalidateQueries({ queryKey: ['pending-follow-requests'] });
        queryClient.invalidateQueries({ queryKey: ['user-follows'] });
        toast({
          title: action === 'approve' ? 'Follow request approved' : 'Follow request denied',
          description: action === 'approve' 
            ? 'The user can now follow you and see your activity.' 
            : 'The follow request has been denied.',
        });
      }
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: 'Failed to respond to follow request.',
        variant: 'destructive',
      });
    },
  });

  const followBackMutation = useMutation({
    mutationFn: async (targetUserId: string) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase.functions.invoke('request_follow', {
        body: {
          current_user_id: user.id,
          target_user_id: targetUserId,
        }
      });

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      // Now invalidate all queries to remove the item
      queryClient.invalidateQueries({ queryKey: ['follow-requests'] });
      queryClient.invalidateQueries({ queryKey: ['pending-follow-requests'] });
      queryClient.invalidateQueries({ queryKey: ['user-follows'] });
      toast({
        title: 'Follow back successful',
        description: 'You are now following each other!',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error following back',
        description: 'Failed to follow back. Please try again.',
        variant: 'destructive',
      });
    },
  });

  return {
    showFollowBack,
    respondToRequest: respondToRequestMutation.mutate,
    isRespondingToRequest: respondToRequestMutation.isPending,
    followBack: followBackMutation.mutate,
    isFollowingBack: followBackMutation.isPending,
  };
};
