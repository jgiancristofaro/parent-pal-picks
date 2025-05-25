
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export const useActivityFeedTracking = (userId?: string) => {
  useEffect(() => {
    const markAsViewed = async () => {
      if (!userId) return;
      
      try {
        const { error } = await supabase.rpc('update_activity_feed_view');
        if (error) {
          console.error('Error updating activity feed view timestamp:', error);
        } else {
          console.log('Activity feed view timestamp updated');
        }
      } catch (err) {
        console.error('Error in markAsViewed:', err);
      }
    };

    // Mark as viewed when the component mounts (user visits activity feed)
    markAsViewed();
  }, [userId]);
};
