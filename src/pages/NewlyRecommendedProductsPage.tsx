
import { Header } from "@/components/Header";
import { useNewlyRecommendedProducts } from "@/hooks/useNewlyRecommendedProducts";
import { RecommendedProductFeedItem } from "@/components/RecommendedProductFeedItem";
import { useAuth } from "@/contexts/AuthContext";

const NewlyRecommendedProductsPage = () => {
  const { user } = useAuth();

  const { 
    data: newlyRecommendedProducts = [], 
    isLoading, 
    error 
  } = useNewlyRecommendedProducts(user?.id);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header 
        title="Product Recommendations"
        showBack={true}
        showSettings={false}
      />
      
      <div className="px-4 py-6">
        {isLoading ? (
          // Loading state
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-8 h-8 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mb-4"></div>
            <p className="text-gray-600">Loading product recommendations...</p>
          </div>
        ) : error ? (
          // Error state
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mb-6">
              <svg className="w-12 h-12 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-3">Unable to Load Recommendations</h3>
            <p className="text-gray-600 max-w-sm mx-auto leading-relaxed">
              We couldn't load product recommendations right now. Please try again later.
            </p>
          </div>
        ) : newlyRecommendedProducts.length === 0 ? (
          // Empty state
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-24 h-24 bg-purple-100 rounded-full flex items-center justify-center mb-6">
              <svg className="w-12 h-12 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-3">No New Product Recommendations</h3>
            <p className="text-gray-600 max-w-sm mx-auto leading-relaxed">
              No new product recommendations from people you follow yet. Start following other parents to see their product recommendations!
            </p>
          </div>
        ) : (
          // Recommendations feed
          <div className="space-y-4">
            {newlyRecommendedProducts.map((recommendation) => (
              <div key={`${recommendation.product_id}-${recommendation.recommender_user_id}`} className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <RecommendedProductFeedItem
                  productId={recommendation.product_id}
                  productName={recommendation.product_name}
                  productImageUrl={recommendation.product_image_url}
                  productCategory={recommendation.product_category}
                  recommendationRating={recommendation.recommendation_rating ? Number(recommendation.recommendation_rating) : null}
                  recommenderUserId={recommendation.recommender_user_id}
                  recommenderFullName={recommendation.recommender_full_name}
                  recommenderAvatarUrl={recommendation.recommender_avatar_url}
                  recommendationTimestamp={recommendation.recommendation_timestamp}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default NewlyRecommendedProductsPage;
