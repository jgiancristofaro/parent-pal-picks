
import { Link } from "react-router-dom";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { StarIcon } from "@/components/StarIcon";
import { formatDistanceToNowStrict } from "date-fns";

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
  const timeAgo = formatDistanceToNowStrict(new Date(recommendationTimestamp), { addSuffix: false });

  return (
    <div className="flex items-start py-3 px-4">
      {/* Left Section - Recommender Info */}
      <Link to={`/profile/${recommenderUserId}`} className="flex-shrink-0">
        <Avatar className="w-12 h-12">
          <AvatarImage 
            src={recommenderAvatarUrl || undefined} 
            alt={recommenderFullName}
            className="object-cover"
          />
          <AvatarFallback className="bg-purple-100 text-purple-600">
            {recommenderFullName.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
      </Link>
      
      <div className="ml-4 flex-grow">
        <div className="flex justify-between">
          <Link to={`/profile/${recommenderUserId}`}>
            <p className="font-semibold text-gray-800 hover:text-purple-600 transition-colors">
              {recommenderFullName}
            </p>
          </Link>
          <p className="text-sm text-gray-500">{timeAgo}</p>
        </div>
        
        {/* Right Section / Main Content - Product Info */}
        <Link to={`/product/${productId}`} className="block mt-1 group">
          <div className="flex items-center space-x-3 p-3 rounded-lg border border-gray-100 hover:border-purple-200 hover:bg-purple-50 transition-all">
            {/* Product Image */}
            <div className="flex-shrink-0">
              <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100">
                {productImageUrl ? (
                  <img 
                    src={productImageUrl} 
                    alt={productName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                    <span className="text-gray-400 text-xs">No Image</span>
                  </div>
                )}
              </div>
            </div>
            
            {/* Product Details */}
            <div className="flex-grow">
              <div className="flex items-center justify-between">
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
                <p className="text-sm text-gray-500 mt-1">
                  {productCategory}
                </p>
              )}
              <p className="text-sm text-gray-600 mt-1">
                Recommended by {recommenderFullName}
              </p>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
};
