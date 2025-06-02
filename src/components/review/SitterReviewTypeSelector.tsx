
import React from "react";
import { Button } from "@/components/ui/button";

interface SitterReviewTypeSelectorProps {
  onSelectType: (type: "existing" | "new") => void;
  onBack: () => void;
}

export const SitterReviewTypeSelector = ({ onSelectType, onBack }: SitterReviewTypeSelectorProps) => {
  return (
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
          onClick={() => onSelectType("existing")}
          className="w-full h-16 bg-purple-500 hover:bg-purple-600 text-white rounded-lg flex items-center justify-center space-x-3"
        >
          <span className="text-2xl">🔍</span>
          <div className="text-left">
            <div className="font-semibold">Find an Existing Sitter to Review</div>
            <div className="text-sm opacity-90">Review a sitter already in our system</div>
          </div>
        </Button>

        <Button
          onClick={() => onSelectType("new")}
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
