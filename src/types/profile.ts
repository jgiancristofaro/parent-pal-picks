
export type ProfilePrivacySetting = 'public' | 'private';
export type FollowRequestStatus = 'pending' | 'approved' | 'denied';

export interface Profile {
  id: string;
  first_name: string;
  last_name: string;
  full_name: string; // Kept for backward compatibility
  username: string | null;
  avatar_url: string | null;
  profile_privacy_setting: ProfilePrivacySetting;
  phone_number: string | null;
  phone_number_searchable: boolean;
  bio: string | null;
  identity_tag: string | null;
  role: string;
  referral_code: string;
  referred_by_user_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface FollowRequest {
  id: string;
  requester_id: string;
  requestee_id: string;
  status: FollowRequestStatus;
  created_at: string;
  updated_at: string;
}

export interface ProfileSearchResult {
  id: string;
  first_name: string;
  last_name: string;
  full_name: string;
  username: string | null;
  avatar_url: string | null;
  profile_privacy_setting: ProfilePrivacySetting;
}
