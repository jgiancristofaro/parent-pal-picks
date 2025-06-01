
import React from "react";
import { Button } from "@/components/ui/button";

interface Product {
  id: string;
  name: string;
  category: string | null;
  image_url: string | null;
  brand_name: string;
}

interface ProductSearchResultCardProps {
  product: Product;
  onSelect: () => void;
}

export const ProductSearchResultCard = ({ product, onSelect }: ProductSearchResultCardProps) => {
  return (
    <div className="flex items-center p-3 bg-white rounded-lg border hover:border-purple-300 transition-colors">
      {product.image_url && (
        <img
          src={product.image_url}
          alt={product.name}
          className="w-12 h-12 rounded-lg object-cover mr-3"
        />
      )}
      <div className="flex-grow">
        <div className="font-semibold">{product.name}</div>
        <div className="text-sm text-gray-600">{product.brand_name}</div>
        {product.category && (
          <div className="text-xs text-gray-400">{product.category}</div>
        )}
      </div>
      <Button
        onClick={onSelect}
        className="bg-purple-500 hover:bg-purple-600 text-white"
      >
        Select
      </Button>
    </div>
  );
};
