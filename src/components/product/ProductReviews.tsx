
import React, { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { StarIcon } from "@/components/StarIcon";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { useUserReview } from "@/hooks/useUserReview";
import { EditReviewButton } from "@/components/review/EditReviewButton";
import { FlagContentButton } from "@/components/moderation/FlagContentButton";

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

interface ProductReviewsProps {
  productId: string;
  onUserReviewChange?: () => void;
}

export const ProductReviews = ({ productId, onUserReviewChange }: ProductReviewsProps) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [filteredReviews, setFilteredReviews] = useState<Review[]>([]);
  const [filter, setFilter] = useState<'all' | 'following'>('all');
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const { toast } = useToast();
  const { user } = useAuth();
  const { userReview, refreshUserReview } = useUserReview(productId);

  useEffect(() => {
    fetchCurrentUser();
    fetchReviews();
  }, [productId]);

  useEffect(() => {
    filterReviews();
  }, [reviews, filter, currentUser]);

  // Refresh when user review changes
  useEffect(() => {
    if (onUserReviewChange) {
      refreshUserReview();
      fetchReviews();
    }
  }, [onUserReviewChange, refreshUserReview]);

  const fetchCurrentUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    setCurrentUser(user);
  };

  const fetchReviews = async () => {
    try {
      // First, fetch reviews
      const { data: reviewsData, error: reviewsError } = await supabase
        .from("reviews")
        .select("id, rating, title, content, has_verified_experience, created_at, user_id")
        .eq("product_id", productId)
        .order("created_at", { ascending: false });

      if (reviewsError) throw reviewsError;

      if (!reviewsData || reviewsData.length === 0) {
        setReviews([]);
        setLoading(false);
        return;
      }

      // Get unique user IDs from reviews
      const userIds = [...new Set(reviewsData.map(review => review.user_id))];

      // Fetch profiles for all users
      const { data: profilesData, error: profilesError } = await supabase
        .from("profiles")
        .select("id, full_name, avatar_url")
        .in("id", userIds);

      if (profilesError) {
        console.error("Error fetching profiles:", profilesError);
        // Continue with reviews but without profile data
        const reviewsWithoutProfiles = reviewsData.map(review => ({
          ...review,
          profiles: {
            id: review.user_id,
            full_name: "Unknown User",
            avatar_url: null
          }
        }));
        setReviews(reviewsWithoutProfiles);
        setLoading(false);
        return;
      }

      // Create a map of profiles for quick lookup
      const profilesMap = new Map(
        profilesData?.map(profile => [profile.id, profile]) || []
      );

      // Combine reviews with profile data
      const combinedReviews = reviewsData.map(review => ({
        ...review,
        profiles: profilesMap.get(review.user_id) || {
          id: review.user_id,
          full_name: "Unknown User",
          avatar_url: null
        }
      }));

      setReviews(combinedReviews);
    } catch (error) {
      console.error("Error fetching reviews:", error);
      toast({
        title: "Error",
        description: "Failed to load reviews",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const filterReviews = async () => {
    if (filter === 'all') {
      setFilteredReviews(reviews);
      return;
    }

    if (!currentUser) {
      setFilteredReviews([]);
      return;
    }

    try {
      // Get list of users that current user follows
      const { data: followingData, error } = await supabase
        .from("user_follows")
        .select("following_id")
        .eq("follower_id", currentUser.id);

      if (error) throw error;

      const followingIds = followingData?.map(f => f.following_id) || [];
      
      // Filter reviews to only show those from followed users
      const filtered = reviews.filter(review => 
        followingIds.includes(review.profiles.id)
      );
      
      setFilteredReviews(filtered);
    } catch (error) {
      console.error("Error filtering reviews:", error);
      setFilteredReviews([]);
    }
  };

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

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-2xl font-bold mb-4">ParentPal Reviews</h2>
        <p className="text-gray-500">Loading reviews...</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">ParentPal Reviews</h2>
        
        {/* Filter Toggle */}
        <div className="flex bg-gray-100 rounded-lg p-1">
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
      </div>

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
        <div className="space-y-6">
          {filteredReviews.map((review) => (
            <div key={review.id} className="border-b border-gray-100 pb-6 last:border-b-0">
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
                      <div className="flex items-center space-x-1">
                        {user && review.user_id === user.id && (
                          <EditReviewButton
                            reviewId={review.id}
                            rating={review.rating}
                            title={review.title}
                            content={review.content}
                            productId={productId}
                          />
                        )}
                        {user && review.user_id !== user.id && (
                          <FlagContentButton
                            contentType="review"
                            contentId={review.id}
                          />
                        )}
                      </div>
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
          ))}
        </div>
      )}
    </div>
  );
};
