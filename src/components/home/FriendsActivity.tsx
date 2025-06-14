
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowRight, AlertCircle } from "lucide-react";
import { GenericActivityFeedItem } from "@/components/GenericActivityFeedItem";
import { useFriendsActivityFeed } from "@/hooks/useFriendsActivityFeed";

interface FriendsActivityProps {
  currentUserId?: string;
}

export const FriendsActivity = ({ currentUserId }: FriendsActivityProps) => {
  const { data: friendsActivity = [], isLoading, error } = useFriendsActivityFeed(currentUserId, 5);

  const LoadingSkeleton = () => (
    <div className="mx-4 bg-white rounded-xl shadow-sm p-4 border border-gray-100">
      <div className="flex space-x-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex-none w-80">
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="space-y-1">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-3 w-32" />
                </div>
              </div>
              <Skeleton className="h-32 w-full rounded-lg" />
              <Skeleton className="h-4 w-48" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const ErrorState = () => (
    <div className="mx-4 bg-white rounded-xl shadow-sm p-8 text-center border border-gray-100">
      <AlertCircle className="w-8 h-8 text-gray-400 mx-auto mb-3" />
      <p className="text-gray-600 mb-4">Unable to load friends' activity right now.</p>
      <Button variant="outline" size="sm" onClick={() => window.location.reload()}>
        Try Again
      </Button>
    </div>
  );

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

      {isLoading && <LoadingSkeleton />}

      {error && <ErrorState />}

      {!isLoading && !error && friendsActivity.length === 0 && (
        <div className="mx-4 bg-white rounded-xl shadow-sm p-8 text-center border border-gray-100">
          <p className="text-gray-600 mb-4">Find and follow friends to see their recommendations here!</p>
          <Link to="/search">
            <Button variant="link" className="text-purple-500 hover:text-purple-600">
              Find Friends
            </Button>
          </Link>
        </div>
      )}

      {!isLoading && !error && friendsActivity.length > 0 && (
        <ScrollArea className="w-full whitespace-nowrap no-scrollbar">
          <div className="flex w-max space-x-4 px-4">
            {friendsActivity.map((activity) => (
              <div key={activity.activity_id} className="flex-none w-80 bg-white rounded-xl shadow-sm border border-gray-100">
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
                  displayMode="preview"
                />
              </div>
            ))}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      )}
    </div>
  );
};
