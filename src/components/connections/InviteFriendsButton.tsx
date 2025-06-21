
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Send, Share2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useReferralStats } from '@/hooks/useReferralSystem';
import { useToast } from '@/components/ui/use-toast';

export const InviteFriendsButton = () => {
  const { user } = useAuth();
  const { data: referralStats } = useReferralStats(user?.id);
  const { toast } = useToast();

  const handleInviteFriends = async () => {
    if (!referralStats?.referral_code) {
      toast({
        title: 'Error',
        description: 'Referral code not available yet. Please try again later.',
        variant: 'destructive',
      });
      return;
    }

    const referralUrl = `${window.location.origin}/signup?ref=${referralStats.referral_code}`;
    const shareText = `Join me on ParentPal - the parent community app! Use my referral code: ${referralStats.referral_code}`;

    // Try to use the Web Share API first
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Join ParentPal',
          text: shareText,
          url: referralUrl,
        });
        
        toast({
          title: 'Shared successfully!',
          description: 'Your referral link has been shared.',
        });
      } catch (error) {
        // User cancelled the share, or share failed
        if (error.name !== 'AbortError') {
          // Fallback to clipboard
          await fallbackToClipboard(referralUrl, shareText);
        }
      }
    } else {
      // Fallback to clipboard if Web Share API is not supported
      await fallbackToClipboard(referralUrl, shareText);
    }
  };

  const fallbackToClipboard = async (url: string, text: string) => {
    try {
      await navigator.clipboard.writeText(`${text}\n\n${url}`);
      toast({
        title: 'Copied to clipboard!',
        description: 'Your referral message has been copied. Share it anywhere!',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Unable to share or copy. Please try again.',
        variant: 'destructive',
      });
    }
  };

  return (
    <Card className="bg-purple-50 border-purple-200">
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex-1 space-y-3">
            <h3 className="text-xl font-bold text-gray-900">Invite Friends to ParentPal</h3>
            <p className="text-gray-700 text-sm md:text-base">
              Share ParentPal with friends and earn Connector badges when they join!
            </p>
            {referralStats?.referral_code && (
              <div className="bg-white rounded-lg p-3 border border-purple-200">
                <p className="text-sm text-gray-600 mb-1">Your referral code:</p>
                <p className="font-mono font-bold text-purple-600 text-lg">
                  {referralStats.referral_code}
                </p>
              </div>
            )}
          </div>
          <div className="flex-shrink-0">
            <Button
              onClick={handleInviteFriends}
              size="lg"
              className="w-full md:w-auto bg-purple-600 hover:bg-purple-700 text-white"
              disabled={!referralStats?.referral_code}
            >
              <Send className="w-5 h-5 mr-2" />
              Invite Friends
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
