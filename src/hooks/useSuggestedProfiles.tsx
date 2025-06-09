
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

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

  const { data: suggestedProfiles = [], isLoading, error, refetch } = useQuery({
    queryKey: ['suggested-profiles'],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('get_suggested_profiles');

      if (error) {
        console.error('Suggested profiles error:', error);
        throw error;
      }

      return data as SuggestedProfile[];
    },
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
