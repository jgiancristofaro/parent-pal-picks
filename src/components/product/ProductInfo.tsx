
import React from "react";
import { ExternalLink, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { StarIcon } from "@/components/StarIcon";
import { EditReviewButton } from "@/components/review/EditReviewButton";
import { useNavigate } from "react-router-dom";

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

interface UserReview {
  id: string;
  rating: number;
  title: string;
  content: string;
  created_at: string;
  updated_at: string;
}

interface ProductInfoProps {
  product: Product;
  userReview?: UserReview | null;
  userReviewLoading?: boolean;
}

export const ProductInfo = ({ product, userReview, userReviewLoading }: ProductInfoProps) => {
  const navigate = useNavigate();

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

  const handleAddReview = () => {
    navigate('/add-review', { 
      state: { 
        selectedProduct: product,
        reviewType: 'product'
      }
    });
  };

  const renderReviewButton = () => {
    if (userReviewLoading) {
      return (
        <Button 
          variant="outline" 
          className="w-full border-purple-300 text-purple-700 hover:bg-purple-50 py-3"
          disabled
        >
          <Star className="w-5 h-5 mr-2" />
          Loading...
        </Button>
      );
    }

    if (userReview) {
      return (
        <EditReviewButton
          reviewId={userReview.id}
          rating={userReview.rating}
          title={userReview.title}
          content={userReview.content}
          productId={product.id}
          className="w-full border-purple-300 text-purple-700 hover:bg-purple-50 py-3"
        />
      );
    }

    return (
      <Button 
        variant="outline" 
        className="w-full border-purple-300 text-purple-700 hover:bg-purple-50 py-3"
        onClick={handleAddReview}
      >
        <Star className="w-5 h-5 mr-2" />
        Add Review for this Product
      </Button>
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

        {/* Review Button - conditionally rendered */}
        {renderReviewButton()}
      </div>
    </div>
  );
};
