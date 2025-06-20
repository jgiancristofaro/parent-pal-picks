
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useReferralStats } from '@/hooks/useReferralSystem';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Copy, Share2, Users, Award, Construction } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

export const ReferralDashboard = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { data: referralStats, isLoading } = useReferralStats(user?.id);
  const [copied, setCopied] = useState(false);

  const referralUrl = `${window.location.origin}/signup?ref=${referralStats?.referral_code}`;

  const handleCopyReferralCode = async () => {
    if (referralStats?.referral_code) {
      await navigator.clipboard.writeText(referralStats.referral_code);
      setCopied(true);
      toast({
        title: 'Copied!',
        description: 'Referral code copied to clipboard',
      });
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleShareReferralLink = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Join ParentPal',
          text: 'Join me on ParentPal - the parent community app!',
          url: referralUrl,
        });
      } catch (error) {
        // Fallback to clipboard
        await navigator.clipboard.writeText(referralUrl);
        toast({
          title: 'Link copied!',
          description: 'Referral link copied to clipboard',
        });
      }
    } else {
      await navigator.clipboard.writeText(referralUrl);
      toast({
        title: 'Link copied!',
        description: 'Referral link copied to clipboard',
      });
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader className="animate-pulse">
              <div className="h-6 bg-gray-200 rounded w-1/2"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </CardHeader>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900">Referral Dashboard</h1>
        <p className="text-gray-600 mt-2">Invite friends and earn rewards!</p>
      </div>

      {/* Under Construction Notice */}
      <Card className="border-orange-200 bg-orange-50">
        <CardContent className="pt-6">
          <div className="flex items-center gap-3 text-orange-800">
            <Construction className="w-5 h-5" />
            <div>
              <div className="font-medium">Referral System Coming Soon!</div>
              <div className="text-sm text-orange-700">
                We're currently setting up the referral system. Check back soon for your personal referral code and tracking!
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Referral Stats */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              Your Referral Stats
            </CardTitle>
            <CardDescription>
              Track your referral progress and achievements
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600">
                {referralStats?.total_referrals || 0}
              </div>
              <div className="text-sm text-gray-600">Successful Referrals</div>
            </div>
            
            <div className="space-y-2">
              <div className="text-sm font-medium">Your Referral Code</div>
              <div className="flex gap-2">
                <Input 
                  value={referralStats?.referral_code || 'GENERATING...'} 
                  readOnly 
                  className="font-mono"
                />
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={handleCopyReferralCode}
                  disabled={!referralStats?.referral_code}
                >
                  <Copy className="w-4 h-4" />
                  {copied ? 'Copied!' : 'Copy'}
                </Button>
              </div>
            </div>

            <Button 
              onClick={handleShareReferralLink}
              className="w-full"
              disabled={!referralStats?.referral_code}
            >
              <Share2 className="w-4 h-4 mr-2" />
              Share Referral Link
            </Button>
          </CardContent>
        </Card>

        {/* Badges */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="w-5 h-5" />
              Your Badges
            </CardTitle>
            <CardDescription>
              Badges you've earned through referrals
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8 text-gray-500">
              <Award className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <div className="text-sm">No badges yet</div>
              <div className="text-xs">Refer 5 friends to earn your first badge!</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Progress towards badges */}
      <Card>
        <CardHeader>
          <CardTitle>Badge Progress</CardTitle>
          <CardDescription>See how close you are to your next achievement</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { name: 'Bronze Connector', threshold: 5, description: '5 referrals' },
              { name: 'Silver Connector', threshold: 20, description: '20 referrals' },
              { name: 'Gold Connector', threshold: 50, description: '50 referrals' },
            ].map((badge) => {
              const currentReferrals = referralStats?.total_referrals || 0;
              const progress = Math.min((currentReferrals / badge.threshold) * 100, 100);
              const hasEarned = currentReferrals >= badge.threshold;

              return (
                <div key={badge.name} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className={hasEarned ? 'text-green-600 font-medium' : ''}>
                      {badge.name} {hasEarned && '✓'}
                    </span>
                    <span className="text-gray-600">
                      {currentReferrals}/{badge.threshold} referrals
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${hasEarned ? 'bg-green-500' : 'bg-purple-500'}`}
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
