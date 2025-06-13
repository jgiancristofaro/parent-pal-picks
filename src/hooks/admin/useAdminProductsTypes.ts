
export interface AdminProduct {
  id: string;
  name: string;
  brand_name: string;
  category: string | null;
  description: string | null;
  image_url: string | null;
  price: number | null;
  external_purchase_link: string | null;
  average_rating: number | null;
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
