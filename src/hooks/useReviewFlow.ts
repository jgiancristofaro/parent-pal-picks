
import { useState } from "react";

interface Product {
  id: string;
  name: string;
  category: string | null;
  image_url: string | null;
  brand_name: string;
}

export const useReviewFlow = () => {
  const [reviewType, setReviewType] = useState<"product" | "sitter" | null>(null);
  const [sitterReviewType, setSitterReviewType] = useState<"existing" | "new" | null>(null);
  const [productReviewType, setProductReviewType] = useState<"existing" | "new" | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const handleReset = () => {
    setReviewType(null);
    setSitterReviewType(null);
    setProductReviewType(null);
    setSelectedProduct(null);
  };

  const handleSitterTypeSelect = (type: "existing" | "new") => {
    setSitterReviewType(type);
  };

  const handleProductTypeSelect = (type: "existing" | "new") => {
    setProductReviewType(type);
  };

  const handleProductSelect = (product: Product) => {
    setSelectedProduct(product);
  };

  const handleBackToProductOptions = () => {
    setProductReviewType(null);
    setSelectedProduct(null);
  };

  const handleSelectExistingProduct = (product: any) => {
    // Convert the duplicate product format to our Product interface
    const formattedProduct: Product = {
      id: product.id,
      name: product.name,
      category: null, // We don't have category in the duplicate check response
      image_url: product.image_url,
      brand_name: product.brand_name,
    };
    setSelectedProduct(formattedProduct);
    setProductReviewType("existing");
  };

  return {
    reviewType,
    setReviewType,
    sitterReviewType,
    setSitterReviewType,
    productReviewType,
    setProductReviewType,
    selectedProduct,
    setSelectedProduct,
    handleReset,
    handleSitterTypeSelect,
    handleProductTypeSelect,
    handleProductSelect,
    handleBackToProductOptions,
    handleSelectExistingProduct,
  };
};
