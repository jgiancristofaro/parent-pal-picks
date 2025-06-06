
import React from 'react';

interface OnboardingSlideProps {
  headline: string;
  text: string;
  visualPlaceholder: string;
  imageSrc?: string;
  children?: React.ReactNode;
}

const OnboardingSlide: React.FC<OnboardingSlideProps> = ({
  headline,
  text,
  visualPlaceholder,
  imageSrc,
  children
}) => {
  return (
    <div className="text-center px-4">
      <div className="h-80 bg-purple-100 flex items-center justify-center mb-8 rounded-2xl border border-purple-200 overflow-hidden">
        {imageSrc ? (
          <img 
            src={imageSrc} 
            alt={headline}
            className="w-full h-full object-cover"
          />
        ) : (
          <p className="text-purple-600 font-medium text-sm px-4 text-center">
            {visualPlaceholder}
          </p>
        )}
      </div>
      <h2 className="text-2xl font-bold text-gray-900 mb-4 leading-tight">
        {headline}
      </h2>
      <p className="text-gray-600 text-center mb-8 leading-relaxed">
        {text}
      </p>
      {children}
    </div>
  );
};

export default OnboardingSlide;
