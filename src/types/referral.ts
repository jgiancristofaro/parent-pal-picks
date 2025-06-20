
export interface Badge {
  id: string;
  user_id: string;
  badge_type: string;
  badge_name: string;
  description: string | null;
  criteria_met: any;
  awarded_at: string;
  created_at: string;
}

export interface ReferralStats {
  total_referrals: number;
  referral_code: string;
  badges: Badge[];
}
