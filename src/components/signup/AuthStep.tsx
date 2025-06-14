
import React, { useEffect, useCallback } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, AlertCircle, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import PrivacySettingsCard from '@/components/auth/PrivacySettingsCard';
import { useEmailValidation } from '@/hooks/useEmailValidation';

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
  const { exists: emailExists, isChecking, error, checkEmailExists, resetValidation } = useEmailValidation();

  // Debounced email validation
  const debouncedEmailCheck = useCallback(
    (() => {
      let timeoutId: NodeJS.Timeout;
      return (emailValue: string) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
          checkEmailExists(emailValue);
        }, 500);
      };
    })(),
    [checkEmailExists]
  );

  useEffect(() => {
    if (email.trim()) {
      debouncedEmailCheck(email);
    } else {
      resetValidation();
    }
  }, [email, debouncedEmailCheck, resetValidation]);

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onUpdate({ email: e.target.value });
  };

  const handleNext = () => {
    if (email.trim() && password.trim() && phoneNumber.trim() && !emailExists) {
      onNext();
    }
  };

  const isFormValid = email.trim() && password.trim() && phoneNumber.trim() && !emailExists;

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-4">Account Details</h2>
        <p className="text-gray-600">Create your secure account</p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <div className="relative">
            <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={handleEmailChange}
              className="w-full py-3 text-lg pr-10"
            />
            {isChecking && (
              <Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 animate-spin text-gray-400" />
            )}
            {!isChecking && emailExists === false && email.trim() && (
              <CheckCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-green-500" />
            )}
            {!isChecking && emailExists === true && (
              <AlertCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-red-500" />
            )}
          </div>
          
          {emailExists === true && (
            <Alert className="border-red-200 bg-red-50">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-700">
                An account with this email already exists.{' '}
                <Link 
                  to="/login" 
                  className="font-medium text-red-800 hover:text-red-900 underline"
                >
                  Sign in instead
                </Link>
              </AlertDescription>
            </Alert>
          )}
          
          {error && (
            <Alert className="border-red-200 bg-red-50">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-700">
                {error}
              </AlertDescription>
            </Alert>
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
          disabled={!isFormValid || isChecking}
          className="flex-1 py-6 bg-purple-500 hover:bg-purple-600 text-white rounded-lg text-lg disabled:opacity-50"
        >
          {isChecking ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Validating...
            </>
          ) : (
            'Continue'
          )}
        </Button>
      </div>
    </div>
  );
};

export default AuthStep;
