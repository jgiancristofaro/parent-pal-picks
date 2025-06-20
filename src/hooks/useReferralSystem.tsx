
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { Badge, ReferralStats } from '@/types/referral';

export const useReferralStats = (userId?: string) => {
  return useQuery({
    queryKey: ['referral-stats', userId],
    queryFn: async () => {
      if (!userId) throw new Error('User ID is required');

      console.log('Getting referral stats for user:', userId);
      
      // Get user's referral code and referral count
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('referral_code')
        .eq('id', userId)
        .single();

      if (profileError) {
        console.error('Error fetching user profile:', profileError);
        throw profileError;
      }

      // Get referral count
      const { count: totalReferrals, error: referralsError } = await supabase
        .from('user_referrals')
        .select('*', { count: 'exact', head: true })
        .eq('referrer_id', userId);

      if (referralsError) {
        console.error('Error fetching referrals count:', referralsError);
        throw referralsError;
      }

      // Get badges
      const { data: badges, error: badgesError } = await supabase
        .from('badges')
        .select('*')
        .eq('user_id', userId);

      if (badgesError) {
        console.error('Error fetching badges:', badgesError);
        throw badgesError;
      }

      return {
        total_referrals: totalReferrals || 0,
        referral_code: profile.referral_code || '',
        badges: badges || []
      } as ReferralStats;
    },
    enabled: !!userId,
  });
};

export const useUserBadges = (userId?: string) => {
  return useQuery({
    queryKey: ['user-badges', userId],
    queryFn: async () => {
      if (!userId) throw new Error('User ID is required');

      console.log('Getting badges for user:', userId);
      
      const { data: badges, error } = await supabase
        .from('badges')
        .select('*')
        .eq('user_id', userId)
        .order('awarded_at', { ascending: false });

      if (error) {
        console.error('Error fetching user badges:', error);
        throw error;
      }

      return badges as Badge[];
    },
    enabled: !!userId,
  });
};

export const useValidateReferralCode = () => {
  return useMutation({
    mutationFn: async (referralCode: string) => {
      console.log('Validating referral code:', referralCode);
      
      const { data, error } = await supabase.rpc('validate_referral_code', {
        p_referral_code: referralCode
      });

      if (error) {
        console.error('Error validating referral code:', error);
        throw new Error('Failed to validate referral code');
      }

      if (!data || data.length === 0) {
        throw new Error('Invalid referral code');
      }

      return {
        id: data[0].user_id,
        full_name: data[0].full_name
      };
    },
  });
};

export const useAwardBadges = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (userId: string) => {
      console.log('Awarding badges for user:', userId);
      
      const { data, error } = await supabase.rpc('award_connector_badges', {
        p_user_id: userId
      });

      if (error) {
        console.error('Error awarding badges:', error);
        throw error;
      }

      return data;
    },
    onSuccess: (data, userId) => {
      if (data.badge_awarded) {
        toast({
          title: 'Congratulations!',
          description: 'You\'ve earned a new Connector badge for your referrals!',
        });
      }
      queryClient.invalidateQueries({ queryKey: ['user-badges', userId] });
      queryClient.invalidateQueries({ queryKey: ['referral-stats', userId] });
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
