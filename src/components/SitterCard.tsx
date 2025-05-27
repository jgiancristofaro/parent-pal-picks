
import { Link } from "react-router-dom";
import { StarIcon } from "./StarIcon";

interface SitterCardProps {
  id: string;
  name: string;
  image: string;
  rating: number;
  experience?: string;
  recommendedBy?: string;
  friendRecommendationCount: number;
}

export const SitterCard = ({ 
  id, 
  name, 
  image, 
  rating, 
  experience, 
  recommendedBy,
  friendRecommendationCount
}: SitterCardProps) => {
  const formatFriendRecommendation = (count: number) => {
    if (count === 0) return "New sitter";
    if (count === 1) return "Recommended by 1 friend";
    return `Recommended by ${count} friends`;
  };

  return (
    <Link to={`/sitter/${id}`}>
      <div className="flex flex-col p-3 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200">
        <div className="w-full aspect-square rounded-lg overflow-hidden mb-3">
          <img 
            src={image} 
            alt={name} 
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex-grow">
          <h3 className="font-semibold text-gray-800 text-sm mb-1">{name}</h3>
          <div className="flex items-center mb-1">
            <StarIcon filled={true} className="w-3 h-3 text-yellow-500" />
            <span className="text-xs text-gray-600 ml-1">{rating}</span>
          </div>
          {experience && <p className="text-xs text-gray-500 mb-1">{experience}</p>}
          {recommendedBy ? (
            <p className="text-xs text-purple-600">Recommended by {recommendedBy}</p>
          ) : (
            <p className="text-xs text-purple-600">{formatFriendRecommendation(friendRecommendationCount)}</p>
          )}
        </div>
      </div>
    </Link>
  );
};
