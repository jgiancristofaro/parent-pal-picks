
import { Link } from "react-router-dom";
import { StarIcon } from "@/components/StarIcon";

interface ProductCardProps {
  id: string;
  name: string;
  image: string;
  category?: string;
  recommendedBy?: string;
  rating?: number;
  friendRecommendationCount?: number;
}

export const ProductCard = ({ 
  id, 
  name, 
  image, 
  category, 
  recommendedBy, 
  rating,
  friendRecommendationCount 
}: ProductCardProps) => {
  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(<StarIcon key={i} filled={true} className="w-3 h-3 text-yellow-400" />);
    }
    
    if (hasHalfStar) {
      stars.push(<StarIcon key="half" filled={false} className="w-3 h-3 text-yellow-400" />);
    }
    
    const remainingStars = 5 - Math.ceil(rating);
    for (let i = 0; i < remainingStars; i++) {
      stars.push(<StarIcon key={`empty-${i}`} filled={false} className="w-3 h-3 text-gray-300" />);
    }
    
    return stars;
  };

  const formatRecommendationText = (count: number) => {
    if (count === 0) return null;
    return `Recommended by ${count} friend${count === 1 ? '' : 's'}`;
  };

  return (
    <Link to={`/product/${id}`}>
      <div className="rounded-lg overflow-hidden bg-white shadow-md hover:shadow-lg transition-shadow duration-200">
        <div className="aspect-square overflow-hidden">
          <img 
            src={image} 
            alt={name} 
            className="w-full h-full object-cover"
          />
        </div>
        <div className="p-3">
          <h3 className="font-semibold text-gray-800 truncate">{name}</h3>
          {category && <p className="text-sm text-gray-500">{category}</p>}
          
          {rating && (
            <div className="flex items-center mt-1">
              <div className="flex mr-1">
                {renderStars(rating)}
              </div>
              <span className="text-xs text-gray-600">({rating})</span>
            </div>
          )}
          
          {recommendedBy && (
            <p className="text-xs text-purple-600 mt-1">Recommended by {recommendedBy}</p>
          )}
          
          {friendRecommendationCount !== undefined && friendRecommendationCount > 0 && (
            <p className="text-xs text-purple-600 mt-1">
              {formatRecommendationText(friendRecommendationCount)}
            </p>
          )}
        </div>
      </div>
    </Link>
  );
};
