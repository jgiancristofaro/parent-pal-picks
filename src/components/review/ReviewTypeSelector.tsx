
import React from "react";
import { Button } from "@/components/ui/button";

interface ReviewTypeSelectorProps {
  onSelectReviewType: (type: "product" | "sitter") => void;
}

export const ReviewTypeSelector = ({ onSelectReviewType }: ReviewTypeSelectorProps) => {
  return (
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
          onClick={() => onSelectReviewType("product")}
          className="w-full h-16 bg-purple-500 hover:bg-purple-600 text-white rounded-lg flex items-center justify-center space-x-3"
        >
          <span className="text-2xl">🍼</span>
          <div className="text-left">
            <div className="font-semibold">Review a Product</div>
            <div className="text-sm opacity-90">Baby essentials & gear</div>
          </div>
        </Button>

        <Button
          onClick={() => onSelectReviewType("sitter")}
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
  );
};
