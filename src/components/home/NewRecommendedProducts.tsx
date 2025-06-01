
import { Link } from "react-router-dom";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { ArrowRight } from "lucide-react";
import { ProductCard } from "@/components/ProductCard";
import { useNewlyRecommendedProducts } from "@/hooks/useNewlyRecommendedProducts";

interface NewRecommendedProductsProps {
  currentUserId?: string;
}

export const NewRecommendedProducts = ({ currentUserId }: NewRecommendedProductsProps) => {
  const { data: newlyRecommendedProducts = [], isLoading, error } = useNewlyRecommendedProducts(currentUserId, 5);

  if (isLoading) {
    return (
      <div className="mb-4">
        <div className="flex justify-between items-center px-4 mb-2">
          <h2 className="text-xl font-bold">New Products for You</h2>
        </div>
        <div className="mx-4 bg-white rounded-xl shadow-sm p-8 text-center border border-gray-100">
          <p className="text-gray-600">Loading new product recommendations...</p>
        </div>
      </div>
    );
  }

  if (error) {
    console.error('Error loading newly recommended products:', error);
    return (
      <div className="mb-4">
        <div className="flex justify-between items-center px-4 mb-2">
          <h2 className="text-xl font-bold">New Products for You</h2>
        </div>
        <div className="mx-4 bg-white rounded-xl shadow-sm p-8 text-center border border-gray-100">
          <p className="text-gray-600">Unable to load recommendations right now.</p>
        </div>
      </div>
    );
  }

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
        <ScrollArea className="w-full whitespace-nowrap no-scrollbar">
          <div className="flex w-max space-x-4 px-4">
            {newlyRecommendedProducts.map((product) => (
              <div key={`${product.product_id}-${product.recommender_user_id}`} className="flex-none w-48">
                <ProductCard
                  id={product.product_id}
                  name={product.product_name}
                  image={product.product_image_url || '/placeholder.svg'}
                  category={product.product_category || 'Product'}
                  recommendedBy={product.recommender_full_name}
                  rating={product.recommendation_rating ? Number(product.recommendation_rating) : undefined}
                  friendRecommendationCount={1}
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
