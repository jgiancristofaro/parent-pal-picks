
import { Link } from "react-router-dom";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

interface Product {
  id: string;
  name: string;
  image: string;
  category: string;
}

interface FeaturedRecommendationsProps {
  featuredProducts: Product[];
}

export const FeaturedRecommendations = ({ featuredProducts }: FeaturedRecommendationsProps) => {
  return (
    <div className="mb-8">
      <div className="flex justify-between items-center px-4 mb-4">
        <h2 className="text-2xl font-bold">Featured Recommendations</h2>
        <button className="text-purple-500 text-sm font-medium">View All</button>
      </div>
      <ScrollArea className="w-full whitespace-nowrap">
        <div className="flex w-max space-x-4 p-4">
          {featuredProducts.map(product => (
            <div key={product.id} className="flex-none w-48">
              <Link to={`/product/${product.id}`}>
                <div className="rounded-xl overflow-hidden bg-white shadow-sm hover:shadow-lg transition-shadow duration-200">
                  <div className="aspect-square overflow-hidden">
                    <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="p-3">
                    <h3 className="font-semibold text-gray-800 text-sm line-clamp-2">{product.name}</h3>
                    <p className="text-xs text-gray-500 mt-1">{product.category}</p>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  );
};
