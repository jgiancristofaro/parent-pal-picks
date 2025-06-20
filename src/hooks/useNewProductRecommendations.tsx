import { useMemo } from "react";
import { useNetworkActivityFeed } from "./useNetworkActivityFeed";

interface NewProductRecommendation {
  product_id: string;
  product_name: string;
  product_image_url: string | null;
  product_category: string | null;
  recommendation_rating: number;
  recommender_user_id: string;
  recommender_full_name: string;
  recommender_avatar_url: string | null;
  recommendation_timestamp: string;
}

export const useNewProductRecommendations = (
  currentUserId: string | undefined,
  limit: number = 10,
  enabled: boolean = true
) => {
  const { data: networkActivity = [], isLoading, error } = useNetworkActivityFeed(
    currentUserId,
    50, // Get more activities to filter from
    enabled
  );

  const productRecommendations = useMemo(() => {
    const productActivities = networkActivity
      .filter(activity => activity.activity_type === 'product_review')
      .slice(0, limit)
      .map(activity => ({
        product_id: activity.item_id,
        product_name: activity.item_name,
        product_image_url: activity.item_image_url,
        product_category: activity.item_category,
        recommendation_rating: activity.review_rating || 0,
        recommender_user_id: activity.actor_id,
        recommender_full_name: activity.actor_full_name,
        recommender_avatar_url: activity.actor_avatar_url,
        recommendation_timestamp: activity.activity_timestamp,
      }));

    // Remove duplicates by product_id, keeping the most recent
    const uniqueProducts = new Map();
    productActivities.forEach(product => {
      const existing = uniqueProducts.get(product.product_id);
      if (!existing || new Date(product.recommendation_timestamp) > new Date(existing.recommendation_timestamp)) {
        uniqueProducts.set(product.product_id, product);
      }
    });

    return Array.from(uniqueProducts.values()) as NewProductRecommendation[];
  }, [networkActivity, limit]);

  return {
    data: productRecommendations,
    isLoading,
    error
  };
};
