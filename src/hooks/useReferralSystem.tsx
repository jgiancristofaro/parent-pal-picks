
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
      
      // Get user's referral code from profile
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('referral_code')
        .eq('id', userId)
        .single();

      if (profileError) {
        console.error('Error fetching profile:', profileError);
        // Return mock data for now
        return {
          total_referrals: 0,
          referral_code: 'DEMO1234',
          badges: []
        } as ReferralStats;
      }

      // Count successful referrals
      const { count: referralCount, error: countError } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .eq('referred_by_user_id', userId);

      if (countError) {
        console.error('Error counting referrals:', countError);
      }

      return {
        total_referrals: referralCount || 0,
        referral_code: profile.referral_code || 'GENERATING...',
        badges: []
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
        console.error('Error fetching badges:', error);
        return [];
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
      
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('id, full_name')
        .eq('referral_code', referralCode)
        .single();

      if (error || !profile) {
        throw new Error('Invalid referral code');
      }

      return profile;
    },
  });
};

export const useAwardBadges = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      console.log('Awarding badges...');
      
      const { data, error } = await supabase.rpc('award_connector_badges');
      
      if (error) {
        throw error;
      }
      
      return data;
    },
    onSuccess: () => {
      toast({
        title: 'Success',
        description: 'Badges have been awarded successfully!',
      });
      queryClient.invalidateQueries({ queryKey: ['user-badges'] });
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
