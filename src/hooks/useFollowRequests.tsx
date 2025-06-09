
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
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

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
        .eq('requestee_id', user.id)
        .eq('status', 'pending');

      if (error) throw error;
      return data as (FollowRequest & { requester: any })[];
    },
  });

  // Get outgoing follow requests (requests current user made)
  const { data: outgoingRequests = [], isLoading: isLoadingOutgoing } = useQuery({
    queryKey: ['follow-requests', 'outgoing'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

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
        `)
        .eq('requester_id', user.id);

      if (error) throw error;
      return data as (FollowRequest & { requestee: any })[];
    },
  });

  // Send follow request
  const sendFollowRequestMutation = useMutation({
    mutationFn: async (requesteeId: string) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase.functions.invoke('request_follow', {
        body: {
          current_user_id: user.id,
          target_user_id: requesteeId,
        }
      });

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['follow-requests'] });
      queryClient.invalidateQueries({ queryKey: ['user-follows'] });
      
      if (data.status === 'following') {
        toast({
          title: 'Now following',
          description: 'You are now following this user.',
        });
      } else {
        toast({
          title: 'Follow request sent',
          description: 'Your follow request has been sent.',
        });
      }
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
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase.functions.invoke('respond_to_follow_request', {
        body: {
          request_id: requestId,
          current_user_id: user.id,
          response_action: status === 'approved' ? 'approve' : 'deny',
        }
      });

      if (error) throw error;
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
    mutationFn: async (requesteeId: string) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      // Ensure we have a valid session
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError || !session) {
        console.error('Session error:', sessionError);
        throw new Error('Authentication session invalid. Please log in again.');
      }

      const { data, error } = await supabase.functions.invoke('cancel_follow_request', {
        body: {
          target_user_id: requesteeId,
        }
      });

      if (error) {
        console.error('Cancel request error:', error);
        
        // Handle specific error types
        if (error.message?.includes('Authentication')) {
          throw new Error('Authentication failed. Please log in again.');
        }
        
        throw error;
      }
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['follow-requests'] });
      queryClient.invalidateQueries({ queryKey: ['user-follows'] });
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
