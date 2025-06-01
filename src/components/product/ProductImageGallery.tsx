
import React, { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ProductImageGalleryProps {
  imageUrl: string | null;
  imageUrls: string[] | null;
  productName: string;
}

export const ProductImageGallery = ({ 
  imageUrl, 
  imageUrls, 
  productName 
}: ProductImageGalleryProps) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  // Combine single image and image array
  const allImages = [
    ...(imageUrl ? [imageUrl] : []),
    ...(imageUrls || [])
  ].filter(Boolean);

  const fallbackImage = "https://images.unsplash.com/photo-1586685715203-7cfac24d9afa?q=80&w=2487&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";
  const imagesToShow = allImages.length > 0 ? allImages : [fallbackImage];

  const nextImage = () => {
    setCurrentImageIndex((prev) => 
      prev === imagesToShow.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => 
      prev === 0 ? imagesToShow.length - 1 : prev - 1
    );
  };

  return (
    <div className="space-y-4">
      {/* Main Image */}
      <div className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden">
        <img
          src={imagesToShow[currentImageIndex]}
          alt={productName}
          className="w-full h-full object-cover"
        />
        
        {/* Navigation buttons - only show if multiple images */}
        {imagesToShow.length > 1 && (
          <>
            <Button
              variant="ghost"
              size="icon"
              className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white"
              onClick={prevImage}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white"
              onClick={nextImage}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </>
        )}
        
        {/* Image counter */}
        {imagesToShow.length > 1 && (
          <div className="absolute bottom-2 right-2 bg-black/50 text-white px-2 py-1 rounded text-sm">
            {currentImageIndex + 1} / {imagesToShow.length}
          </div>
        )}
      </div>

      {/* Thumbnail strip - only show if multiple images */}
      {imagesToShow.length > 1 && (
        <div className="flex space-x-2 overflow-x-auto">
          {imagesToShow.map((image, index) => (
            <button
              key={index}
              onClick={() => setCurrentImageIndex(index)}
              className={`flex-shrink-0 w-16 h-16 rounded border-2 overflow-hidden ${
                index === currentImageIndex ? 'border-purple-500' : 'border-gray-200'
              }`}
            >
              <img
                src={image}
                alt={`${productName} ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
