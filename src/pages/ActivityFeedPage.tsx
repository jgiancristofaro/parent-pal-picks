
import { Header } from "@/components/Header";
import { BottomNavigation } from "@/components/BottomNavigation";
import { useNetworkActivityFeed } from "@/hooks/useNetworkActivityFeed";
import { GenericActivityFeedItem } from "@/components/GenericActivityFeedItem";
import { useAuth } from "@/contexts/AuthContext";

const ActivityFeedPage = () => {
  const { user } = useAuth();

  const { 
    data: friendsActivity = [], 
    isLoading, 
    error 
  } = useNetworkActivityFeed(user?.id);

  return (
    <div className="min-h-screen pb-20 bg-gray-50">
      <Header 
        title="Friends' Activity"
        showBack={true}
        showSettings={false}
      />
      
      <div className="px-4 py-6">
        {isLoading ? (
          // Loading state
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-8 h-8 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mb-4"></div>
            <p className="text-gray-600">Loading friends' activity...</p>
          </div>
        ) : error ? (
          // Error state
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mb-6">
              <svg className="w-12 h-12 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-3">Unable to Load Activity</h3>
            <p className="text-gray-600 max-w-sm mx-auto leading-relaxed">
              We couldn't load your friends' activity right now. Please try again later.
            </p>
          </div>
        ) : friendsActivity.length === 0 ? (
          // Empty state
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-24 h-24 bg-purple-100 rounded-full flex items-center justify-center mb-6">
              <svg className="w-12 h-12 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-3">No Activity Yet</h3>
            <p className="text-gray-600 max-w-sm mx-auto leading-relaxed">
              No activity from your friends yet. Follow more parents to see their reviews and recommendations!
            </p>
          </div>
        ) : (
          // Activity feed list
          <div className="space-y-4">
            {friendsActivity.map((activity) => (
              <div key={activity.activity_id} className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <GenericActivityFeedItem
                  activityId={activity.activity_id}
                  activityType={activity.activity_type as 'product_review' | 'sitter_review'}
                  actorId={activity.actor_id}
                  actorFullName={activity.actor_full_name}
                  actorAvatarUrl={activity.actor_avatar_url}
                  activityTimestamp={activity.activity_timestamp}
                  itemId={activity.item_id}
                  itemName={activity.item_name}
                  itemImageUrl={activity.item_image_url}
                  itemCategory={activity.item_category}
                  reviewRating={activity.review_rating}
                  reviewTitle={activity.review_title}
                />
              </div>
            ))}
          </div>
        )}
      </div>
      
      <BottomNavigation />
    </div>
  );
};

export default ActivityFeedPage;
