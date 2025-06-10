
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Star, Loader2 } from "lucide-react";
import { useUserReview } from "@/hooks/useUserReview";

interface Product {
  id: string;
  name: string;
  brand_name: string;
  price: number | null;
  image_url: string | null;
  image_urls: string[] | null;
  external_purchase_link: string | null;
  average_rating: number | null;
  review_count: number | null;
  category: {
    id: string;
    name: string;
  } | null;
}

interface Sitter {
  id: string;
  name: string;
  experience?: string;
  profile_image_url?: string;
  hourly_rate?: number;
  bio?: string;
  email?: string;
  phone_number?: string;
  rating?: number;
  review_count?: number;
  certifications?: string[];
}

interface AddOrEditReviewButtonProps {
  itemType: 'product' | 'sitter';
  item: Product | Sitter;
  className?: string;
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  size?: "default" | "sm" | "lg" | "icon";
}

export const AddOrEditReviewButton = ({ 
  itemType, 
  item, 
  className = "w-full border-purple-300 text-purple-700 hover:bg-purple-50 py-3",
  variant = "outline",
  size = "default"
}: AddOrEditReviewButtonProps) => {
  const navigate = useNavigate();
  
  // Use the hook dynamically based on itemType
  const { userReview, loading } = useUserReview(
    itemType === 'product' ? item.id : undefined,
    itemType === 'sitter' ? item.id : undefined
  );

  const handleClick = () => {
    if (userReview) {
      // Edit existing review
      navigate('/add-review', {
        state: {
          editMode: true,
          reviewId: userReview.id,
          rating: userReview.rating,
          title: userReview.title,
          content: userReview.content,
          ...(itemType === 'product' ? { productId: item.id } : { sitterId: item.id })
        }
      });
    } else {
      // Add new review
      navigate('/add-review', {
        state: {
          ...(itemType === 'product' 
            ? { selectedProduct: item, reviewType: 'product' }
            : { selectedId: item.id, selectedType: 'sitter', selectedData: item }
          )
        }
      });
    }
  };

  const getButtonText = () => {
    if (loading) return "Loading...";
    if (userReview) return "Edit Your Review";
    return `Add a Review for this ${itemType === 'product' ? 'Product' : 'Sitter'}`;
  };

  const getButtonIcon = () => {
    if (loading) return <Loader2 className="w-5 h-5 mr-2 animate-spin" />;
    return <Star className="w-5 h-5 mr-2" />;
  };

  return (
    <Button 
      variant={variant}
      size={size}
      className={className}
      onClick={handleClick}
      disabled={loading}
    >
      {getButtonIcon()}
      {getButtonText()}
    </Button>
  );
};
