
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
}

export const useSuggestedProfiles = () => {
  const { toast } = useToast();
  const { user } = useAuth();

  const { data: suggestedProfiles = [], isLoading, error, refetch } = useQuery({
    queryKey: ['onboarding-suggestions', user?.id],
    queryFn: async () => {
      if (!user?.id) {
        throw new Error('User not authenticated');
      }

      const { data, error } = await supabase.rpc('get_onboarding_suggestions', {
        p_user_id: user.id,
        p_limit: 15
      });

      if (error) {
        console.error('Onboarding suggestions error:', error);
        throw error;
      }

      // Transform the data to match the expected interface
      const transformedData = data?.map((profile: any) => ({
        id: profile.user_id,
        full_name: profile.full_name,
        username: profile.username,
        avatar_url: profile.avatar_url,
        profile_privacy_setting: profile.profile_privacy_setting,
        follow_status: 'not_following' as const,
        mutual_connections_count: profile.mutual_connections_count || 0
      })) || [];

      return transformedData as SuggestedProfile[];
    },
    enabled: !!user?.id,
    meta: {
      onError: (error: any) => {
        toast({
          title: 'Error loading suggestions',
          description: 'There was an error loading suggested profiles.',
          variant: 'destructive',
        });
      }
    }
  });

  return {
    suggestedProfiles,
    isLoading,
    error,
    refetch
  };
};
