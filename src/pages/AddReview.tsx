import React, { useState } from "react";
import { Header } from "@/components/Header";
import { BottomNavigation } from "@/components/BottomNavigation";
import { Button } from "@/components/ui/button";
import { ProductReviewForm } from "@/components/ProductReviewForm";
import { SitterReviewForm } from "@/components/SitterReviewForm";
import { ProductSearch } from "@/components/review/ProductSearch";

interface Product {
  id: string;
  name: string;
  category: string | null;
  image_url: string | null;
  brand_name: string;
}

const AddReview = () => {
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

  return (
    <div className="min-h-screen bg-gray-50">
      <Header title="Add Review" showBack={true} backTo="/" />
      
      <div className="px-4 py-6 pb-20">
        {!reviewType ? (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                What would you like to review?
              </h2>
              <p className="text-gray-600">
                Share your experience to help other parents
              </p>
            </div>

            <div className="space-y-4">
              <Button
                onClick={() => setReviewType("product")}
                className="w-full h-16 bg-purple-500 hover:bg-purple-600 text-white rounded-lg flex items-center justify-center space-x-3"
              >
                <span className="text-2xl">🍼</span>
                <div className="text-left">
                  <div className="font-semibold">Review a Product</div>
                  <div className="text-sm opacity-90">Baby essentials & gear</div>
                </div>
              </Button>

              <Button
                onClick={() => setReviewType("sitter")}
                className="w-full h-16 bg-blue-500 hover:bg-blue-600 text-white rounded-lg flex items-center justify-center space-x-3"
              >
                <span className="text-2xl">👩‍🍼</span>
                <div className="text-left">
                  <div className="font-semibold">Review a Sitter</div>
                  <div className="text-sm opacity-90">Babysitters & caregivers</div>
                </div>
              </Button>
            </div>
          </div>
        ) : reviewType === "product" && !productReviewType ? (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                Review a Product
              </h2>
              <p className="text-gray-600">
                Choose how you'd like to proceed
              </p>
            </div>

            <div className="space-y-4">
              <Button
                onClick={() => handleProductTypeSelect("existing")}
                className="w-full h-16 bg-purple-500 hover:bg-purple-600 text-white rounded-lg flex items-center justify-center space-x-3"
              >
                <span className="text-2xl">🔍</span>
                <div className="text-left">
                  <div className="font-semibold">Find an Existing Product to Review</div>
                  <div className="text-sm opacity-90">Review a product already in our system</div>
                </div>
              </Button>

              <Button
                onClick={() => handleProductTypeSelect("new")}
                variant="outline"
                className="w-full h-16 border-purple-300 text-purple-700 hover:bg-purple-50 rounded-lg flex items-center justify-center space-x-3"
              >
                <span className="text-2xl">➕</span>
                <div className="text-left">
                  <div className="font-semibold">Create a New Product & Review</div>
                  <div className="text-sm opacity-90">Add a new product and review it</div>
                </div>
              </Button>
            </div>

            <div className="flex justify-center mt-6">
              <Button
                onClick={handleReset}
                variant="outline"
                className="px-6 py-2"
              >
                Back
              </Button>
            </div>
          </div>
        ) : reviewType === "product" && productReviewType === "existing" && !selectedProduct ? (
          <ProductSearch
            onProductSelect={handleProductSelect}
            onBack={handleBackToProductOptions}
          />
        ) : reviewType === "product" ? (
          <ProductReviewForm 
            onCancel={handleReset} 
            reviewType={productReviewType!} 
            selectedProduct={selectedProduct}
          />
        ) : reviewType === "sitter" && !sitterReviewType ? (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                Review a Sitter
              </h2>
              <p className="text-gray-600">
                Choose how you'd like to proceed
              </p>
            </div>

            <div className="space-y-4">
              <Button
                onClick={() => handleSitterTypeSelect("existing")}
                className="w-full h-16 bg-purple-500 hover:bg-purple-600 text-white rounded-lg flex items-center justify-center space-x-3"
              >
                <span className="text-2xl">🔍</span>
                <div className="text-left">
                  <div className="font-semibold">Find an Existing Sitter to Review</div>
                  <div className="text-sm opacity-90">Review a sitter already in our system</div>
                </div>
              </Button>

              <Button
                onClick={() => handleSitterTypeSelect("new")}
                className="w-full h-16 bg-purple-500 hover:bg-purple-600 text-white rounded-lg flex items-center justify-center space-x-3"
              >
                <span className="text-2xl">➕</span>
                <div className="text-left">
                  <div className="font-semibold">Create a New Sitter Profile & Review</div>
                  <div className="text-sm opacity-90">Add a new sitter and review them</div>
                </div>
              </Button>
            </div>

            <div className="flex justify-center mt-6">
              <Button
                onClick={handleReset}
                variant="outline"
                className="px-6 py-2"
              >
                Back
              </Button>
            </div>
          </div>
        ) : (
          <SitterReviewForm onCancel={handleReset} reviewType={sitterReviewType!} />
        )}
      </div>

      <BottomNavigation />
    </div>
  );
};

export default AddReview;
