
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
      
      try {
        const { data, error } = await supabase
          .rpc('get_connection_suggestions', {
            p_user_id: user.id,
            p_page_number: pageNumber,
            p_page_size: pageSize
          });

        if (error) {
          console.error('❌ Connection suggestions RPC error:', {
            message: error.message,
            details: error.details,
            hint: error.hint,
            code: error.code
          });
          throw new Error(`Connection suggestions failed: ${error.message}`);
        }

        console.log('✅ Connection suggestions loaded successfully:', data?.length || 0);
        console.log('📊 Sample suggestions:', data?.slice(0, 2));
        
        // Type cast the follow_status to ensure it matches our interface
        return (data || []).map(item => ({
          ...item,
          follow_status: item.follow_status as 'following' | 'not_following' | 'request_pending'
        }));
      } catch (error: any) {
        console.error('🚨 Connection suggestions query failed:', error);
        // Re-throw with more context for better debugging
        throw new Error(`Failed to load connection suggestions: ${error.message || 'Unknown error'}`);
      }
    },
    enabled: !!user?.id,
    retry: (failureCount, error) => {
      console.log('🔄 Retrying connection suggestions query:', {
        attempt: failureCount + 1,
        error: error?.message,
        willRetry: failureCount < 3
      });
      return failureCount < 3;
    },
    retryDelay: (attemptIndex) => {
      // Exponential backoff: 1s, 2s, 4s
      const delay = Math.min(1000 * Math.pow(2, attemptIndex), 10000);
      console.log(`⏳ Retrying in ${delay}ms (attempt ${attemptIndex + 1})`);
      return delay;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    meta: {
      onError: (error: any) => {
        console.error('❌ Connection suggestions query error in meta:', {
          message: error.message,
          stack: error.stack
        });
      }
    }
  });
};
