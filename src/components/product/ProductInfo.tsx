
import React from "react";
import { ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { StarIcon } from "@/components/StarIcon";
import { AddOrEditReviewButton } from "@/components/buttons/AddOrEditReviewButton";
import { useFavoriteStatus } from "@/hooks/useFavoriteStatus";

interface Product {
  id: string;
  name: string;
  brand_name: string;
  price: number | null;
  external_purchase_link: string | null;
  average_rating: number | null;
  review_count: number | null;
  category: {
    id: string;
    name: string;
  } | null;
}

interface ProductInfoProps {
  product: Product;
  userReview?: any;
  userReviewLoading?: boolean;
}

export const ProductInfo = ({ product }: ProductInfoProps) => {
  const { isFavorited, toggleFavorite, isLoading: favoriteLoading } = useFavoriteStatus(product.id, 'product');

  const formatPrice = (price: number | null) => {
    if (!price) return "Price not available";
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  const renderStarRating = (rating: number | null, reviewCount: number | null) => {
    if (!rating) return null;
    
    return (
      <div className="flex items-center space-x-2">
        <div className="flex">
          {[1, 2, 3, 4, 5].map((star) => (
            <StarIcon
              key={star}
              filled={star <= rating}
              className="w-5 h-5 text-yellow-500"
            />
          ))}
        </div>
        <span className="text-sm text-gray-600">
          {rating.toFixed(1)} ({reviewCount || 0} review{reviewCount !== 1 ? 's' : ''})
        </span>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Brand */}
      <div className="text-sm font-medium text-gray-500 uppercase tracking-wide">
        {product.brand_name}
      </div>

      {/* Product Name */}
      <h1 className="text-3xl font-bold text-gray-900">
        {product.name}
      </h1>

      {/* Category */}
      {product.category && (
        <Badge variant="secondary" className="text-sm">
          {product.category.name}
        </Badge>
      )}

      {/* Rating */}
      <div>
        {renderStarRating(product.average_rating, product.review_count)}
      </div>

      {/* Price */}
      <div className="text-2xl font-bold text-gray-900">
        {formatPrice(product.price)}
      </div>

      {/* Action Buttons */}
      <div className="space-y-3">
        {/* Buy Button */}
        {product.external_purchase_link && (
          <Button 
            className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 text-lg"
            onClick={() => window.open(product.external_purchase_link!, '_blank')}
          >
            <ExternalLink className="w-5 h-5 mr-2" />
            Buy Product
          </Button>
        )}

        {/* Favorite Button - Text-based */}
        <Button 
          variant="outline"
          className="w-full py-3 text-lg"
          onClick={toggleFavorite}
          disabled={favoriteLoading}
        >
          {isFavorited ? 'Unfavorite Product' : 'Favorite Product'}
        </Button>

        {/* Review Button - using the new reusable component */}
        <AddOrEditReviewButton
          itemType="product"
          item={product}
        />
      </div>
    </div>
  );
};
