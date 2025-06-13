
import React, { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { useUserReview } from "@/hooks/useUserReview";
import { useProductReviewsFilter } from "@/hooks/useProductReviewsFilter";
import { ProductReviewsHeader } from "./ProductReviewsHeader";
import { ProductReviewsList } from "./ProductReviewsList";

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
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const { toast } = useToast();
  const { user } = useAuth();
  const { userReview, refreshUserReview } = useUserReview(productId);
  
  const { filter, setFilter, filteredReviews } = useProductReviewsFilter(reviews, currentUser);

  useEffect(() => {
    fetchCurrentUser();
    fetchReviews();
  }, [productId]);

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
      <ProductReviewsHeader 
        filter={filter}
        onFilterChange={setFilter}
      />
      
      <ProductReviewsList
        reviews={filteredReviews}
        productId={productId}
        filter={filter}
      />
    </div>
  );
};
