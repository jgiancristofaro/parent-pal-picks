
import React, { useEffect } from "react";
import { ReviewTypeSelector } from "./ReviewTypeSelector";
import { ProductReviewTypeSelector } from "./ProductReviewTypeSelector";
import { SitterReviewTypeSelector } from "./SitterReviewTypeSelector";
import { ProductSearch } from "./ProductSearch";
import { NewProductReviewFlow } from "./NewProductReviewFlow";
import { ProductReviewForm } from "../ProductReviewForm";
import { SitterReviewForm } from "../SitterReviewForm";
import { useReviewFlow } from "@/hooks/useReviewFlow";
import { useLocation, useNavigate } from "react-router-dom";

export const AddReviewFlow = () => {
  const location = useLocation();
  const navigate = useNavigate();
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

  // Check if we have a selected ID from the search page
  useEffect(() => {
    if (location.state?.selectedId && location.state?.selectedType) {
      const { selectedId, selectedType, selectedData } = location.state;
      
      if (selectedType === 'sitter') {
        setReviewType('sitter');
        // We'll pass the selected sitter data to the form
      } else if (selectedType === 'product') {
        setReviewType('product');
        setProductReviewType('existing');
        if (selectedData) {
          handleProductSelect(selectedData);
        }
      }
    }
  }, [location.state, setReviewType, setProductReviewType, handleProductSelect]);

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

  // If we have a selected sitter from search, go directly to the form
  if (reviewType === "sitter" && location.state?.selectedId && location.state?.selectedType === 'sitter') {
    return (
      <SitterReviewForm 
        onCancel={handleReset} 
        reviewType="existing"
        selectedSitterId={location.state.selectedId}
        selectedSitterData={location.state.selectedData}
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
          onSelectType={(type) => {
            if (type === "existing") {
              navigate('/search-for-review/product');
            } else {
              handleProductTypeSelect(type);
            }
          }}
          onBack={handleReset}
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
          onSelectType={(type) => {
            if (type === "existing") {
              navigate('/search-for-review/sitter');
            } else {
              handleSitterTypeSelect(type);
            }
          }}
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
