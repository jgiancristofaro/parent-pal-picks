
import { useEffect } from "react";
import { Header } from "@/components/Header";
import { BottomNavigation } from "@/components/BottomNavigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FollowRequestsManagement } from "@/components/settings/FollowRequestsManagement";
import { useAuth } from "@/contexts/AuthContext";
import { useAlerts } from "@/hooks/useAlerts";

const Alerts = () => {
  const { user } = useAuth();
  const { markAlertsAsViewed } = useAlerts(user?.id);

  // Mark alerts as viewed when user visits the page
  useEffect(() => {
    if (user?.id) {
      markAlertsAsViewed();
    }
  }, [user?.id, markAlertsAsViewed]);

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
            <div className="text-center py-4 text-gray-600">
              All your alerts and notifications will appear here.
            </div>
          </CardContent>
        </Card>

        {/* Follow Requests - This is our main alert type for now */}
        <FollowRequestsManagement />
      </div>
      
      <BottomNavigation />
    </div>
  );
};

export default Alerts;
