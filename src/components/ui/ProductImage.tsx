
import React, { useState } from 'react';
import { getCategoryImage } from '@/utils/productImageUtils';

interface ProductImageProps {
  imageUrl: string | null;
  category: string | null;
  productName: string;
  className?: string;
  alt?: string;
}

export const ProductImage = ({ 
  imageUrl, 
  category, 
  productName, 
  className = "",
  alt 
}: ProductImageProps) => {
  const [hasError, setHasError] = useState(false);
  
  const handleImageError = () => {
    setHasError(true);
  };

  // If original image failed to load or no image URL provided, show category fallback
  const displayImage = (hasError || !imageUrl) ? getCategoryImage(category) : imageUrl;
  const imageAlt = alt || productName;

  return (
    <img
      src={displayImage}
      alt={imageAlt}
      className={className}
      onError={handleImageError}
    />
  );
};
