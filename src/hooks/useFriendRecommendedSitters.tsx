
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useFriendRecommendedSitters = (userId: string | undefined, enabled: boolean = true) => {
  return useQuery({
    queryKey: ['friend-recommended-sitters', userId],
    queryFn: async () => {
      if (!userId) return [];

      console.log('Fetching friend-recommended sitters for user:', userId);

      // Get the list of users that the current user follows
      const { data: followedUsers, error: followError } = await supabase
        .from('user_follows')
        .select('following_id')
        .eq('follower_id', userId);

      if (followError) {
        console.error('Error fetching followed users:', followError);
        throw followError;
      }

      if (!followedUsers || followedUsers.length === 0) {
        console.log('User follows no one, returning empty array');
        return [];
      }

      const followedUserIds = followedUsers.map(follow => follow.following_id);
      console.log('Followed user IDs:', followedUserIds);

      // Get sitters that have been reviewed positively (4+ stars) by followed users
      const { data: recommendedSitters, error: sittersError } = await supabase
        .from('reviews')
        .select(`
          sitter_id,
          rating,
          sitters (
            id,
            name,
            profile_image_url,
            rating,
            experience,
            bio
          )
        `)
        .in('user_id', followedUserIds)
        .gte('rating', 4)
        .not('sitter_id', 'is', null);

      if (sittersError) {
        console.error('Error fetching recommended sitters:', sittersError);
        throw sittersError;
      }

      // Remove duplicates and format the data
      const uniqueSitters = recommendedSitters?.reduce((acc, review) => {
        if (review.sitters && !acc.find(s => s.id === review.sitters.id)) {
          acc.push({
            id: review.sitters.id,
            name: review.sitters.name,
            image: review.sitters.profile_image_url || "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=2487&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            rating: review.sitters.rating || 0,
            experience: review.sitters.experience || "Experience not specified",
            recommendedBy: "Friends" // We could enhance this to show specific friend names
          });
        }
        return acc;
      }, [] as any[]) || [];

      console.log('Friend-recommended sitters found:', uniqueSitters.length);
      return uniqueSitters;
    },
    enabled: enabled && !!userId,
  });
};
