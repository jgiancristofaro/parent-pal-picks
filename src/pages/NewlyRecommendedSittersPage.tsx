
import { Header } from "@/components/Header";
import { useNewlyRecommendedSitters } from "@/hooks/useNewlyRecommendedSitters";
import { RecommendedSitterFeedItem } from "@/components/RecommendedSitterFeedItem";
import { useAuth } from "@/contexts/AuthContext";

const NewlyRecommendedSittersPage = () => {
  const { user } = useAuth();

  const { 
    data: newlyRecommendedSitters = [], 
    isLoading, 
    error 
  } = useNewlyRecommendedSitters(user?.id);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header 
        title="Sitter Recommendations"
        showBack={true}
        showSettings={false}
        backTo="/"
      />
      
      <div className="px-4 py-6">
        {isLoading ? (
          // Loading state
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-8 h-8 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mb-4"></div>
            <p className="text-gray-600">Loading sitter recommendations...</p>
          </div>
        ) : error ? (
          // Error state
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mb-6">
              <svg className="w-12 h-12 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-3">Unable to Load Recommendations</h3>
            <p className="text-gray-600 max-w-sm mx-auto leading-relaxed">
              We couldn't load sitter recommendations right now. Please try again later.
            </p>
          </div>
        ) : newlyRecommendedSitters.length === 0 ? (
          // Empty state
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-24 h-24 bg-purple-100 rounded-full flex items-center justify-center mb-6">
              <svg className="w-12 h-12 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-3">No New Sitter Recommendations</h3>
            <p className="text-gray-600 max-w-sm mx-auto leading-relaxed">
              No new sitter recommendations from people you follow yet. Start following other parents to see their sitter recommendations!
            </p>
          </div>
        ) : (
          // Recommendations feed
          <div className="space-y-4">
            {newlyRecommendedSitters.map((recommendation) => (
              <div key={`${recommendation.sitter_id}-${recommendation.recommender_user_id}`} className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <RecommendedSitterFeedItem
                  sitterId={recommendation.sitter_id}
                  sitterName={recommendation.sitter_name}
                  sitterProfileImageUrl={recommendation.sitter_profile_image_url}
                  sitterRating={recommendation.sitter_rating ? Number(recommendation.sitter_rating) : null}
                  recommenderUserId={recommendation.recommender_user_id}
                  recommenderFullName={recommendation.recommender_full_name}
                  recommenderAvatarUrl={recommendation.recommender_avatar_url}
                  recommendationTimestamp={recommendation.recommendation_timestamp}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default NewlyRecommendedSittersPage;
