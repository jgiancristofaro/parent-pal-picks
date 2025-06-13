
import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface NameStepProps {
  firstName: string;
  lastName: string;
  onNext: () => void;
  onUpdate: (data: { firstName?: string; lastName?: string }) => void;
}

const NameStep = ({ firstName, lastName, onNext, onUpdate }: NameStepProps) => {
  const handleNext = () => {
    if (firstName.trim() && lastName.trim()) {
      onNext();
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-4">What's your name?</h2>
        <p className="text-gray-600">Let's start with the basics</p>
      </div>

      <div className="space-y-4">
        <Input
          type="text"
          placeholder="First Name"
          value={firstName}
          onChange={(e) => onUpdate({ firstName: e.target.value })}
          className="w-full py-3 text-lg"
        />
        
        <Input
          type="text"
          placeholder="Last Name"
          value={lastName}
          onChange={(e) => onUpdate({ lastName: e.target.value })}
          className="w-full py-3 text-lg"
        />
      </div>

      <Button
        onClick={handleNext}
        disabled={!firstName.trim() || !lastName.trim()}
        className="w-full py-6 bg-purple-500 hover:bg-purple-600 text-white rounded-lg text-lg"
      >
        Continue
      </Button>
    </div>
  );
};

export default NameStep;
