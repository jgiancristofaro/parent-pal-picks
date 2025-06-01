
import { Link } from "react-router-dom";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { StarIcon } from "@/components/StarIcon";
import { formatDistanceToNowStrict } from "date-fns";

interface RecommendedSitterFeedItemProps {
  sitterId: string;
  sitterName: string;
  sitterProfileImageUrl: string | null;
  sitterRating: number | null;
  recommenderUserId: string;
  recommenderFullName: string;
  recommenderAvatarUrl: string | null;
  recommendationTimestamp: string;
}

export const RecommendedSitterFeedItem = ({
  sitterId,
  sitterName,
  sitterProfileImageUrl,
  sitterRating,
  recommenderUserId,
  recommenderFullName,
  recommenderAvatarUrl,
  recommendationTimestamp
}: RecommendedSitterFeedItemProps) => {
  const timeAgo = formatDistanceToNowStrict(new Date(recommendationTimestamp), { addSuffix: false });

  return (
    <div className="flex items-start py-3 px-4">
      {/* Left Section - Recommender Info */}
      <Link to={`/profile/${recommenderUserId}`} className="flex-shrink-0">
        <Avatar className="w-12 h-12">
          <AvatarImage 
            src={recommenderAvatarUrl || undefined} 
            alt={recommenderFullName}
            className="object-cover"
          />
          <AvatarFallback className="bg-purple-100 text-purple-600">
            {recommenderFullName.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
      </Link>
      
      <div className="ml-4 flex-grow">
        <div className="flex justify-between">
          <Link to={`/profile/${recommenderUserId}`}>
            <p className="font-semibold text-gray-800 hover:text-purple-600 transition-colors">
              {recommenderFullName}
            </p>
          </Link>
          <p className="text-sm text-gray-500">{timeAgo}</p>
        </div>
        
        {/* Right Section / Main Content - Sitter Info */}
        <Link to={`/sitter/${sitterId}`} className="block mt-1 group">
          <div className="flex items-center space-x-3 p-3 rounded-lg border border-gray-100 hover:border-purple-200 hover:bg-purple-50 transition-all">
            {/* Sitter Profile Image */}
            <div className="flex-shrink-0">
              <Avatar className="w-12 h-12">
                <AvatarImage 
                  src={sitterProfileImageUrl || undefined} 
                  alt={sitterName}
                  className="object-cover"
                />
                <AvatarFallback className="bg-gray-100 text-gray-600">
                  {sitterName.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </div>
            
            {/* Sitter Details */}
            <div className="flex-grow">
              <div className="flex items-center justify-between">
                <h4 className="font-semibold text-gray-900 group-hover:text-purple-600 transition-colors">
                  {sitterName}
                </h4>
                {sitterRating && (
                  <div className="flex items-center space-x-1">
                    <StarIcon filled={true} className="w-4 h-4 text-yellow-400" />
                    <span className="text-sm font-medium text-gray-700">
                      {sitterRating.toFixed(1)}
                    </span>
                  </div>
                )}
              </div>
              <p className="text-sm text-gray-600 mt-1">
                Recommended by {recommenderFullName}
              </p>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
};
