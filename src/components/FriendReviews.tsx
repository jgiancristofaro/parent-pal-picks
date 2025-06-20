
import React from "react";
import { StarIcon } from "@/components/StarIcon";
import { useFriendReviews } from "@/hooks/useFriendReviews";
import { formatDistanceToNow } from "date-fns";

interface FriendReviewsProps {
  itemType: 'product' | 'sitter';
  itemId: string;
}

export const FriendReviews = ({ itemType, itemId }: FriendReviewsProps) => {
  const { data: friendReviews = [], isLoading } = useFriendReviews(itemType, itemId);

  if (isLoading) {
    return (
      <div className="bg-purple-50 rounded-xl p-4 mb-6 border border-purple-100">
        <p className="text-purple-600 text-sm">Loading friend reviews...</p>
      </div>
    );
  }

  if (friendReviews.length === 0) {
    return null;
  }

  const renderStars = (rating: number) => {
    return Array(5).fill(0).map((_, i) => (
      <StarIcon key={i} filled={i < rating} className="w-4 h-4 text-yellow-500" />
    ));
  };

  const getRecommendationText = () => {
    if (friendReviews.length === 1) {
      return `${friendReviews[0].reviewer_full_name} recommends this`;
    } else if (friendReviews.length === 2) {
      return `${friendReviews[0].reviewer_full_name} and ${friendReviews[1].reviewer_full_name} recommend this`;
    } else {
      return `${friendReviews[0].reviewer_full_name} and ${friendReviews.length - 1} other friends recommend this`;
    }
  };

  return (
    <div className="bg-purple-50 rounded-xl p-6 mb-6 border border-purple-100">
      <div className="flex items-center mb-4">
        <div className="flex -space-x-2 mr-3">
          {friendReviews.slice(0, 3).map((review) => (
            <img
              key={review.reviewer_id}
              src={review.reviewer_avatar_url || "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=2487&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"}
              alt={review.reviewer_full_name}
              className="w-8 h-8 rounded-full border-2 border-white object-cover"
            />
          ))}
        </div>
        <div>
          <p className="text-purple-800 font-semibold text-sm">
            👥 {getRecommendationText()}
          </p>
          <p className="text-purple-600 text-xs">People you follow</p>
        </div>
      </div>

      <div className="space-y-4">
        {friendReviews.map((review) => (
          <div key={review.review_id} className="bg-white rounded-lg p-4 border border-purple-100">
            <div className="flex items-center mb-2">
              <img
                src={review.reviewer_avatar_url || "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=2487&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"}
                alt={review.reviewer_full_name}
                className="w-10 h-10 rounded-full mr-3 object-cover"
              />
              <div className="flex-grow">
                <div className="flex items-center justify-between">
                  <p className="font-semibold text-gray-900">{review.reviewer_full_name}</p>
                  <div className="flex items-center">
                    {renderStars(review.rating)}
                  </div>
                </div>
                <p className="text-xs text-gray-500">
                  {formatDistanceToNow(new Date(review.created_at), { addSuffix: true })}
                  {review.has_verified_experience && (
                    <span className="ml-2 text-green-600 font-medium">✓ Verified Experience</span>
                  )}
                </p>
              </div>
            </div>
            {review.title && (
              <h4 className="font-semibold text-gray-900 mb-1">{review.title}</h4>
            )}
            <p className="text-gray-700 text-sm">{review.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
