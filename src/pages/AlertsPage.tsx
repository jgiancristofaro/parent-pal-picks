
import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Header } from "@/components/Header";
import { BottomNavigation } from "@/components/BottomNavigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useAlertsContext } from "@/contexts/AlertsContext";
import { FollowRequestItem } from "@/components/connections/FollowRequestItem";

interface PendingFollowRequest {
  request_id: string;
  requester_id: string;
  requester_full_name: string;
  requester_avatar_url: string | null;
  created_at: string;
}

const AlertsPage = () => {
  const { user } = useAuth();
  const { refreshAlerts } = useAlertsContext();

  // Mark alerts as viewed when user visits the page
  useEffect(() => {
    if (user?.id) {
      const markAsViewed = async () => {
        try {
          const { error } = await supabase.rpc('mark_alerts_as_viewed', {
            user_id: user.id
          });
          if (error) throw error;
          refreshAlerts();
        } catch (error) {
          console.error('Error marking alerts as viewed:', error);
        }
      };
      markAsViewed();
    }
  }, [user?.id, refreshAlerts]);

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

  // Transform data to match FollowRequestItem expected format
  const transformedRequests = pendingRequests.map(request => ({
    id: request.request_id,
    requester_id: request.requester_id,
    requester: {
      full_name: request.requester_full_name,
      avatar_url: request.requester_avatar_url
    },
    created_at: request.created_at
  }));

  const hasAnyAlerts = pendingRequests.length > 0;

  return (
    <div className="min-h-screen pb-20 bg-gray-50">
      <Header title="Alerts" showBack={true} showSettings={false} />
      
      <div className="px-4 py-6 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Notifications Center</CardTitle>
            <CardDescription>
              Stay updated with all your important alerts and notifications
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!hasAnyAlerts && (
              <div className="text-center py-8 text-gray-500">
                You have no new alerts.
              </div>
            )}
          </CardContent>
        </Card>

        {/* Follow Requests Section */}
        <Card>
          <CardHeader>
            <CardTitle>Follow Requests</CardTitle>
            <CardDescription>
              Manage pending follow requests from other parents
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-4">Loading...</div>
            ) : pendingRequests.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No pending follow requests
              </div>
            ) : (
              <div className="space-y-4">
                {transformedRequests.map((request) => (
                  <FollowRequestItem key={request.id} request={request} />
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      
      <BottomNavigation />
    </div>
  );
};

export default AlertsPage;
