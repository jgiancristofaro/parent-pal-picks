
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

interface ActivitySummary {
  activity_count: number;
  most_recent_user_name: string | null;
  most_recent_activity: string | null;
}

export const useActivityNotifications = (userId: string) => {
  const [notificationData, setNotificationData] = useState<ActivitySummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const checkForNewActivity = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const { data, error } = await supabase.rpc('get_recent_activity_summary', {
        user_id: userId
      });

      if (error) {
        console.error('Error fetching activity summary:', error);
        setError(error.message);
        return;
      }

      if (data && data.length > 0) {
        const summary = data[0] as ActivitySummary;
        if (summary.activity_count > 0) {
          setNotificationData(summary);
        } else {
          setNotificationData(null);
        }
      } else {
        setNotificationData(null);
      }
    } catch (err) {
      console.error('Error in checkForNewActivity:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setIsLoading(false);
    }
  };

  const markActivityFeedAsViewed = async () => {
    try {
      const { error } = await supabase.rpc('update_activity_feed_view');
      if (error) {
        console.error('Error updating activity feed view:', error);
      }
    } catch (err) {
      console.error('Error in markActivityFeedAsViewed:', err);
    }
  };

  const getNotificationMessage = (): string | null => {
    if (!notificationData || notificationData.activity_count === 0) {
      return null;
    }

    const { activity_count, most_recent_user_name, most_recent_activity } = notificationData;

    if (activity_count === 1 && most_recent_user_name && most_recent_activity) {
      return `${most_recent_user_name} just ${most_recent_activity}`;
    } else if (activity_count > 1 && most_recent_user_name) {
      return `You have ${activity_count} new updates from friends. ${most_recent_user_name} recently ${most_recent_activity || 'shared an update'}`;
    } else {
      return `You have ${activity_count} new update${activity_count > 1 ? 's' : ''} from friends`;
    }
  };

  useEffect(() => {
    if (userId) {
      checkForNewActivity();
    }
  }, [userId]);

  return {
    notificationMessage: getNotificationMessage(),
    hasNewActivity: notificationData ? notificationData.activity_count > 0 : false,
    isLoading,
    error,
    markActivityFeedAsViewed,
    refreshNotifications: checkForNewActivity
  };
};
