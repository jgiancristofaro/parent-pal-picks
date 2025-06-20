
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { FollowRequest, FollowRequestStatus } from '@/types/profile';
import { useToast } from '@/components/ui/use-toast';

interface PendingFollowRequest {
  request_id: string;
  requester_id: string;
  requester_full_name: string;
  requester_avatar_url: string | null;
  created_at: string;
}

export const useFollowRequests = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Get incoming follow requests using the same edge function as alerts page
  const { data: incomingRequestsData = [], isLoading: isLoadingIncoming } = useQuery({
    queryKey: ['follow-requests', 'incoming'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase.functions.invoke('get_pending_follow_requests', {
        body: {
          current_user_id: user.id
        }
      });

      if (error) throw error;
      return data as PendingFollowRequest[];
    },
  });

  // Transform the edge function data to match the expected format
  const incomingRequests = incomingRequestsData.map(request => ({
    id: request.request_id,
    requester_id: request.requester_id,
    requestee_id: '', // Not needed for incoming requests
    status: 'pending' as const,
    created_at: request.created_at,
    updated_at: request.created_at,
    requester: {
      id: request.requester_id,
      full_name: request.requester_full_name,
      username: '', // Not provided by edge function but not needed for display
      avatar_url: request.requester_avatar_url
    }
  }));

  // Get outgoing follow requests with simplified query
  const { data: outgoingRequests = [], isLoading: isLoadingOutgoing, error: outgoingError } = useQuery({
    queryKey: ['follow-requests', 'outgoing'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      console.log('Fetching outgoing requests for user:', user.id);

      // First get the follow requests
      const { data: requests, error: requestsError } = await supabase
        .from('follow_requests')
        .select('*')
        .eq('requester_id', user.id)
        .order('created_at', { ascending: false });

      if (requestsError) {
        console.error('Error fetching follow requests:', requestsError);
        throw requestsError;
      }

      console.log('Raw follow requests:', requests);

      if (!requests || requests.length === 0) {
        console.log('No follow requests found');
        return [];
      }

      // Get the requestee IDs to fetch profile information
      const requesteeIds = requests.map(req => req.requestee_id);
      console.log('Requestee IDs:', requesteeIds);

      // Fetch requestee profiles separately
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('id, full_name, username, avatar_url')
        .in('id', requesteeIds);

      if (profilesError) {
        console.error('Error fetching profiles:', profilesError);
        throw profilesError;
      }

      console.log('Requestee profiles:', profiles);

      // Create a map for easy lookup
      const profilesMap = new Map();
      (profiles || []).forEach(profile => {
        profilesMap.set(profile.id, profile);
      });

      // Combine the data
      const combinedData = requests.map(request => ({
        ...request,
        requestee: profilesMap.get(request.requestee_id) || {
          id: request.requestee_id,
          full_name: 'Unknown User',
          username: 'unknown',
          avatar_url: null
        }
      }));

      console.log('Combined outgoing requests data:', combinedData);
      return combinedData as (FollowRequest & { requestee: any })[];
    },
    retry: 2,
    staleTime: 30000, // 30 seconds
  });

  // Log any errors
  if (outgoingError) {
    console.error('Outgoing requests query error:', outgoingError);
  }

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

  // Cancel follow request
  const cancelFollowRequestMutation = useMutation({
    mutationFn: async (requesteeId: string) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      console.log('Attempting to cancel follow request from user:', user.id, 'to target:', requesteeId);

      // Use direct database query instead of edge function
      const { data, error } = await supabase
        .from('follow_requests')
        .delete()
        .eq('requester_id', user.id)
        .eq('requestee_id', requesteeId)
        .eq('status', 'pending');

      if (error) {
        console.error('Database error:', error);
        throw new Error(`Failed to cancel follow request: ${error.message}`);
      }

      console.log('Successfully cancelled follow request, affected rows:', data);
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
      console.error('Cancel mutation error:', error);
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
    outgoingError,
    sendFollowRequest: sendFollowRequestMutation.mutate,
    isSendingRequest: sendFollowRequestMutation.isPending,
    cancelFollowRequest: cancelFollowRequestMutation.mutate,
    isCancellingRequest: cancelFollowRequestMutation.isPending,
  };
};
