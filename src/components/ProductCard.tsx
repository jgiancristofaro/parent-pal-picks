
import { Link } from "react-router-dom";

interface ProductCardProps {
  id: string;
  name: string;
  image: string;
  category?: string;
  recommendedBy?: string;
}

export const ProductCard = ({ id, name, image, category, recommendedBy }: ProductCardProps) => {
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
          {recommendedBy && (
            <p className="text-xs text-purple-600 mt-1">Recommended by {recommendedBy}</p>
          )}
        </div>
      </div>
    </Link>
  );
};
