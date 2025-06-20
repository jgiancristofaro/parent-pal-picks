
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import SignUpForm from '@/components/auth/SignUpForm';
import PrivacySettingsCard from '@/components/auth/PrivacySettingsCard';
import { useSignUpFlow } from '@/hooks/useSignUpFlow';
import { ValidationStatus } from '@/hooks/useEmailValidation';

interface AuthStepProps {
  email: string;
  password: string;
  phoneNumber: string;
  profilePrivacySetting: 'public' | 'private';
  firstName: string;
  lastName: string;
  referralCode?: string;
  onNext: () => void;
  onPrev: () => void;
  onUpdate: (data: any) => void;
}

const AuthStep = ({
  email,
  password,
  phoneNumber,
  profilePrivacySetting,
  firstName,
  lastName,
  referralCode,
  onNext,
  onPrev,
  onUpdate
}: AuthStepProps) => {
  const { signUp, isLoading } = useSignUpFlow();
  const [emailValidationStatus, setEmailValidationStatus] = useState<ValidationStatus>('idle');

  const handleEmailValidationChange = (status: ValidationStatus) => {
    setEmailValidationStatus(status);
  };

  const canSubmit = () => {
    // Check if all required fields are filled
    const hasRequiredFields = email && password && firstName && lastName && phoneNumber;
    
    // Check if email validation is either available or idle (not error or exists)
    const isEmailOk = emailValidationStatus === 'available' || 
                      (emailValidationStatus === 'idle' && email.trim() === '');
    
    return hasRequiredFields && isEmailOk && !isLoading;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Prevent submission if email validation shows an error or exists
    if (emailValidationStatus === 'error' || emailValidationStatus === 'exists') {
      return;
    }
    
    if (!canSubmit()) {
      return;
    }

    const signUpData = {
      firstName,
      lastName,
      email,
      password,
      phoneNumber,
      profilePrivacySetting,
      referralCode
    };

    const result = await signUp(signUpData);
    
    if (result.success) {
      onNext();
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <Card>
        <CardHeader className="text-center">
          <CardTitle>Create your account</CardTitle>
          <CardDescription>
            Enter your details to join ParentPal
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <SignUpForm
              firstName={firstName}
              setFirstName={(value) => onUpdate({ firstName: value })}
              lastName={lastName}
              setLastName={(value) => onUpdate({ lastName: value })}
              email={email}
              setEmail={(value) => onUpdate({ email: value })}
              password={password}
              setPassword={(value) => onUpdate({ password: value })}
              phoneNumber={phoneNumber}
              setPhoneNumber={(value) => onUpdate({ phoneNumber: value })}
              isLoading={isLoading}
              onEmailValidationChange={handleEmailValidationChange}
            />

            <PrivacySettingsCard
              profilePrivacySetting={profilePrivacySetting}
              setProfilePrivacySetting={(value) => onUpdate({ profilePrivacySetting: value })}
            />

            {referralCode && (
              <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                <div className="text-sm text-green-700">
                  ✓ Using referral code: <strong>{referralCode}</strong>
                </div>
              </div>
            )}

            <div className="flex gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={onPrev}
                className="flex-1"
              >
                Back
              </Button>
              <Button
                type="submit"
                disabled={!canSubmit()}
                className="flex-1"
              >
                {isLoading ? 'Creating Account...' : 'Create Account'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AuthStep;
