
import React from "react";
import { Button } from "@/components/ui/button";

interface ProductReviewTypeSelectorProps {
  onSelectType: (type: "existing" | "new") => void;
  onBack: () => void;
}

export const ProductReviewTypeSelector = ({ onSelectType, onBack }: ProductReviewTypeSelectorProps) => {
  return (
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
          onClick={() => onSelectType("existing")}
          className="w-full h-16 bg-purple-500 hover:bg-purple-600 text-white rounded-lg flex items-center justify-center space-x-3"
        >
          <span className="text-2xl">🔍</span>
          <div className="text-left">
            <div className="font-semibold">Find an Existing Product to Review</div>
            <div className="text-sm opacity-90">Review a product already in our system</div>
          </div>
        </Button>

        <Button
          onClick={() => onSelectType("new")}
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
          onClick={onBack}
          variant="outline"
          className="px-6 py-2"
        >
          Back
        </Button>
      </div>
    </div>
  );
};
