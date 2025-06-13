
import React, { useState } from "react";
import { CreateProductForm } from "./CreateProductForm";
import { ReviewForm } from "./ReviewForm";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { Checkbox } from "@/components/ui/checkbox";

interface ProductFormData {
  name: string;
  brand_name: string;
  category_id: string;
  price: string;
  external_purchase_link: string;
  description: string;
  image_file: File | null;
  image_url?: string;
}

interface DuplicateProduct {
  id: string;
  name: string;
  brand_name: string;
  image_url: string | null;
}

interface NewProductReviewFlowProps {
  onCancel: () => void;
  onSelectExistingProduct: (product: DuplicateProduct) => void;
}

export const NewProductReviewFlow = ({ onCancel, onSelectExistingProduct }: NewProductReviewFlowProps) => {
  const [step, setStep] = useState<"product" | "review">("product");
  const [productData, setProductData] = useState<ProductFormData | null>(null);
  const [rating, setRating] = useState(0);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [hasVerifiedExperience, setHasVerifiedExperience] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleProductNext = (data: ProductFormData & { image_url?: string }) => {
    setProductData(data);
    setStep("review");
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!productData || rating === 0 || !title.trim() || !content.trim() || !hasVerifiedExperience) {
      toast({
        title: "Error",
        description: "Please fill in all fields and check the certification",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to submit a review",
        variant: "destructive",
      });
      setIsSubmitting(false);
      return;
    }

    try {
      // Create the product first
      const { data: newProduct, error: productError } = await supabase
        .from("products")
        .insert({
          name: productData.name.trim(),
          brand_name: productData.brand_name.trim(),
          category_id: productData.category_id,
          price: parseFloat(productData.price),
          external_purchase_link: productData.external_purchase_link.trim() || null,
          description: productData.description.trim() || null,
          image_url: productData.image_url,
          created_by_user_id: user.id,
        })
        .select()
        .single();

      if (productError) throw productError;

      // Create the review
      const { error: reviewError } = await supabase
        .from("reviews")
        .insert({
          user_id: user.id,
          product_id: newProduct.id,
          rating,
          title: title.trim(),
          content: content.trim(),
          has_verified_experience: hasVerifiedExperience,
        });

      if (reviewError) throw reviewError;

      toast({
        title: "Success",
        description: "Your product and review have been created!",
      });
      
      // Redirect to the newly created product page instead of calling onCancel
      navigate(`/product/${newProduct.id}`);
    } catch (error) {
      console.error("Error creating product and review:", error);
      toast({
        title: "Error",
        description: "Failed to create product and review",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (step === "product") {
    return (
      <CreateProductForm
        onNext={handleProductNext}
        onCancel={onCancel}
        onSelectExistingProduct={onSelectExistingProduct}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Review Your Product
        </h2>
        <p className="text-gray-600">
          Step 2: Share your experience with this product
        </p>
      </div>

      {productData && (
        <div className="flex items-center p-3 bg-white rounded-lg border">
          {productData.image_url && (
            <img
              src={productData.image_url}
              alt={productData.name}
              className="w-12 h-12 rounded-lg object-cover mr-3"
            />
          )}
          <div className="flex-grow">
            <div className="font-semibold">{productData.name}</div>
            <div className="text-sm text-gray-500">{productData.brand_name}</div>
          </div>
        </div>
      )}

      <ReviewForm
        rating={rating}
        title={title}
        content={content}
        isSubmitting={isSubmitting}
        onRatingChange={setRating}
        onTitleChange={setTitle}
        onContentChange={setContent}
        onSubmit={handleReviewSubmit}
        onCancel={() => setStep("product")}
      />

      <div className="flex items-center space-x-2">
        <Checkbox
          id="verified-experience"
          checked={hasVerifiedExperience}
          onCheckedChange={(checked) => setHasVerifiedExperience(checked as boolean)}
        />
        <label
          htmlFor="verified-experience"
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          I certify that I have experience with this product *
        </label>
      </div>
    </div>
  );
};
