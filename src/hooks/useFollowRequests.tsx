
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { FollowRequest, FollowRequestStatus } from '@/types/profile';
import { useToast } from '@/components/ui/use-toast';

export const useFollowRequests = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Get incoming follow requests (requests made to current user)
  const { data: incomingRequests = [], isLoading: isLoadingIncoming } = useQuery({
    queryKey: ['follow-requests', 'incoming'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('follow_requests')
        .select(`
          *,
          requester:requester_id (
            id,
            full_name,
            username,
            avatar_url
          )
        `)
        .eq('status', 'pending');

      if (error) throw error;
      return data as (FollowRequest & { requester: any })[];
    },
  });

  // Get outgoing follow requests (requests current user made)
  const { data: outgoingRequests = [], isLoading: isLoadingOutgoing } = useQuery({
    queryKey: ['follow-requests', 'outgoing'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('follow_requests')
        .select(`
          *,
          requestee:requestee_id (
            id,
            full_name,
            username,
            avatar_url
          )
        `);

      if (error) throw error;
      return data as (FollowRequest & { requestee: any })[];
    },
  });

  // Send follow request
  const sendFollowRequestMutation = useMutation({
    mutationFn: async (requesteeId: string) => {
      const { data, error } = await supabase
        .from('follow_requests')
        .insert({
          requestee_id: requesteeId,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['follow-requests'] });
      toast({
        title: 'Follow request sent',
        description: 'Your follow request has been sent.',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error sending follow request',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  // Respond to follow request (approve/deny)
  const respondToFollowRequestMutation = useMutation({
    mutationFn: async ({ requestId, status }: { requestId: string; status: 'approved' | 'denied' }) => {
      const { data, error } = await supabase
        .from('follow_requests')
        .update({ status })
        .eq('id', requestId)
        .select()
        .single();

      if (error) throw error;

      // If approved, create the follow relationship
      if (status === 'approved') {
        const request = data as FollowRequest;
        const { error: followError } = await supabase
          .from('user_follows')
          .insert({
            follower_id: request.requester_id,
            following_id: request.requestee_id,
          });

        if (followError) throw followError;
      }

      return data;
    },
    onSuccess: (_, { status }) => {
      queryClient.invalidateQueries({ queryKey: ['follow-requests'] });
      queryClient.invalidateQueries({ queryKey: ['user-follows'] });
      toast({
        title: status === 'approved' ? 'Follow request approved' : 'Follow request denied',
        description: status === 'approved' 
          ? 'You are now following each other!' 
          : 'Follow request has been denied.',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error responding to follow request',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  // Cancel follow request
  const cancelFollowRequestMutation = useMutation({
    mutationFn: async (requestId: string) => {
      const { error } = await supabase
        .from('follow_requests')
        .delete()
        .eq('id', requestId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['follow-requests'] });
      toast({
        title: 'Follow request cancelled',
        description: 'Your follow request has been cancelled.',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error cancelling follow request',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  return {
    incomingRequests,
    outgoingRequests,
    isLoadingIncoming,
    isLoadingOutgoing,
    sendFollowRequest: sendFollowRequestMutation.mutate,
    isSendingRequest: sendFollowRequestMutation.isPending,
    respondToFollowRequest: respondToFollowRequestMutation.mutate,
    isRespondingToRequest: respondToFollowRequestMutation.isPending,
    cancelFollowRequest: cancelFollowRequestMutation.mutate,
    isCancellingRequest: cancelFollowRequestMutation.isPending,
  };
};
