import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { ArrowRight } from "lucide-react";
import { GenericActivityFeedItem } from "@/components/GenericActivityFeedItem";
import { useNetworkActivityFeed } from "@/hooks/useNetworkActivityFeed";

interface FriendsActivityProps {
  currentUserId?: string;
}

export const FriendsActivity = ({ currentUserId }: FriendsActivityProps) => {
  const { data: friendsActivity = [], isLoading, error } = useNetworkActivityFeed(currentUserId, 5);

  // Map database activity types to component activity types
  const mapActivityType = (dbActivityType: string): 'product_review' | 'sitter_review' | 'follow_user' => {
    console.log('🔍 Mapping activity type:', dbActivityType);
    
    switch (dbActivityType) {
      case 'REVIEWED_PRODUCT':
      case 'product_review':
        console.log('✅ Mapped to: product_review');
        return 'product_review';
      case 'REVIEWED_SITTER':
      case 'sitter_review':
        console.log('✅ Mapped to: sitter_review');
        return 'sitter_review';
      case 'FOLLOWED_USER':
      case 'user_follow':
        console.log('✅ Mapped to: follow_user');
        return 'follow_user';
      default:
        console.warn('⚠️ Unknown activity type:', dbActivityType, '- defaulting to sitter_review');
        return 'sitter_review'; // fallback
    }
  };

  // Debug logging for received activity data
  if (friendsActivity.length > 0) {
    console.log('📊 Friends Activity Debug Info:');
    console.log('Total activities:', friendsActivity.length);
    friendsActivity.forEach((activity, index) => {
      console.log(`Activity ${index + 1}:`, {
        activity_id: activity.activity_id,
        activity_type: activity.activity_type,
        actor_name: activity.actor_full_name,
        item_name: activity.item_name,
        review_rating: activity.review_rating,
        review_title: activity.review_title
      });
    });
  }

  if (isLoading) {
    return (
      <div className="mb-4">
        <div className="flex justify-between items-center px-4 mb-2">
          <h2 className="text-xl font-bold">Friends' Activity</h2>
        </div>
        <div className="mx-4 bg-white rounded-xl shadow-sm p-8 text-center border border-gray-100">
          <p className="text-gray-600">Loading friends' activity...</p>
        </div>
      </div>
    );
  }

  if (error) {
    console.error('Error loading friends activity:', error);
    return (
      <div className="mb-4">
        <div className="flex justify-between items-center px-4 mb-2">
          <h2 className="text-xl font-bold">Friends' Activity</h2>
        </div>
        <div className="mx-4 bg-white rounded-xl shadow-sm p-8 text-center border border-gray-100">
          <p className="text-gray-600">Unable to load friends' activity right now.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mb-4">
      <div className="flex justify-between items-center px-4 mb-2">
        <h2 className="text-xl font-bold">Friends' Activity</h2>
        {friendsActivity.length > 0 && (
          <Link to="/activity-feed" className="flex items-center text-purple-500 text-sm font-medium hover:text-purple-600">
            View All
            <ArrowRight className="w-4 h-4 ml-1" />
          </Link>
        )}
      </div>

      {friendsActivity.length === 0 ? (
        <div className="mx-4 bg-white rounded-xl shadow-sm p-8 text-center border border-gray-100">
          <p className="text-gray-600 mb-4">Find and follow friends to see their recommendations here!</p>
          <Link to="/search">
            <Button variant="link" className="text-purple-500 hover:text-purple-600">
              Find Friends
            </Button>
          </Link>
        </div>
      ) : (
        <ScrollArea className="w-full whitespace-nowrap no-scrollbar">
          <div className="flex w-max space-x-4 px-4">
            {friendsActivity.map((activity) => {
              const activityType = mapActivityType(activity.activity_type);
              
              console.log(`🎯 Rendering activity ${activity.activity_id}:`, {
                original_type: activity.activity_type,
                mapped_type: activityType,
                will_show_rating: activityType !== 'follow_user' && activity.review_rating,
                will_show_title: activityType !== 'follow_user' && activity.review_title
              });
              
              return (
                <div key={activity.activity_id} className="flex-none w-80 bg-white rounded-xl shadow-sm border border-gray-100">
                  <GenericActivityFeedItem
                    activityId={activity.activity_id}
                    activityType={activityType}
                    actorId={activity.actor_id}
                    actorFullName={activity.actor_full_name}
                    actorAvatarUrl={activity.actor_avatar_url}
                    activityTimestamp={activity.activity_timestamp}
                    itemId={activity.item_id}
                    itemName={activity.item_name}
                    itemImageUrl={activity.item_image_url}
                    itemCategory={activity.item_category}
                    reviewRating={activityType === 'follow_user' ? null : activity.review_rating}
                    reviewTitle={activityType === 'follow_user' ? null : activity.review_title}
                    displayMode="preview"
                    isFriendsActivity={true}
                  />
                </div>
              );
            })}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      )}
    </div>
  );
};
