
import { Link } from "react-router-dom";
import { StarIcon } from "@/components/StarIcon";
import { ProductImage } from "@/components/ui/ProductImage";
import { FavoriteButton } from "@/components/FavoriteButton";

interface ProductCardProps {
  id: string;
  name: string;
  image: string;
  category?: string;
  recommendedBy?: string;
  rating?: number;
  friendRecommendationCount?: number;
  uniqueRecommenderCount?: number;
  userSpecificRating?: number;
  reviewSnippet?: string;
  textColorClass?: string;
}

export const ProductCard = ({ 
  id, 
  name, 
  image, 
  category, 
  recommendedBy, 
  rating,
  friendRecommendationCount,
  uniqueRecommenderCount,
  userSpecificRating,
  reviewSnippet,
  textColorClass = "text-purple-600"
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

  const formatUniqueRecommenderText = (count: number) => {
    if (count === 0) return null;
    return `${count} parent${count === 1 ? '' : 's'} recommend${count === 1 ? 's' : ''}`;
  };

  const displayRating = userSpecificRating !== undefined ? userSpecificRating : rating;

  return (
    <div className="relative">
      <Link to={`/product/${id}`}>
        <div className="rounded-lg overflow-hidden bg-white shadow-md hover:shadow-lg transition-shadow duration-200">
          <div className="aspect-square overflow-hidden">
            <ProductImage 
              imageUrl={image}
              category={category}
              productName={name}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="p-3">
            <h3 className="font-semibold text-gray-800 leading-tight break-words">{name}</h3>
            {category && <p className="text-sm text-gray-500 break-words">{category}</p>}
            
            {displayRating && (
              <div className="flex items-center mt-1">
                <div className="flex mr-1">
                  {renderStars(displayRating)}
                </div>
                <span className="text-xs text-gray-600">({displayRating})</span>
              </div>
            )}
            
            {/* Show review snippet if provided, otherwise show recommendation counts */}
            {reviewSnippet ? (
              <p className={`text-xs mt-1 italic leading-relaxed break-words ${textColorClass}`}>"{reviewSnippet}..."</p>
            ) : (
              <>
                {uniqueRecommenderCount !== undefined && uniqueRecommenderCount > 0 && (
                  <p className={`text-xs mt-1 leading-relaxed break-words ${textColorClass}`}>
                    {formatUniqueRecommenderText(uniqueRecommenderCount)}
                  </p>
                )}
                
                {recommendedBy && (
                  <p className={`text-xs mt-1 leading-relaxed break-words ${textColorClass}`}>Recommended by {recommendedBy}</p>
                )}
                
                {friendRecommendationCount !== undefined && friendRecommendationCount > 0 && (
                  <p className={`text-xs mt-1 leading-relaxed break-words ${textColorClass}`}>
                    {formatRecommendationText(friendRecommendationCount)}
                  </p>
                )}
              </>
            )}
          </div>
        </div>
      </Link>
      
      {/* Favorite Button - positioned in top-right corner */}
      <div className="absolute top-2 right-2">
        <FavoriteButton 
          itemId={id} 
          itemType="product" 
          size="sm"
          variant="ghost"
        />
      </div>
    </div>
  );
};
