import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import PrivacySettingsCard from '@/components/auth/PrivacySettingsCard';
import EmailInput from './EmailInput';

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
  const [emailValidation, setEmailValidation] = useState({ 
    status: 'idle' as 'idle' | 'checking' | 'exists' | 'available', 
    message: '' 
  });
  const navigate = useNavigate();

  const handleNext = () => {
    if (email.trim() && password.trim() && phoneNumber.trim() && 
        emailValidation.status !== 'checking' && emailValidation.status !== 'exists') {
      onNext();
    }
  };

  const handleEmailValidationChange = (status: 'idle' | 'checking' | 'exists' | 'available', message: string = '') => {
    setEmailValidation({ status, message });
  };

  const handleLoginRedirect = () => {
    navigate('/login');
  };

  const isNextDisabled = !email.trim() || !password.trim() || !phoneNumber.trim() || 
                        emailValidation.status === 'checking' || emailValidation.status === 'exists';

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-4">Account Details</h2>
        <p className="text-gray-600">Create your secure account</p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <EmailInput
            email={email}
            onEmailChange={(value) => onUpdate({ email: value })}
            onValidationChange={handleEmailValidationChange}
          />
          
          {emailValidation.status === 'checking' && (
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Checking email availability...</span>
            </div>
          )}
          
          {emailValidation.status === 'exists' && (
            <div className="space-y-1">
              <p className="text-sm text-red-500">{emailValidation.message}</p>
              <button
                onClick={handleLoginRedirect}
                className="text-sm text-blue-600 hover:text-blue-800 underline"
              >
                Log in instead
              </button>
            </div>
          )}

          {emailValidation.status === 'available' && (
            <p className="text-sm text-green-600">Email is available!</p>
          )}
        </div>
        
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
          disabled={isNextDisabled}
          className="flex-1 py-6 bg-purple-500 hover:bg-purple-600 text-white rounded-lg text-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Continue
        </Button>
      </div>
    </div>
  );
};

export default AuthStep;
