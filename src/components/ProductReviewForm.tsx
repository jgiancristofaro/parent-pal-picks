
import React, { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { useEditReview } from "@/hooks/useEditReview";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { StarIcon } from "@/components/StarIcon";

interface Product {
  id: string;
  name: string;
  brand_name: string;
  image_url: string | null;
  category: string | null;
}

interface ProductReviewFormProps {
  onCancel: () => void;
  reviewType: "existing" | "new";
  selectedProduct: Product | null;
  editData?: {
    reviewId: string;
    rating: number;
    title: string;
    content: string;
    productId: string;
  };
}

export const ProductReviewForm = ({ 
  onCancel, 
  reviewType, 
  selectedProduct,
  editData 
}: ProductReviewFormProps) => {
  const [rating, setRating] = useState(editData?.rating || 0);
  const [title, setTitle] = useState(editData?.title || "");
  const [content, setContent] = useState(editData?.content || "");
  const [hasVerifiedExperience, setHasVerifiedExperience] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();
  const { updateReview } = useEditReview();
  const navigate = useNavigate();
  const isEditMode = !!editData;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to submit a review",
        variant: "destructive",
      });
      return;
    }

    if (rating === 0) {
      toast({
        title: "Error",
        description: "Please select a rating",
        variant: "destructive",
      });
      return;
    }

    if (!title.trim()) {
      toast({
        title: "Error",
        description: "Please enter a review title",
        variant: "destructive",
      });
      return;
    }

    if (!content.trim()) {
      toast({
        title: "Error",
        description: "Please enter your review content",
        variant: "destructive",
      });
      return;
    }

    if (!isEditMode && !hasVerifiedExperience) {
      toast({
        title: "Error",
        description: "Please certify that you have experience with this product",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      if (isEditMode) {
        // Update existing review
        const success = await updateReview({
          id: editData.reviewId,
          rating,
          title: title.trim(),
          content: content.trim(),
          product_id: editData.productId,
        });

        if (success) {
          navigate(-1); // Go back to the product page
        }
      } else {
        // Create new review logic
        const productId = selectedProduct?.id;
        
        if (!productId) {
          toast({
            title: "Error",
            description: "Product not selected",
            variant: "destructive",
          });
          return;
        }

        const { error } = await supabase
          .from("reviews")
          .insert({
            user_id: user.id,
            product_id: productId,
            rating,
            title: title.trim(),
            content: content.trim(),
            has_verified_experience: hasVerifiedExperience,
          });

        if (error) throw error;

        toast({
          title: "Success",
          description: "Your review has been submitted!",
        });
        
        // Redirect to the product page instead of calling onCancel
        navigate(`/product/${productId}`);
      }
    } catch (error) {
      console.error("Error with review:", error);
      toast({
        title: "Error",
        description: isEditMode ? "Failed to update review" : "Failed to submit review",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const productToDisplay = isEditMode 
    ? { id: editData.productId, name: "Product", brand_name: "", image_url: null, category: null }
    : selectedProduct;

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          {isEditMode ? "Edit Your Review" : "Review Product"}
        </h2>
        <p className="text-gray-600">
          {isEditMode ? "Update your experience with this product" : "Share your experience with this product"}
        </p>
      </div>

      {productToDisplay && (
        <div className="flex items-center p-3 bg-white rounded-lg border">
          {productToDisplay.image_url && (
            <img
              src={productToDisplay.image_url}
              alt={productToDisplay.name}
              className="w-12 h-12 rounded-lg object-cover mr-3"
            />
          )}
          <div className="flex-grow">
            <div className="font-semibold">{productToDisplay.name}</div>
            {productToDisplay.brand_name && (
              <div className="text-sm text-gray-500">{productToDisplay.brand_name}</div>
            )}
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Rating */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Rating <span className="text-red-500">*</span>
          </label>
          <div className="flex space-x-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                className={`p-1 rounded transition-colors ${
                  star <= rating ? "text-yellow-400" : "text-gray-300 hover:text-yellow-300"
                }`}
              >
                <StarIcon filled={star <= rating} className="w-8 h-8" />
              </button>
            ))}
          </div>
        </div>

        {/* Title */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Review Title <span className="text-red-500">*</span>
          </label>
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Summarize your experience"
            className="w-full"
          />
        </div>

        {/* Content */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Review Details <span className="text-red-500">*</span>
          </label>
          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Share the details of your experience with this product..."
            rows={5}
            className="w-full"
          />
        </div>

        {/* Certification Checkbox - only show for new reviews */}
        {!isEditMode && (
          <div className="flex items-start space-x-2">
            <Checkbox
              id="verified-experience"
              checked={hasVerifiedExperience}
              onCheckedChange={(checked) => setHasVerifiedExperience(checked === true)}
              className="mt-1"
            />
            <label htmlFor="verified-experience" className="text-sm font-medium leading-5">
              I certify that I have experience with this product <span className="text-red-500">*</span>
            </label>
          </div>
        )}

        {/* Submit Button */}
        <div className="flex space-x-4">
          <Button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 bg-purple-500 hover:bg-purple-600 text-white"
          >
            {isSubmitting ? (isEditMode ? "Updating..." : "Submitting...") : (isEditMode ? "Update Review" : "Submit Review")}
          </Button>
          <Button
            type="button"
            onClick={onCancel}
            variant="outline"
            className="px-6"
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
};
