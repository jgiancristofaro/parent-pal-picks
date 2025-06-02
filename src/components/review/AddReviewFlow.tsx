
import React from "react";
import { ReviewTypeSelector } from "./ReviewTypeSelector";
import { ProductReviewTypeSelector } from "./ProductReviewTypeSelector";
import { SitterReviewTypeSelector } from "./SitterReviewTypeSelector";
import { ProductSearch } from "./ProductSearch";
import { NewProductReviewFlow } from "./NewProductReviewFlow";
import { ProductReviewForm } from "../ProductReviewForm";
import { SitterReviewForm } from "../SitterReviewForm";
import { useReviewFlow } from "@/hooks/useReviewFlow";

export const AddReviewFlow = () => {
  const {
    reviewType,
    setReviewType,
    sitterReviewType,
    productReviewType,
    selectedProduct,
    handleReset,
    handleSitterTypeSelect,
    handleProductTypeSelect,
    handleProductSelect,
    handleBackToProductOptions,
    handleSelectExistingProduct,
  } = useReviewFlow();

  // Main review type selection
  if (!reviewType) {
    return <ReviewTypeSelector onSelectReviewType={setReviewType} />;
  }

  // Product review flow
  if (reviewType === "product") {
    if (!productReviewType) {
      return (
        <ProductReviewTypeSelector
          onSelectType={handleProductTypeSelect}
          onBack={handleReset}
        />
      );
    }

    if (productReviewType === "existing" && !selectedProduct) {
      return (
        <ProductSearch
          onProductSelect={handleProductSelect}
          onBack={handleBackToProductOptions}
        />
      );
    }

    if (productReviewType === "new") {
      return (
        <NewProductReviewFlow
          onCancel={handleReset}
          onSelectExistingProduct={handleSelectExistingProduct}
        />
      );
    }

    return (
      <ProductReviewForm 
        onCancel={handleReset} 
        reviewType={productReviewType} 
        selectedProduct={selectedProduct}
      />
    );
  }

  // Sitter review flow
  if (reviewType === "sitter") {
    if (!sitterReviewType) {
      return (
        <SitterReviewTypeSelector
          onSelectType={handleSitterTypeSelect}
          onBack={handleReset}
        />
      );
    }

    return (
      <SitterReviewForm 
        onCancel={handleReset} 
        reviewType={sitterReviewType} 
      />
    );
  }

  return null;
};
