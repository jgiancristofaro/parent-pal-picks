
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import OnboardingSlide from '@/components/onboarding/OnboardingSlide';
import { ChevronRight, ChevronLeft } from 'lucide-react';

const OnboardingPage = () => {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);

  const onboardingData = [
    {
      headline: "ParentPal: Trusted picks for your little one, powered by friends you know.",
      text: "Discover babysitters and baby products trusted and recommended by friends you know.",
      backgroundColor: "bg-purple-50"
    },
    {
      headline: "Find Sitters Your Neighbors Trust.",
      text: "Get hyper-local recommendations, even from parents in your own building or neighborhood.",
      backgroundColor: "bg-blue-50"
    },
    {
      headline: "Shop Smarter, Not Harder.",
      text: "Cut through the noise with curated product picks from your trusted circle.",
      backgroundColor: "bg-green-50"
    }
  ];

  const handleGetStarted = () => {
    localStorage.setItem('hasSeenParentPalOnboarding', 'true');
    navigate('/login');
  };

  const handleSkip = () => {
    localStorage.setItem('hasSeenParentPalOnboarding', 'true');
    navigate('/login');
  };

  const isLastSlide = currentSlide === onboardingData.length - 1;

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <div className="flex justify-between items-center p-6 absolute top-0 left-0 right-0 z-10">
        <div className="text-2xl font-bold text-purple-600">ParentPal</div>
        <Button 
          variant="ghost" 
          onClick={handleSkip}
          className="text-gray-500 hover:text-gray-700"
        >
          Skip
        </Button>
      </div>

      {/* Carousel */}
      <div className="flex-1 relative">
        <Carousel className="h-full">
          <CarouselContent className="h-full">
            {onboardingData.map((slide, index) => (
              <CarouselItem key={index} className="h-full">
                <OnboardingSlide
                  headline={slide.headline}
                  text={slide.text}
                  backgroundColor={slide.backgroundColor}
                />
              </CarouselItem>
            ))}
          </CarouselContent>
          
          {/* Custom navigation buttons */}
          <CarouselPrevious className="left-4" />
          <CarouselNext className="right-4" />
        </Carousel>
      </div>

      {/* Progress indicators and CTA */}
      <div className="p-6 bg-white">
        {/* Progress dots */}
        <div className="flex justify-center mb-6">
          {onboardingData.map((_, index) => (
            <div
              key={index}
              className={`w-2 h-2 rounded-full mx-1 transition-colors ${
                index === currentSlide ? 'bg-purple-600' : 'bg-gray-300'
              }`}
            />
          ))}
        </div>

        {/* Action buttons */}
        <div className="flex flex-col gap-3 max-w-md mx-auto">
          {isLastSlide ? (
            <>
              <Button 
                onClick={handleGetStarted}
                className="w-full py-6 bg-purple-500 hover:bg-purple-600 text-white rounded-lg text-lg"
              >
                Get Started
              </Button>
              <Button 
                variant="outline"
                onClick={() => navigate('/login-existing')}
                className="w-full py-6 border-purple-200 text-purple-600 hover:bg-purple-50 rounded-lg text-lg"
              >
                I Already Have an Account
              </Button>
            </>
          ) : (
            <div className="flex gap-3">
              {currentSlide > 0 && (
                <Button 
                  variant="outline"
                  onClick={() => setCurrentSlide(currentSlide - 1)}
                  className="flex-1 py-4 border-gray-200 text-gray-600 hover:bg-gray-50"
                >
                  <ChevronLeft className="w-4 h-4 mr-1" />
                  Previous
                </Button>
              )}
              <Button 
                onClick={() => setCurrentSlide(currentSlide + 1)}
                className="flex-1 py-4 bg-purple-500 hover:bg-purple-600 text-white"
              >
                Next
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OnboardingPage;
