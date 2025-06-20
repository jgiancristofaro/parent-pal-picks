
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Check, X } from "lucide-react";

interface PendingFollowRequest {
  request_id: string;
  requester_id: string;
  requester_full_name: string;
  requester_avatar_url: string | null;
  created_at: string;
}

export const FollowRequestsManagement = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch pending follow requests
  const { data: pendingRequests = [], isLoading } = useQuery({
    queryKey: ['pending-follow-requests'],
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
      return data;
    },
    onSuccess: (_, { action }) => {
      queryClient.invalidateQueries({ queryKey: ['pending-follow-requests'] });
      toast({
        title: action === 'approve' ? 'Follow request approved' : 'Follow request denied',
        description: action === 'approve' 
          ? 'The user can now follow you and see your activity.' 
          : 'The follow request has been denied.',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: 'Failed to respond to follow request.',
        variant: 'destructive',
      });
    },
  });

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Follow Requests</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4">Loading...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Follow Requests</CardTitle>
        <CardDescription>
          Manage pending follow requests from other parents
        </CardDescription>
      </CardHeader>
      <CardContent>
        {pendingRequests.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No pending follow requests
          </div>
        ) : (
          <div className="space-y-4">
            {pendingRequests.map((request) => (
              <div key={request.request_id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={request.requester_avatar_url || undefined} />
                    <AvatarFallback>
                      {request.requester_full_name.split(' ').map(n => n[0]).join('').toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h4 className="font-medium">{request.requester_full_name}</h4>
                    <p className="text-sm text-gray-500">
                      {new Date(request.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                
                <div className="flex space-x-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => respondToRequestMutation.mutate({ 
                      requestId: request.request_id, 
                      action: 'deny' 
                    })}
                    disabled={respondToRequestMutation.isPending}
                  >
                    <X size={16} />
                    Deny
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => respondToRequestMutation.mutate({ 
                      requestId: request.request_id, 
                      action: 'approve' 
                    })}
                    disabled={respondToRequestMutation.isPending}
                  >
                    <Check size={16} />
                    Approve
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
