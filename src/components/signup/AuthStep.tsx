
import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import PrivacySettingsCard from '@/components/auth/PrivacySettingsCard';

interface AuthStepProps {
  email: string;
  password: string;
  phoneNumber: string;
  profilePrivacySetting: 'public' | 'private';
  onNext: () => void;
  onPrev: () => void;
  onUpdate: (data: { 
    email?: string; 
    password?: string; 
    phoneNumber?: string; 
    profilePrivacySetting?: 'public' | 'private' 
  }) => void;
}

const AuthStep = ({ 
  email, 
  password, 
  phoneNumber, 
  profilePrivacySetting, 
  onNext, 
  onPrev, 
  onUpdate 
}: AuthStepProps) => {
  const handleNext = () => {
    if (email.trim() && password.trim() && phoneNumber.trim()) {
      onNext();
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-4">Account Details</h2>
        <p className="text-gray-600">Create your secure account</p>
      </div>

      <div className="space-y-4">
        <Input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => onUpdate({ email: e.target.value })}
          className="w-full py-3 text-lg"
        />
        
        <Input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => onUpdate({ password: e.target.value })}
          className="w-full py-3 text-lg"
        />

        <Input
          type="tel"
          placeholder="Phone Number"
          value={phoneNumber}
          onChange={(e) => onUpdate({ phoneNumber: e.target.value })}
          className="w-full py-3 text-lg"
        />
      </div>

      <PrivacySettingsCard
        profilePrivacySetting={profilePrivacySetting}
        setProfilePrivacySetting={(value) => onUpdate({ profilePrivacySetting: value })}
      />

      <div className="flex gap-4">
        <Button
          onClick={onPrev}
          variant="outline"
          className="flex-1 py-6 text-lg"
        >
          Back
        </Button>
        
        <Button
          onClick={handleNext}
          disabled={!email.trim() || !password.trim() || !phoneNumber.trim()}
          className="flex-1 py-6 bg-purple-500 hover:bg-purple-600 text-white rounded-lg text-lg"
        >
          Continue
        </Button>
      </div>
    </div>
  );
};

export default AuthStep;
