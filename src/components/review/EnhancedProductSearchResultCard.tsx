
import React from "react";
import { Button } from "@/components/ui/button";
import { Edit, Loader2 } from "lucide-react";
import { useUserReview } from "@/hooks/useUserReview";

interface Product {
  id: string;
  name: string;
  category: string | null;
  image_url: string | null;
  brand_name: string;
}

interface EnhancedProductSearchResultCardProps {
  product: Product;
  onSelectForNewReview: () => void;
  onEditExistingReview: (reviewData: any) => void;
}

export const EnhancedProductSearchResultCard = ({ 
  product, 
  onSelectForNewReview, 
  onEditExistingReview 
}: EnhancedProductSearchResultCardProps) => {
  const { userReview, loading } = useUserReview(product.id, undefined);

  const handleButtonClick = () => {
    if (userReview) {
      onEditExistingReview({
        reviewId: userReview.id,
        rating: userReview.rating,
        title: userReview.title,
        content: userReview.content,
        productId: product.id
      });
    } else {
      onSelectForNewReview();
    }
  };

  const getButtonText = () => {
    if (loading) return "Loading...";
    if (userReview) return "Edit Your Review";
    return "Select";
  };

  const getButtonIcon = () => {
    if (loading) return <Loader2 className="w-4 h-4 animate-spin" />;
    if (userReview) return <Edit className="w-4 h-4" />;
    return null;
  };

  const getButtonStyle = () => {
    if (userReview) {
      return "bg-blue-500 hover:bg-blue-600 text-white";
    }
    return "bg-purple-500 hover:bg-purple-600 text-white";
  };

  return (
    <div className="flex items-center p-3 bg-white rounded-lg border hover:border-purple-300 transition-colors">
      {product.image_url && (
        <img
          src={product.image_url}
          alt={product.name}
          className="w-12 h-12 rounded-lg object-cover mr-3"
        />
      )}
      <div className="flex-grow">
        <div className="font-semibold">{product.name}</div>
        <div className="text-sm text-gray-600">{product.brand_name}</div>
        {product.category && (
          <div className="text-xs text-gray-400">{product.category}</div>
        )}
      </div>
      <Button
        onClick={handleButtonClick}
        className={getButtonStyle()}
        disabled={loading}
      >
        {getButtonIcon()}
        {getButtonText()}
      </Button>
    </div>
  );
};
