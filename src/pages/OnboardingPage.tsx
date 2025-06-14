import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Carousel, CarouselContent, CarouselItem, type CarouselApi } from '@/components/ui/carousel';
import BrandedOnboardingSlide from '@/components/onboarding/BrandedOnboardingSlide';

const OnboardingPage = () => {
  const navigate = useNavigate();
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!api) {
      return;
    }

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap() + 1);

    api.on('select', () => {
      setCurrent(api.selectedScrollSnap() + 1);
    });
  }, [api]);

  const handleSignUp = () => {
    localStorage.setItem('hasSeenParentPalOnboarding', 'true');
    navigate('/signup');
  };

  const handleLogin = () => {
    localStorage.setItem('hasSeenParentPalOnboarding', 'true');
    navigate('/login');
  };

  const handleNext = () => {
    api?.scrollNext();
  };

  const slides = [
    {
      headline: "ParentPal: Trusted picks for your little one, powered by friends you know.",
      text: "Discover babysitters and baby products trusted and recommended by friends you know.",
      visualPlaceholder: "Illustration: Connected community of parents",
      imageSrc: "/assets/onboarding1.jpg"
    },
    {
      headline: "Find Sitters Your Neighbors Trust.",
      text: "Get hyper-local recommendations, even from parents in your own building or neighborhood.",
      visualPlaceholder: "Illustration: Friendly sitter or diverse neighborhood",
      imageSrc: "/assets/onboarding2.jpg"
    },
    {
      headline: "Shop Smarter, Not Harder.",
      text: "Cut through the noise with curated product picks from your trusted circle.",
      visualPlaceholder: "Illustration: Appealing layout of baby products",
      imageSrc: "/assets/onboarding3.jpg"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-purple-100 flex flex-col items-center justify-center p-6 relative">
      {/* Skip Button */}
      <Button 
        variant="ghost"
        onClick={handleSignUp}
        className="absolute top-4 right-4 z-10 text-purple-600 hover:text-purple-700 hover:bg-purple-100"
      >
        Skip
      </Button>

      <div className="w-full max-w-md">
        <Carousel setApi={setApi} className="w-full">
          <CarouselContent>
            {slides.map((slide, index) => (
              <CarouselItem key={index}>
                <BrandedOnboardingSlide
                  headline={slide.headline}
                  text={slide.text}
                  visualPlaceholder={slide.visualPlaceholder}
                  imageSrc={slide.imageSrc}
                  isFirstSlide={index === 0}
                >
                  {/* Conditional buttons based on slide index */}
                  {index < 2 ? (
                    <Button 
                      onClick={handleNext}
                      className="w-full py-6 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white rounded-xl text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200 border-0"
                    >
                      Next
                    </Button>
                  ) : (
                    <div className="space-y-3">
                      <Button 
                        onClick={handleSignUp}
                        className="w-full py-6 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white rounded-xl text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200 border-0"
                      >
                        Sign Up
                      </Button>
                      <Button 
                        onClick={handleLogin}
                        variant="outline"
                        className="w-full py-6 border-2 border-purple-500 text-purple-500 hover:bg-purple-50 rounded-xl text-lg font-semibold transition-all duration-200 bg-white"
                      >
                        Log In
                      </Button>
                    </div>
                  )}
                </BrandedOnboardingSlide>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>

        {/* Enhanced Progress Indicators */}
        <div className="flex justify-center space-x-3 mt-8">
          {Array.from({ length: count }, (_, index) => (
            <div
              key={index}
              className={`h-2 rounded-full transition-all duration-300 ${
                index + 1 === current 
                  ? 'bg-gradient-to-r from-purple-500 to-purple-600 w-8 shadow-sm' 
                  : 'bg-purple-200 w-2'
              }`}
            />
          ))}
        </div>

        {/* Brand Footer */}
        <div className="text-center mt-8">
          <p className="text-xs text-purple-400 font-medium">
            Your trusted parenting community
          </p>
        </div>
      </div>
    </div>
  );
};

export default OnboardingPage;
