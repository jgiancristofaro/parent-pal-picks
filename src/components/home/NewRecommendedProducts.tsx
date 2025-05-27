
import { Link } from "react-router-dom";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { ArrowRight } from "lucide-react";
import { ProductCard } from "@/components/ProductCard";

interface NewlyRecommendedProduct {
  id: string;
  name: string;
  image: string;
  category: string;
  recommendedBy: string;
  recommendationDate: string;
}

interface NewRecommendedProductsProps {
  newlyRecommendedProducts: NewlyRecommendedProduct[];
}

export const NewRecommendedProducts = ({ newlyRecommendedProducts }: NewRecommendedProductsProps) => {
  return (
    <div className="mb-4">
      <div className="flex justify-between items-center px-4 mb-2">
        <h2 className="text-xl font-bold">New Products for You</h2>
        {newlyRecommendedProducts.length > 0 && (
          <Link to="/newly-recommended-products" className="flex items-center text-purple-500 text-sm font-medium hover:text-purple-600">
            View All
            <ArrowRight className="w-4 h-4 ml-1" />
          </Link>
        )}
      </div>

      {newlyRecommendedProducts.length === 0 ? (
        <div className="mx-4 bg-white rounded-xl shadow-sm p-8 text-center border border-gray-100">
          <p className="text-gray-600">No new product recommendations yet.</p>
        </div>
      ) : (
        <ScrollArea className="w-full whitespace-nowrap">
          <div className="flex w-max space-x-4 px-4">
            {newlyRecommendedProducts.map((product) => (
              <div key={product.id} className="flex-none w-48">
                <ProductCard
                  id={product.id}
                  name={product.name}
                  image={product.image}
                  category={product.category}
                  recommendedBy={product.recommendedBy}
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
