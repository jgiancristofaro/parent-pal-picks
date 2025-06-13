
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Camera, User } from 'lucide-react';

interface PhotoStepProps {
  onNext: () => void;
  onPrev: () => void;
  onUpdate: (data: { profilePhoto?: File }) => void;
}

const PhotoStep = ({ onNext, onPrev, onUpdate }: PhotoStepProps) => {
  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-4">Add a Photo</h2>
        <p className="text-gray-600">Help other parents recognize you</p>
      </div>

      <Card className="p-8 text-center">
        <div className="w-24 h-24 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center">
          <User className="w-12 h-12 text-gray-400" />
        </div>
        
        <Button variant="outline" className="mb-4">
          <Camera className="w-4 h-4 mr-2" />
          Upload Photo
        </Button>
        
        <p className="text-sm text-gray-500">Optional - you can skip this step</p>
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
          onClick={onNext}
          className="flex-1 py-6 bg-purple-500 hover:bg-purple-600 text-white rounded-lg text-lg"
        >
          Continue
        </Button>
      </div>
    </div>
  );
};

export default PhotoStep;
