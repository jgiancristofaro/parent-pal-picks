
import React from 'react';

interface BrandedOnboardingSlideProps {
  headline: string;
  text: string;
  visualPlaceholder: string;
  imageSrc?: string;
  children?: React.ReactNode;
  isFirstSlide?: boolean;
}

const BrandedOnboardingSlide: React.FC<BrandedOnboardingSlideProps> = ({
  headline,
  text,
  visualPlaceholder,
  imageSrc,
  children,
  isFirstSlide = false
}) => {
  const handleImageError = () => {
    console.log(`Failed to load image: ${imageSrc}`);
  };

  return (
    <div className="text-center px-4">
      {/* Logo Header */}
      <div className="mb-8">
        <img 
          src="/assets/logo.png" 
          alt="ParentPal Logo" 
          className={`mx-auto ${isFirstSlide ? 'h-16 w-auto' : 'h-12 w-auto'}`}
        />
        {isFirstSlide && (
          <p className="text-purple-600 font-medium text-sm mt-2">
            Welcome to ParentPal
          </p>
        )}
      </div>

      {/* Main Image */}
      <div className="h-80 bg-gradient-to-br from-purple-50 to-purple-100 flex items-center justify-center mb-8 rounded-2xl border-2 border-purple-200 overflow-hidden shadow-lg">
        {imageSrc ? (
          <img 
            src={imageSrc} 
            alt={headline}
            className="w-full h-full object-cover"
            onError={handleImageError}
          />
        ) : (
          <p className="text-purple-600 font-medium text-sm px-4 text-center">
            {visualPlaceholder}
          </p>
        )}
      </div>

      {/* Content */}
      <h2 className="text-2xl font-bold text-gray-900 mb-4 leading-tight">
        {headline}
      </h2>
      <p className="text-gray-600 text-center mb-8 leading-relaxed">
        {text}
      </p>

      {/* Brand accent line */}
      <div className="w-12 h-1 bg-gradient-to-r from-purple-400 to-purple-600 mx-auto mb-6 rounded-full"></div>

      {children}
    </div>
  );
};

export default BrandedOnboardingSlide;
