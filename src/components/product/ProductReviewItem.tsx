
import React from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { StarIcon } from "@/components/StarIcon";
import { EditReviewButton } from "@/components/review/EditReviewButton";
import { FlagButton } from "@/components/moderation/FlagButton";
import { useAuth } from "@/contexts/AuthContext";

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

interface ProductReviewItemProps {
  review: Review;
  productId: string;
}

export const ProductReviewItem = ({ review, productId }: ProductReviewItemProps) => {
  const { user } = useAuth();

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const renderStarRating = (rating: number) => {
    return (
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <StarIcon
            key={star}
            filled={star <= rating}
            className="w-4 h-4 text-yellow-500"
          />
        ))}
      </div>
    );
  };

  return (
    <div className="border-b border-gray-100 pb-6 last:border-b-0">
      <div className="flex items-start space-x-4">
        <Avatar className="w-12 h-12">
          <AvatarImage 
            src={review.profiles.avatar_url || undefined} 
            alt={review.profiles.full_name} 
          />
          <AvatarFallback>
            {review.profiles.full_name?.charAt(0) || 'U'}
          </AvatarFallback>
        </Avatar>
        
        <div className="flex-1 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="font-semibold">{review.profiles.full_name}</span>
              {review.has_verified_experience && (
                <Badge variant="default" className="bg-green-100 text-green-800 text-xs">
                  Verified Experience
                </Badge>
              )}
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-500">
                {formatDate(review.created_at)}
              </span>
              {user && review.user_id === user.id ? (
                <EditReviewButton
                  reviewId={review.id}
                  rating={review.rating}
                  title={review.title}
                  content={review.content}
                  productId={productId}
                />
              ) : user && (
                <FlagButton
                  contentType="review"
                  contentId={review.id}
                  size="sm"
                  variant="ghost"
                />
              )}
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            {renderStarRating(review.rating)}
            <span className="text-sm font-medium">{review.rating}/5</span>
          </div>
          
          <h4 className="font-semibold text-gray-900">{review.title}</h4>
          <p className="text-gray-700 leading-relaxed">{review.content}</p>
        </div>
      </div>
    </div>
  );
};
