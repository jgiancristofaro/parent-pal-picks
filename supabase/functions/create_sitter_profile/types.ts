
export interface CreateSitterProfileRequest {
  first_name: string;
  last_name: string;
  email?: string;
  phone_number?: string;
  user_id: string;
}

export interface SitterData {
  name: string;
  email: string | null;
  phone_number: string | null;
  phone_number_searchable: boolean;
  rating: number;
  review_count: number;
  created_by_user_id: string;
  profile_image_url: string;
}
