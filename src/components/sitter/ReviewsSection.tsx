
import React, { useState, useMemo } from "react";
import { ProfileSection } from "./ProfileSection";
import { useAuth } from "@/contexts/AuthContext";
import { EditReviewButton } from "@/components/review/EditReviewButton";
import { FlagContentButton } from "@/components/moderation/FlagContentButton";
import { useProfileFollowing } from "@/hooks/useProfileFollowing";
import { Button } from "@/components/ui/button";

interface Review {
  id: string;
  userId: string;
  userName: string;
  userImage: string;
  rating: number;
  date: string;
  content: string;
  title?: string;
}

interface ReviewsSectionProps {
  reviews: Review[];
  renderStars: (rating: number) => React.ReactNode;
  sitterId?: string;
}

export const ReviewsSection = ({ reviews, renderStars, sitterId }: ReviewsSectionProps) => {
  const { user } = useAuth();
  const [filter, setFilter] = useState<'all' | 'following'>('all');
  const { data: followingData = [] } = useProfileFollowing(user?.id);

  // Get array of followed user IDs
  const followedUserIds = useMemo(() => {
    return followingData.map(follow => follow.id);
  }, [followingData]);

  // Filter reviews based on current filter selection
  const filteredReviews = useMemo(() => {
    if (filter === 'following') {
      return reviews.filter(review => followedUserIds.includes(review.userId));
    }
    return reviews;
  }, [reviews, filter, followedUserIds]);

  return (
    <ProfileSection title="Reviews">
      {/* Filter Toggle */}
      <div className="flex bg-gray-100 rounded-lg p-1 mb-4">
        <Button
          variant={filter === 'all' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setFilter('all')}
          className={filter === 'all' ? 'bg-white shadow-sm' : ''}
        >
          All Parents
        </Button>
        <Button
          variant={filter === 'following' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setFilter('following')}
          className={filter === 'following' ? 'bg-white shadow-sm' : ''}
        >
          People I Follow
        </Button>
      </div>

      <div className="space-y-4">
        {filteredReviews.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">
              {filter === 'following' 
                ? "No reviews from people you follow yet" 
                : "No reviews yet"
              }
            </p>
          </div>
        ) : (
          filteredReviews.map((review) => (
            <div key={review.id} className="bg-white p-4 rounded-lg">
              <div className="flex items-center mb-3">
                <img 
                  src={review.userImage} 
                  alt={review.userName} 
                  className="w-12 h-12 rounded-full mr-3 object-cover"
                />
                <div className="flex-grow">
                  <p className="font-medium">{review.userName}</p>
                  <p className="text-gray-500 text-sm">{review.date}</p>
                </div>
                <div className="flex items-center space-x-2">
                  {user && review.userId === user.id && sitterId && (
                    <EditReviewButton
                      reviewId={review.id}
                      rating={review.rating}
                      title={review.title || ""}
                      content={review.content}
                      sitterId={sitterId}
                    />
                  )}
                  {user && review.userId !== user.id && (
                    <FlagContentButton
                      contentType="review"
                      contentId={review.id}
                    />
                  )}
                </div>
              </div>
              <div className="flex mb-2">
                {renderStars(review.rating)}
              </div>
              {review.title && (
                <h4 className="font-semibold text-gray-900 mb-2">{review.title}</h4>
              )}
              <p className="text-gray-700">{review.content}</p>
            </div>
          ))
        )}
      </div>
    </ProfileSection>
  );
};
