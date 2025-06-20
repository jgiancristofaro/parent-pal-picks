
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
      
      // Mock implementation until database schema is updated
      // In the future, this will fetch from profiles table with referral_code column
      return {
        total_referrals: 0,
        referral_code: `REF${userId.slice(0, 6).toUpperCase()}`,
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
      
      // Mock implementation until badges table is created
      // In the future, this will query the badges table
      return [] as Badge[];
    },
    enabled: !!userId,
  });
};

export const useValidateReferralCode = () => {
  return useMutation({
    mutationFn: async (referralCode: string) => {
      console.log('Validating referral code:', referralCode);
      
      // Mock validation until referral system is fully implemented
      // In the future, this will check profiles table for referral_code
      if (referralCode === 'DEMO1234') {
        return { id: 'demo-user', full_name: 'Demo User' };
      }
      
      throw new Error('Invalid referral code');
    },
  });
};

export const useAwardBadges = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      console.log('Awarding badges...');
      
      // Mock implementation until database function is created
      // In the future, this will call the award_connector_badges function
      return { success: true };
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
