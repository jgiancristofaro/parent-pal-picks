import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Header } from "@/components/Header";
import { BottomNavigation } from "@/components/BottomNavigation";
import { ProductImageGallery } from "@/components/product/ProductImageGallery";
import { ProductInfo } from "@/components/product/ProductInfo";
import { ProductReviews } from "@/components/product/ProductReviews";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

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

const ProductPage = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    if (id) {
      fetchProduct();
    }
  }, [id]);

  const fetchProduct = async () => {
    if (!id) return;

    try {
      const { data, error } = await supabase
        .from("products")
        .select(`
          id,
          name,
          brand_name,
          price,
          image_url,
          image_urls,
          external_purchase_link,
          average_rating,
          review_count,
          category:categories(id, name)
        `)
        .eq("id", id)
        .single();

      if (error) throw error;

      setProduct(data);
    } catch (error) {
      console.error("Error fetching product:", error);
      toast({
        title: "Error",
        description: "Failed to load product details",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen pb-20 bg-gray-50">
        <Header title="Product Details" showBack={true} showSettings={false} />
        <div className="p-4 text-center">
          <p className="text-gray-500">Loading product details...</p>
        </div>
        <BottomNavigation />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen pb-20 bg-gray-50">
        <Header title="Product Details" showBack={true} showSettings={false} />
        <div className="p-4 text-center">
          <p className="text-gray-500">Product not found</p>
        </div>
        <BottomNavigation />
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-20 bg-gray-50">
      <Header title="Product Details" showBack={true} showSettings={false} />
      
      <div className="max-w-7xl mx-auto p-4">
        {/* Main Product Section */}
        <div className="bg-white rounded-lg shadow-sm mb-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-6">
            {/* Left Column - Image Gallery */}
            <ProductImageGallery 
              imageUrl={product.image_url}
              imageUrls={product.image_urls}
              productName={product.name}
              category={product.category?.name}
            />
            
            {/* Right Column - Product Info */}
            <ProductInfo product={product} />
          </div>
        </div>

        {/* Reviews Section */}
        <ProductReviews productId={product.id} />
      </div>
      
      <BottomNavigation />
    </div>
  );
};

export default ProductPage;
