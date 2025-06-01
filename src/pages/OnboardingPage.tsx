
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Carousel, CarouselContent, CarouselItem } from '@/components/ui/carousel';

const OnboardingPage = () => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    localStorage.setItem('hasSeenParentPalOnboarding', 'true');
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <Carousel className="w-full">
          <CarouselContent>
            {/* Slide 1 */}
            <CarouselItem>
              <div className="text-center">
                <div className="h-80 bg-purple-100 flex items-center justify-center mb-6 rounded-lg">
                  <p className="text-purple-600 font-medium">Illustration/Image Placeholder for Screen 1</p>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Placeholder Headline for Screen 1
                </h2>
                <p className="text-gray-600 text-center">
                  Placeholder descriptive text for Screen 1.
                </p>
              </div>
            </CarouselItem>

            {/* Slide 2 */}
            <CarouselItem>
              <div className="text-center">
                <div className="h-80 bg-purple-100 flex items-center justify-center mb-6 rounded-lg">
                  <p className="text-purple-600 font-medium">Illustration/Image Placeholder for Screen 2</p>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Placeholder Headline for Screen 2
                </h2>
                <p className="text-gray-600 text-center">
                  Placeholder descriptive text for Screen 2.
                </p>
              </div>
            </CarouselItem>

            {/* Slide 3 */}
            <CarouselItem>
              <div className="text-center">
                <div className="h-80 bg-purple-100 flex items-center justify-center mb-6 rounded-lg">
                  <p className="text-purple-600 font-medium">Illustration/Image Placeholder for Screen 3</p>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Placeholder Headline for Screen 3
                </h2>
                <p className="text-gray-600 text-center mb-8">
                  Placeholder descriptive text for Screen 3.
                </p>
                
                {/* Action Buttons - Only on final slide */}
                <div className="space-y-3">
                  <Button 
                    onClick={handleGetStarted}
                    className="w-full py-6 bg-purple-500 hover:bg-purple-600 text-white rounded-lg text-lg"
                  >
                    Sign Up
                  </Button>
                  <Button 
                    onClick={handleGetStarted}
                    variant="outline"
                    className="w-full py-6 border-purple-500 text-purple-500 hover:bg-purple-50 rounded-lg text-lg"
                  >
                    Log In
                  </Button>
                </div>
              </div>
            </CarouselItem>
          </CarouselContent>
        </Carousel>
      </div>
    </div>
  );
};

export default OnboardingPage;
