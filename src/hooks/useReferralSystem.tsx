
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { Badge, ReferralStats } from '@/types/referral';

export const useReferralStats = (userId?: string) => {
  return useQuery({
    queryKey: ['referral-stats', userId],
    queryFn: async () => {
      if (!userId) throw new Error('User ID is required');

      // Get user's referral code and stats
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('referral_code')
        .eq('id', userId)
        .single();

      if (profileError) throw profileError;

      // Count referrals made by this user
      const { count: referralCount, error: countError } = await supabase
        .from('profiles')
        .select('id', { count: 'exact', head: true })
        .eq('referred_by_user_id', userId);

      if (countError) throw countError;

      // Get user's badges
      const { data: badges, error: badgesError } = await supabase
        .from('badges')
        .select('*')
        .eq('user_id', userId)
        .order('awarded_at', { ascending: false });

      if (badgesError) throw badgesError;

      return {
        total_referrals: referralCount || 0,
        referral_code: profile.referral_code,
        badges: badges as Badge[]
      } as ReferralStats;
    },
    enabled: !!userId,
  });
};

export const useValidateReferralCode = () => {
  return useMutation({
    mutationFn: async (referralCode: string) => {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, full_name')
        .eq('referral_code', referralCode.toUpperCase())
        .single();

      if (error) throw error;
      return data;
    },
  });
};

export const useAwardBadges = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const { error } = await supabase.rpc('award_connector_badges');
      if (error) throw error;
    },
    onSuccess: () => {
      toast({
        title: 'Success',
        description: 'Badges have been awarded successfully!',
      });
      queryClient.invalidateQueries({ queryKey: ['referral-stats'] });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: 'Failed to award badges: ' + error.message,
        variant: 'destructive',
      });
    },
  });
};
