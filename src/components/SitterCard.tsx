
import { Link } from "react-router-dom";
import { StarIcon } from "./StarIcon";
import { Badge } from "@/components/ui/badge";
import { Building2, MapPin } from "lucide-react";

interface SitterCardProps {
  id: string;
  name: string;
  image: string;
  rating: number;
  experience?: string;
  recommendedBy?: string;
  friendRecommendationCount: number;
  workedInUserLocationNickname?: string;
  localRecommendationType?: 'BUILDING' | 'AREA_ZIP' | null;
  locationContextName?: string | null;
  userSpecificRating?: number;
  reviewSnippet?: string;
  compactText?: boolean;
}

export const SitterCard = ({ 
  id, 
  name, 
  image, 
  rating, 
  experience, 
  recommendedBy,
  friendRecommendationCount,
  workedInUserLocationNickname,
  localRecommendationType,
  locationContextName,
  userSpecificRating,
  reviewSnippet,
  compactText = false
}: SitterCardProps) => {
  const formatFriendRecommendation = (count: number) => {
    if (count === 0) return "New sitter";
    if (count === 1) return "Recommended by 1 friend";
    return `Recommended by ${count} friends`;
  };

  const renderLocalRecommendationBadge = () => {
    if (!localRecommendationType || !locationContextName) return null;

    if (localRecommendationType === 'BUILDING') {
      return (
        <div className="flex items-center mb-1">
          <Building2 className="w-3 h-3 text-purple-600 mr-1" />
          <span className="text-xs text-purple-600 font-medium">
            Popular in your building: {locationContextName}
          </span>
        </div>
      );
    }

    if (localRecommendationType === 'AREA_ZIP') {
      return (
        <div className="flex items-center mb-1">
          <MapPin className="w-3 h-3 text-green-600 mr-1" />
          <span className="text-xs text-green-600 font-medium">
            Popular in your area: {locationContextName}
          </span>
        </div>
      );
    }

    return null;
  };

  return (
    <Link to={`/sitter/${id}`}>
      <div className="flex flex-col bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 overflow-hidden">
        <div className="w-full aspect-square overflow-hidden">
          <img 
            src={image} 
            alt={name} 
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex-grow p-3">
          <h3 className="font-semibold text-gray-800 text-sm mb-1">{name}</h3>
          <div className="flex items-center mb-1">
            <StarIcon filled={true} className="w-3 h-3 text-yellow-500" />
            <span className="text-xs text-gray-600 ml-1">
              {userSpecificRating !== undefined ? userSpecificRating : rating}
            </span>
          </div>
          {experience && <p className="text-xs text-gray-500 mb-1">{experience}</p>}
          
          {/* Local recommendation badge */}
          {renderLocalRecommendationBadge()}
          
          {/* Special badge for hyper-local sitters */}
          {workedInUserLocationNickname && (
            <div className="flex items-center mb-1">
              <Building2 className="w-3 h-3 text-purple-600 mr-1" />
              <span className="text-xs text-purple-600 font-medium">
                Worked in your {workedInUserLocationNickname} building
              </span>
            </div>
          )}
          
          {/* Show review snippet if provided, otherwise show friend recommendations */}
          {reviewSnippet ? (
            <p className="text-xs text-gray-600 italic">"{reviewSnippet}..."</p>
          ) : recommendedBy ? (
            <p className="text-xs text-gray-600">
              {compactText ? `Rec. by ${recommendedBy}` : `Recommended by ${recommendedBy}`}
            </p>
          ) : (
            <p className="text-xs text-gray-600">{formatFriendRecommendation(friendRecommendationCount)}</p>
          )}
        </div>
      </div>
    </Link>
  );
};
