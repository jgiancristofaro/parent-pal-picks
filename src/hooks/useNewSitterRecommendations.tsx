import { useMemo } from "react";
import { useNetworkActivityFeed } from "./useNetworkActivityFeed";

interface NewSitterRecommendation {
  sitter_id: string;
  sitter_name: string;
  sitter_profile_image_url: string | null;
  sitter_rating: number | null;
  recommender_user_id: string;
  recommender_full_name: string;
  recommender_avatar_url: string | null;
  recommendation_timestamp: string;
}

export const useNewSitterRecommendations = (
  currentUserId: string | undefined,
  limit: number = 10,
  enabled: boolean = true
) => {
  const { data: networkActivity = [], isLoading, error } = useNetworkActivityFeed(
    currentUserId,
    50, // Get more activities to filter from
    enabled
  );

  const sitterRecommendations = useMemo(() => {
    const sitterActivities = networkActivity
      .filter(activity => activity.activity_type === 'sitter_review')
      .slice(0, limit)
      .map(activity => ({
        sitter_id: activity.item_id,
        sitter_name: activity.item_name,
        sitter_profile_image_url: activity.item_image_url,
        sitter_rating: activity.review_rating,
        recommender_user_id: activity.actor_id,
        recommender_full_name: activity.actor_full_name,
        recommender_avatar_url: activity.actor_avatar_url,
        recommendation_timestamp: activity.activity_timestamp,
      }));

    // Remove duplicates by sitter_id, keeping the most recent
    const uniqueSitters = new Map();
    sitterActivities.forEach(sitter => {
      const existing = uniqueSitters.get(sitter.sitter_id);
      if (!existing || new Date(sitter.recommendation_timestamp) > new Date(existing.recommendation_timestamp)) {
        uniqueSitters.set(sitter.sitter_id, sitter);
      }
    });

    return Array.from(uniqueSitters.values()) as NewSitterRecommendation[];
  }, [networkActivity, limit]);

  return {
    data: sitterRecommendations,
    isLoading,
    error
  };
};
