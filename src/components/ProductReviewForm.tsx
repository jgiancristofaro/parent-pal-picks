
import React, { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { StarIcon } from "@/components/StarIcon";
import { useToast } from "@/hooks/use-toast";

interface Product {
  id: string;
  name: string;
  category: string | null;
  image_url: string | null;
}

interface ProductReviewFormProps {
  onCancel: () => void;
}

export const ProductReviewForm = ({ onCancel }: ProductReviewFormProps) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [rating, setRating] = useState(0);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    const { data, error } = await supabase
      .from("products")
      .select("id, name, category, image_url")
      .order("name");

    if (error) {
      console.error("Error fetching products:", error);
      toast({
        title: "Error",
        description: "Failed to load products",
        variant: "destructive",
      });
    } else {
      setProducts(data || []);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedProduct || rating === 0 || !title.trim() || !content.trim()) {
      toast({
        title: "Error",
        description: "Please fill in all fields and select a rating",
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

    const { error } = await supabase
      .from("reviews")
      .insert({
        user_id: user.id,
        product_id: selectedProduct.id,
        rating,
        title: title.trim(),
        content: content.trim(),
      });

    setIsSubmitting(false);

    if (error) {
      console.error("Error submitting review:", error);
      toast({
        title: "Error",
        description: "Failed to submit review",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: "Your review has been submitted!",
      });
      onCancel();
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Review a Product
        </h2>
        <p className="text-gray-600">
          Share your experience with baby essentials
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {!selectedProduct ? (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Select a Product</h3>
            <div className="grid gap-3">
              {products.map((product) => (
                <button
                  key={product.id}
                  type="button"
                  onClick={() => setSelectedProduct(product)}
                  className="flex items-center p-3 bg-white rounded-lg border hover:border-purple-300 transition-colors text-left"
                >
                  {product.image_url && (
                    <img
                      src={product.image_url}
                      alt={product.name}
                      className="w-12 h-12 rounded-lg object-cover mr-3"
                    />
                  )}
                  <div>
                    <div className="font-semibold">{product.name}</div>
                    {product.category && (
                      <div className="text-sm text-gray-500">{product.category}</div>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex items-center p-3 bg-white rounded-lg border">
              {selectedProduct.image_url && (
                <img
                  src={selectedProduct.image_url}
                  alt={selectedProduct.name}
                  className="w-12 h-12 rounded-lg object-cover mr-3"
                />
              )}
              <div className="flex-grow">
                <div className="font-semibold">{selectedProduct.name}</div>
                {selectedProduct.category && (
                  <div className="text-sm text-gray-500">{selectedProduct.category}</div>
                )}
              </div>
              <Button
                type="button"
                variant="ghost"
                onClick={() => setSelectedProduct(null)}
                className="text-purple-600"
              >
                Change
              </Button>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Rating</label>
              <div className="flex space-x-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className="p-1"
                  >
                    <StarIcon
                      filled={star <= rating}
                      className="w-8 h-8 text-yellow-500"
                    />
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Review Title</label>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Summarize your experience"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Your Review</label>
              <Textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Tell other parents about your experience with this product..."
                rows={4}
                required
              />
            </div>

            <div className="flex space-x-3">
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 bg-purple-500 hover:bg-purple-600"
              >
                {isSubmitting ? "Submitting..." : "Submit Review"}
              </Button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
};
