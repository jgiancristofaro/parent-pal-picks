
import { Badge } from '@/types/referral';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge as UIBadge } from '@/components/ui/badge';
import { Award, Star, Crown, Medal } from 'lucide-react';

interface BadgeDisplayProps {
  badges: Badge[];
  isOwnProfile?: boolean;
}

export const BadgeDisplay = ({ badges, isOwnProfile = false }: BadgeDisplayProps) => {
  if (badges.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="w-5 h-5" />
            {isOwnProfile ? 'My Badges' : 'Badges'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-gray-500">
            <Award className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <div className="text-sm">
              {isOwnProfile ? 'No badges yet' : 'No badges to display'}
            </div>
            {isOwnProfile && (
              <div className="text-xs">
                Refer friends to earn your first Connector badge!
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  const getBadgeIcon = (badgeType: string) => {
    switch (badgeType) {
      case 'connector_bronze':
        return <Medal className="w-6 h-6 text-orange-600" />;
      case 'connector_silver':
        return <Star className="w-6 h-6 text-gray-600" />;
      case 'connector_gold':
        return <Crown className="w-6 h-6 text-yellow-600" />;
      default:
        return <Award className="w-6 h-6 text-purple-600" />;
    }
  };

  const getBadgeColor = (badgeType: string) => {
    switch (badgeType) {
      case 'connector_bronze':
        return 'bg-orange-50 border-orange-200';
      case 'connector_silver':
        return 'bg-gray-50 border-gray-200';
      case 'connector_gold':
        return 'bg-yellow-50 border-yellow-200';
      default:
        return 'bg-purple-50 border-purple-200';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Award className="w-5 h-5" />
          {isOwnProfile ? 'My Badges' : 'Badges'}
          <UIBadge variant="secondary">{badges.length}</UIBadge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {badges.map((badge) => (
            <div
              key={badge.id}
              className={`p-4 rounded-lg border-2 ${getBadgeColor(badge.badge_type)}`}
            >
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0">
                  {getBadgeIcon(badge.badge_type)}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-gray-900 truncate">
                    {badge.badge_name}
                  </h4>
                  {badge.description && (
                    <p className="text-sm text-gray-600 mt-1">
                      {badge.description}
                    </p>
                  )}
                  <div className="text-xs text-gray-500 mt-2">
                    Earned {new Date(badge.awarded_at).toLocaleDateString()}
                  </div>
                  {badge.criteria_met && (
                    <div className="text-xs text-gray-600 mt-1">
                      {JSON.parse(badge.criteria_met).referral_count} referrals
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
