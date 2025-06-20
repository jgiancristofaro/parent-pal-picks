
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { Badge, ReferralStats } from '@/types/referral';

export const useReferralStats = (userId?: string) => {
  return useQuery({
    queryKey: ['referral-stats', userId],
    queryFn: async () => {
      if (!userId) throw new Error('User ID is required');

      // For now, return mock data since the schema isn't fully updated yet
      console.log('Getting referral stats for user:', userId);
      
      // This will be updated once the database schema is fully migrated
      return {
        total_referrals: 0,
        referral_code: 'ABC12345', // Mock code for now
        badges: []
      } as ReferralStats;
    },
    enabled: !!userId,
  });
};

export const useValidateReferralCode = () => {
  return useMutation({
    mutationFn: async (referralCode: string) => {
      console.log('Validating referral code:', referralCode);
      
      // For now, return mock validation
      // This will be updated once the database schema is fully migrated
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
      // This will be implemented once the RPC function is available
      throw new Error('Badge awarding function not yet available');
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
