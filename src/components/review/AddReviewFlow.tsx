
import React from "react";
import { ReviewTypeSelector } from "./ReviewTypeSelector";
import { ProductReviewTypeSelector } from "./ProductReviewTypeSelector";
import { SitterReviewTypeSelector } from "./SitterReviewTypeSelector";
import { ProductSearch } from "./ProductSearch";
import { NewProductReviewFlow } from "./NewProductReviewFlow";
import { ProductReviewForm } from "../ProductReviewForm";
import { SitterReviewForm } from "../SitterReviewForm";
import { useReviewFlow } from "@/hooks/useReviewFlow";
import { useLocation } from "react-router-dom";

export const AddReviewFlow = () => {
  const location = useLocation();
  const editData = location.state as any;
  const isEditMode = editData?.editMode;

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

  // If in edit mode, skip the selection flow and go directly to the appropriate form
  if (isEditMode) {
    if (editData.productId) {
      return (
        <ProductReviewForm 
          onCancel={handleReset} 
          reviewType="existing"
          selectedProduct={null}
          editData={editData}
        />
      );
    }
    
    if (editData.sitterId) {
      return (
        <SitterReviewForm 
          onCancel={handleReset} 
          reviewType="existing"
          editData={editData}
        />
      );
    }
  }

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
