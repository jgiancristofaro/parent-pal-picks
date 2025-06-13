
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

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

export const useProductReviewsFilter = (reviews: Review[], currentUser: any) => {
  const [filter, setFilter] = useState<'all' | 'following'>('all');
  const [filteredReviews, setFilteredReviews] = useState<Review[]>([]);

  useEffect(() => {
    filterReviews();
  }, [reviews, filter, currentUser]);

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

  return {
    filter,
    setFilter,
    filteredReviews
  };
};
