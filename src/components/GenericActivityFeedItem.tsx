
import { Link } from "react-router-dom";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { StarIcon } from "@/components/StarIcon";
import { Users, UserPlus } from "lucide-react";
import { formatDistanceToNowStrict } from "date-fns";

interface GenericActivityFeedItemProps {
  activityId: string;
  activityType: 'product_review' | 'sitter_review' | 'follow_user';
  actorId: string;
  actorFullName: string;
  actorAvatarUrl: string | null;
  activityTimestamp: string;
  itemId: string;
  itemName: string;
  itemImageUrl: string | null;
  itemCategory: string | null;
  reviewRating?: number | null;
  reviewTitle?: string | null;
  displayMode?: 'preview' | 'full';
}

export const GenericActivityFeedItem = ({
  activityId,
  activityType,
  actorId,
  actorFullName,
  actorAvatarUrl,
  activityTimestamp,
  itemId,
  itemName,
  itemImageUrl,
  itemCategory,
  reviewRating = null,
  reviewTitle = null,
  displayMode = 'full'
}: GenericActivityFeedItemProps) => {
  const timeAgo = formatDistanceToNowStrict(new Date(activityTimestamp), { addSuffix: false });
  
  // Determine the correct navigation path based on activity type and category
  const getItemDetailPath = () => {
    if (activityType === 'product_review') {
      return `/product/${itemId}`;
    }
    
    if (activityType === 'follow_user') {
      return `/profile/${itemId}`;
    }
    
    // For sitter_review, check if it's actually a user profile or a sitter business
    if (activityType === 'sitter_review') {
      // If item_category is 'user', it's a user-to-user connection, route to profile
      if (itemCategory === 'user') {
        return `/profile/${itemId}`;
      }
      // Otherwise, it's an actual sitter business profile
      return `/sitter/${itemId}`;
    }
    
    return `/sitter/${itemId}`;
  };

  const itemDetailPath = getItemDetailPath();

  // Get activity-specific content
  const getActivityContent = () => {
    if (activityType === 'follow_user') {
      return {
        actionText: 'started following',
        icon: <Users className="w-4 h-4 text-purple-500" />,
        showRating: false
      };
    }
    
    // Default to review content
    return {
      actionText: `gave ${reviewRating || 0} stars to`,
      icon: <StarIcon filled={true} className="w-4 h-4 text-yellow-400" />,
      showRating: true
    };
  };

  const activityContent = getActivityContent();

  if (displayMode === 'preview') {
    return (
      <div className="p-4 hover:bg-gray-50 transition-colors">
        <div className="flex items-center space-x-3">
          {/* Actor Avatar */}
          <Link to={`/profile/${actorId}`} className="flex-shrink-0">
            <Avatar className="w-10 h-10">
              <AvatarImage 
                src={actorAvatarUrl || undefined} 
                alt={actorFullName}
                className="object-cover"
              />
              <AvatarFallback className="bg-purple-100 text-purple-600">
                {actorFullName.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </Link>
          
          <div className="flex-grow min-w-0">
            <div className="flex justify-between items-start mb-0.5">
              <Link to={`/profile/${actorId}`}>
                <p className="font-semibold text-gray-800 hover:text-purple-600 transition-colors text-sm leading-tight">
                  {actorFullName}
                </p>
              </Link>
              <p className="text-xs text-gray-500 flex-shrink-0 ml-2">{timeAgo}</p>
            </div>
            
            {/* Activity description with clickable item name */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 flex-grow min-w-0">
                <span className="text-sm text-gray-600 leading-tight">
                  {activityContent.actionText}
                </span>
                <Link to={itemDetailPath} className="text-sm text-gray-800 hover:text-purple-600 transition-colors truncate leading-tight font-medium">
                  {itemName}
                </Link>
              </div>
              {activityContent.showRating && reviewRating && (
                <div className="flex items-center space-x-1 flex-shrink-0 ml-2">
                  {activityContent.icon}
                  <span className="text-sm font-medium text-gray-700">
                    {reviewRating}
                  </span>
                </div>
              )}
              {!activityContent.showRating && (
                <div className="flex-shrink-0 ml-2">
                  {activityContent.icon}
                </div>
              )}
            </div>
            
            {reviewTitle && activityType !== 'follow_user' && (
              <p className="text-sm text-gray-500 mt-0.5 truncate leading-tight">
                "{reviewTitle}"
              </p>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center py-3 px-4">
      {/* Left Section - Actor/Reviewer Info */}
      <Link to={`/profile/${actorId}`} className="flex-shrink-0">
        <Avatar className="w-12 h-12">
          <AvatarImage 
            src={actorAvatarUrl || undefined} 
            alt={actorFullName}
            className="object-cover"
          />
          <AvatarFallback className="bg-purple-100 text-purple-600">
            {actorFullName.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
      </Link>
      
      <div className="ml-4 flex-grow">
        <div className="flex justify-between">
          <Link to={`/profile/${actorId}`}>
            <p className="font-semibold text-gray-800 hover:text-purple-600 transition-colors">
              {actorFullName}
            </p>
          </Link>
          <p className="text-sm text-gray-500">{timeAgo}</p>
        </div>
        
        {/* Activity Description */}
        <p className="text-sm text-gray-600 mt-1">
          {actorFullName} {activityContent.actionText} {itemName}
          {reviewTitle && activityType !== 'follow_user' && ` - "${reviewTitle}"`}
        </p>
        
        {/* Right Section / Main Content - Item Info */}
        <Link to={itemDetailPath} className="block mt-2 group">
          <div className="flex items-center space-x-3 p-3 rounded-lg border border-gray-100 hover:border-purple-200 hover:bg-purple-50 transition-all">
            {/* Item Image */}
            <div className="flex-shrink-0">
              <Avatar className="w-12 h-12">
                <AvatarImage 
                  src={itemImageUrl || undefined} 
                  alt={itemName}
                  className="object-cover"
                />
                <AvatarFallback className="bg-gray-100 text-gray-600">
                  {itemName.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </div>
            
            {/* Item Details */}
            <div className="flex-grow">
              <div className="flex items-center justify-between">
                <h4 className="font-semibold text-gray-900 group-hover:text-purple-600 transition-colors">
                  {itemName}
                </h4>
                {activityContent.showRating && reviewRating && (
                  <div className="flex items-center space-x-1">
                    {activityContent.icon}
                    <span className="text-sm font-medium text-gray-700">
                      {reviewRating}
                    </span>
                  </div>
                )}
                {!activityContent.showRating && (
                  <div className="flex items-center">
                    {activityContent.icon}
                  </div>
                )}
              </div>
              {itemCategory && activityType !== 'follow_user' && (
                <p className="text-sm text-gray-600 mt-1">
                  {itemCategory}
                </p>
              )}
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
};
