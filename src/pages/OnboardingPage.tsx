
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Carousel, CarouselContent, CarouselItem, type CarouselApi } from '@/components/ui/carousel';
import OnboardingSlide from '@/components/onboarding/OnboardingSlide';

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
    navigate('/login');
  };

  const handleLogin = () => {
    localStorage.setItem('hasSeenParentPalOnboarding', 'true');
    navigate('/login-existing');
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
      visualPlaceholder: "Illustration: Friendly sitter or diverse neighborhood"
    },
    {
      headline: "Shop Smarter, Not Harder.",
      text: "Cut through the noise with curated product picks from your trusted circle.",
      visualPlaceholder: "Illustration: Appealing layout of baby products"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-md">
        <Carousel setApi={setApi} className="w-full">
          <CarouselContent>
            {slides.map((slide, index) => (
              <CarouselItem key={index}>
                <OnboardingSlide
                  headline={slide.headline}
                  text={slide.text}
                  visualPlaceholder={slide.visualPlaceholder}
                  imageSrc={slide.imageSrc}
                >
                  {index === 2 && (
                    <div className="space-y-3">
                      <Button 
                        onClick={handleSignUp}
                        className="w-full py-6 bg-purple-500 hover:bg-purple-600 text-white rounded-xl text-lg font-semibold shadow-md hover:shadow-lg transition-all duration-200"
                      >
                        Sign Up
                      </Button>
                      <Button 
                        onClick={handleLogin}
                        variant="outline"
                        className="w-full py-6 border-2 border-purple-500 text-purple-500 hover:bg-purple-50 rounded-xl text-lg font-semibold transition-all duration-200"
                      >
                        Log In
                      </Button>
                    </div>
                  )}
                </OnboardingSlide>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>

        {/* Progress Indicators */}
        <div className="flex justify-center space-x-2 mt-8">
          {Array.from({ length: count }, (_, index) => (
            <div
              key={index}
              className={`h-2 w-2 rounded-full transition-all duration-300 ${
                index + 1 === current 
                  ? 'bg-purple-500 w-6' 
                  : 'bg-purple-200'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default OnboardingPage;
