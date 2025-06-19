
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

interface ProfileWithFollowStatus {
  id: string;
  full_name: string;
  username: string | null;
  avatar_url: string | null;
  profile_privacy_setting: string;
  phone_number: string | null;
  phone_number_searchable: boolean;
  bio: string | null;
  identity_tag: string | null;
  role: string;
  is_suspended: boolean;
  is_community_leader: boolean;
  created_at: string;
  updated_at: string;
  last_activity_feed_view_at: string | null;
  last_alerts_viewed_at: string | null;
  last_login_at: string | null;
  follow_status: 'following' | 'not_following' | 'request_pending' | 'own_profile';
}

export const useProfile = (userId?: string) => {
  const { user } = useAuth();
  
  // Use the provided userId or fall back to the current user's ID
  const targetUserId = userId || user?.id;
  
  return useQuery({
    queryKey: ['profile', targetUserId],
    queryFn: async (): Promise<ProfileWithFollowStatus | null> => {
      if (!targetUserId) return null;
      
      console.log('Fetching profile with follow status for user:', targetUserId);
      
      const { data, error } = await supabase
        .rpc('get_profile_with_follow_status', {
          target_user_id: targetUserId
        });

      if (error) {
        console.error('Error fetching profile with follow status:', error);
        throw error;
      }

      console.log('Profile data with follow status:', data);
      return data as unknown as ProfileWithFollowStatus;
    },
    enabled: !!targetUserId,
  });
};
