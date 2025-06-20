
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";

interface SuggestedProfile {
  id: string;
  full_name: string;
  username: string | null;
  avatar_url: string | null;
  profile_privacy_setting: string;
  follow_status: 'following' | 'request_pending' | 'not_following';
  mutual_connections_count: number;
  suggestion_type?: string;
}

export const useSuggestedProfiles = () => {
  const { toast } = useToast();
  const { user, session, isLoading: authLoading } = useAuth();

  console.log('🔍 useSuggestedProfiles - Auth state:', {
    user: user?.id,
    session: !!session,
    authLoading,
    isEnabled: !!user?.id && !authLoading
  });

  const { data: suggestedProfiles = [], isLoading, error, refetch } = useQuery({
    queryKey: ['onboarding-suggestions', user?.id],
    queryFn: async () => {
      console.log('🚀 Starting onboarding suggestions query for user:', user?.id);
      
      if (!user?.id) {
        console.error('❌ User not authenticated for suggestions');
        throw new Error('User not authenticated');
      }

      console.log('📞 Calling get_onboarding_suggestions RPC function with user ID...');
      
      // First attempt with updated function signature
      const { data, error } = await supabase.rpc('get_onboarding_suggestions', {
        p_user_id: user.id,
        p_limit: 15
      });

      console.log('📊 Raw RPC response:', { data, error });

      if (error) {
        console.error('❌ Onboarding suggestions RPC error:', error);
        
        // If it's an authentication error, retry once after a short delay
        if (error.message?.includes('Authentication') || error.message?.includes('auth')) {
          console.log('🔄 Authentication error detected, retrying after delay...');
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          const { data: retryData, error: retryError } = await supabase.rpc('get_onboarding_suggestions', {
            p_user_id: user.id,
            p_limit: 15
          });
          
          if (retryError) {
            console.error('❌ Retry also failed:', retryError);
            throw retryError;
          }
          
          console.log('✅ Retry successful:', retryData);
          const transformedRetryData = retryData?.map((profile: any) => ({
            id: profile.user_id,
            full_name: profile.full_name,
            username: profile.username,
            avatar_url: profile.avatar_url,
            profile_privacy_setting: profile.profile_privacy_setting,
            follow_status: 'not_following' as const,
            mutual_connections_count: profile.mutual_connections_count || 0,
            suggestion_type: profile.suggestion_type
          })) || [];
          
          return transformedRetryData as SuggestedProfile[];
        }
        
        throw error;
      }

      console.log('✅ RPC call successful, processing data...');
      console.log('📋 Data details:', {
        isArray: Array.isArray(data),
        length: data?.length || 0,
        firstItem: data?.[0] || null
      });

      // Transform the data to match the expected interface
      const transformedData = data?.map((profile: any) => {
        console.log('🔄 Transforming profile:', profile);
        return {
          id: profile.user_id,
          full_name: profile.full_name,
          username: profile.username,
          avatar_url: profile.avatar_url,
          profile_privacy_setting: profile.profile_privacy_setting,
          follow_status: 'not_following' as const,
          mutual_connections_count: profile.mutual_connections_count || 0,
          suggestion_type: profile.suggestion_type
        };
      }) || [];

      console.log('✨ Final transformed data:', transformedData);
      return transformedData as SuggestedProfile[];
    },
    enabled: !!user?.id && !authLoading,
    retry: (failureCount, error) => {
      console.log('🔄 Query retry attempt:', failureCount, error);
      // Allow up to 3 retries for authentication-related errors
      if (error?.message?.includes('Authentication') || error?.message?.includes('auth')) {
        return failureCount < 3;
      }
      // For other errors, retry once
      return failureCount < 1;
    },
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 3000),
    meta: {
      onError: (error: any) => {
        console.error('❌ Query error in meta:', error);
        toast({
          title: 'Error loading suggestions',
          description: `Failed to load suggested profiles: ${error.message}`,
          variant: 'destructive',
        });
      }
    }
  });

  console.log('📤 Hook returning:', {
    profilesCount: suggestedProfiles.length,
    isLoading,
    error: error?.message,
    profiles: suggestedProfiles
  });

  return {
    suggestedProfiles,
    isLoading,
    error,
    refetch
  };
};
