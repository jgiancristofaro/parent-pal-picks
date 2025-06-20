
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

interface ConnectionSuggestion {
  user_id: string;
  full_name: string;
  username: string | null;
  avatar_url: string | null;
  profile_privacy_setting: string;
  mutual_connections_count: number;
  follow_status: 'following' | 'not_following' | 'request_pending';
}

export const useConnectionSuggestions = (pageNumber: number = 1, pageSize: number = 20) => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['connection-suggestions', user?.id, pageNumber, pageSize],
    queryFn: async (): Promise<ConnectionSuggestion[]> => {
      if (!user?.id) return [];
      
      console.log('🔍 Fetching connection suggestions for user:', user.id, 'page:', pageNumber);
      
      const { data, error } = await supabase
        .rpc('get_connection_suggestions', {
          p_user_id: user.id,
          p_page_number: pageNumber,
          p_page_size: pageSize
        });

      if (error) {
        console.error('❌ Error fetching connection suggestions:', error);
        throw error;
      }

      console.log('✅ Connection suggestions found:', data?.length || 0);
      console.log('📊 Suggestions data sample:', data?.slice(0, 2));
      
      // Type cast the follow_status to ensure it matches our interface
      return (data || []).map(item => ({
        ...item,
        follow_status: item.follow_status as 'following' | 'not_following' | 'request_pending'
      }));
    },
    enabled: !!user?.id,
    retry: (failureCount, error) => {
      console.log('🔄 Retrying connection suggestions query:', failureCount, error);
      return failureCount < 2;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    meta: {
      onError: (error: any) => {
        console.error('❌ Connection suggestions query error:', error);
      }
    }
  });
};
