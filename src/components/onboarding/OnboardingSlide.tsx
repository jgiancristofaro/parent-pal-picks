
import React from 'react';

interface OnboardingSlideProps {
  headline: string;
  text: string;
  imageSrc?: string;
  backgroundColor?: string;
}

const OnboardingSlide: React.FC<OnboardingSlideProps> = ({
  headline,
  text,
  imageSrc,
  backgroundColor = "bg-purple-50"
}) => {
  return (
    <div className={`flex flex-col items-center justify-center min-h-screen px-6 text-center ${backgroundColor}`}>
      {imageSrc && (
        <div className="mb-8 w-64 h-64 flex items-center justify-center">
          <img 
            src={imageSrc} 
            alt="Onboarding illustration" 
            className="max-w-full max-h-full object-contain"
          />
        </div>
      )}
      
      <div className="max-w-md">
        <h1 className="text-3xl font-bold text-gray-900 mb-6 leading-tight">
          {headline}
        </h1>
        
        <p className="text-lg text-gray-600 leading-relaxed">
          {text}
        </p>
      </div>
    </div>
  );
};

export default OnboardingSlide;
