
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { CheckCircle, Heart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface ConfirmationStepProps {
  onPrev: () => void;
}

const ConfirmationStep = ({ onPrev }: ConfirmationStepProps) => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate('/home');
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
        <h2 className="text-3xl font-bold mb-4">Welcome to ParentPal!</h2>
        <p className="text-gray-600">Your account has been created successfully</p>
      </div>

      <Card className="p-8 text-center space-y-6">
        <div className="space-y-4">
          <div className="mx-auto w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center">
            <Heart className="w-8 h-8 text-purple-600" />
          </div>
          
          <div>
            <h3 className="text-xl font-semibold mb-2">You're all set!</h3>
            <p className="text-gray-600">
              Start exploring recommendations from parents in your community and discover trusted products and services.
            </p>
          </div>
        </div>

        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
          <h4 className="font-medium text-purple-800 mb-2">What's next?</h4>
          <ul className="text-sm text-purple-700 space-y-1 text-left">
            <li>• Browse personalized recommendations</li>
            <li>• Connect with more parents in your area</li>
            <li>• Share your own experiences and reviews</li>
          </ul>
        </div>
      </Card>

      <div className="flex gap-4">
        <Button
          onClick={onPrev}
          variant="outline"
          className="flex-1 py-6 text-lg"
        >
          Back
        </Button>
        
        <Button
          onClick={handleGetStarted}
          className="flex-1 py-6 bg-purple-500 hover:bg-purple-600 text-white rounded-lg text-lg"
        >
          Get Started
        </Button>
      </div>
    </div>
  );
};

export default ConfirmationStep;
