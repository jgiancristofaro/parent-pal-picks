
import React from "react";
import { ProductReviewItem } from "./ProductReviewItem";

interface Review {
  id: string;
  rating: number;
  title: string;
  content: string;
  has_verified_experience: boolean;
  created_at: string;
  user_id: string;
  profiles: {
    id: string;
    full_name: string;
    avatar_url: string | null;
  };
}

interface ProductReviewsListProps {
  reviews: Review[];
  productId: string;
  filter: 'all' | 'following';
}

export const ProductReviewsList = ({ reviews, productId, filter }: ProductReviewsListProps) => {
  if (reviews.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">
          {filter === 'following' 
            ? "No reviews from people you follow yet" 
            : "No reviews yet"
          }
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {reviews.map((review) => (
        <ProductReviewItem
          key={review.id}
          review={review}
          productId={productId}
        />
      ))}
    </div>
  );
};
