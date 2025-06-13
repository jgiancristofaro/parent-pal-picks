
export interface AdminSitter {
  id: string;
  name: string;
  profile_image_url: string | null;
  bio: string | null;
  experience: string | null;
  hourly_rate: number | null;
  phone_number: string | null;
  email: string | null;
  certifications: string[] | null;
  rating: number | null;
  review_count: number;
  is_verified: boolean;
  created_at: string;
  updated_at: string;
}

export interface AdminReview {
  id: string;
  user_id: string;
  user_full_name: string;
  rating: number;
  title: string;
  content: string;
  created_at: string;
  updated_at: string;
}

export interface UseAdminSittersProps {
  searchTerm?: string;
  page?: number;
  pageSize?: number;
}
