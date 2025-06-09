
import React, { useEffect } from "react";
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
    setProductReviewType,
  } = useReviewFlow();

  // Check if we have a pre-selected product from navigation state
  useEffect(() => {
    if (editData?.selectedProduct && editData?.reviewType === 'product' && !isEditMode) {
      setReviewType('product');
      setProductReviewType('existing');
      handleProductSelect(editData.selectedProduct);
    }
  }, [editData, isEditMode, setReviewType, setProductReviewType, handleProductSelect]);

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

  // If we have a pre-selected product, go directly to the form
  if (reviewType === "product" && productReviewType === "existing" && selectedProduct) {
    return (
      <ProductReviewForm 
        onCancel={handleReset} 
        reviewType={productReviewType} 
        selectedProduct={selectedProduct}
      />
    );
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
