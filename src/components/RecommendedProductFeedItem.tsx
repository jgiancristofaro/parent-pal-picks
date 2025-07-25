
import { Link } from "react-router-dom";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { StarIcon } from "@/components/StarIcon";
import { ProductImage } from "@/components/ui/ProductImage";

interface RecommendedProductFeedItemProps {
  productId: string;
  productName: string;
  productImageUrl: string | null;
  productCategory: string | null;
  recommendationRating: number | null;
  recommenderUserId: string;
  recommenderFullName: string;
  recommenderAvatarUrl: string | null;
  recommendationTimestamp: string;
}

export const RecommendedProductFeedItem = ({
  productId,
  productName,
  productImageUrl,
  productCategory,
  recommendationRating,
  recommenderUserId,
  recommenderFullName,
  recommenderAvatarUrl,
  recommendationTimestamp
}: RecommendedProductFeedItemProps) => {
  return (
    <Link to={`/product/${productId}`} className="block group">
      <div className="flex items-center space-x-5 p-4 rounded-lg border border-gray-100 hover:border-purple-200 hover:bg-purple-50 transition-all">
        {/* Product Image */}
        <div className="flex-shrink-0">
          <div className="w-24 h-24 rounded-lg overflow-hidden bg-gray-100">
            <ProductImage
              imageUrl={productImageUrl}
              category={productCategory}
              productName={productName}
              className="w-full h-full object-cover"
            />
          </div>
        </div>
        
        {/* Product Details */}
        <div className="flex-grow min-h-[6rem] flex flex-col justify-center">
          <div className="flex items-center justify-between mb-1">
            <h4 className="font-semibold text-gray-900 group-hover:text-purple-600 transition-colors">
              {productName}
            </h4>
            {recommendationRating && (
              <div className="flex items-center space-x-1">
                <StarIcon filled={true} className="w-4 h-4 text-yellow-400" />
                <span className="text-sm font-medium text-gray-700">
                  {recommendationRating}
                </span>
              </div>
            )}
          </div>
          {productCategory && (
            <p className="text-sm text-gray-500 mb-1">
              {productCategory}
            </p>
          )}
          <p className="text-sm text-gray-600">
            Recommended by {recommenderFullName}
          </p>
        </div>
      </div>
    </Link>
  );
};
