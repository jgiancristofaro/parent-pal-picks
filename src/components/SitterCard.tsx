
import { Link } from "react-router-dom";
import { StarIcon } from "./StarIcon";

interface SitterCardProps {
  id: string;
  name: string;
  image: string;
  rating: number;
  experience?: string;
  recommendedBy?: string;
}

export const SitterCard = ({ 
  id, 
  name, 
  image, 
  rating, 
  experience, 
  recommendedBy 
}: SitterCardProps) => {
  return (
    <Link to={`/sitter/${id}`}>
      <div className="flex items-center p-4 mb-4 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200">
        <div className="w-16 h-16 rounded-full overflow-hidden mr-4 flex-shrink-0">
          <img 
            src={image} 
            alt={name} 
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex-grow">
          <h3 className="font-semibold text-gray-800">{name}</h3>
          <div className="flex items-center mt-1">
            <StarIcon filled={true} className="w-4 h-4 text-yellow-500" />
            <span className="text-sm text-gray-600 ml-1">{rating}</span>
          </div>
          {experience && <p className="text-sm text-gray-500 mt-1">{experience}</p>}
          {recommendedBy && (
            <p className="text-xs text-purple-600 mt-1">Recommended by {recommendedBy}</p>
          )}
        </div>
      </div>
    </Link>
  );
};
