
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
    <Card className="bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <h3 className="text-xl font-bold mb-2">Invite Friends to ParentPal</h3>
            <p className="text-purple-100 mb-4">
              Share ParentPal with friends and earn Connector badges when they join!
            </p>
            {referralStats?.referral_code && (
              <p className="text-sm text-purple-200">
                Your referral code: <span className="font-mono font-bold">{referralStats.referral_code}</span>
              </p>
            )}
          </div>
          <div className="ml-4">
            <Button
              onClick={handleInviteFriends}
              variant="secondary"
              size="lg"
              className="bg-white text-purple-600 hover:bg-purple-50"
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
