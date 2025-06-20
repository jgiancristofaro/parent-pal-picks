
import React, { useState, useEffect } from 'react';
import { Progress } from '@/components/ui/progress';
import { useSearchParams } from 'react-router-dom';
import NameStep from '@/components/signup/NameStep';
import AuthStep from '@/components/signup/AuthStep';
import EmailVerificationStep from '@/components/signup/EmailVerificationStep';
import PhotoStep from '@/components/signup/PhotoStep';
import BuildNetworkStep from '@/components/signup/BuildNetworkStep';
import ConfirmationStep from '@/components/signup/ConfirmationStep';
import { useAuth } from '@/contexts/AuthContext';

interface SignUpData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phoneNumber: string;
  profilePrivacySetting: 'public' | 'private';
  profilePhoto?: File;
}

const SignUpFlow = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { user, session } = useAuth();
  
  // Initialize step from URL params or localStorage, default to 1
  const getInitialStep = () => {
    const urlStep = searchParams.get('step');
    const savedStep = localStorage.getItem('signupStep');
    
    if (urlStep) {
      return parseInt(urlStep, 10);
    }
    if (savedStep) {
      return parseInt(savedStep, 10);
    }
    return 1;
  };

  const [step, setStep] = useState(getInitialStep);
  const [signUpData, setSignUpData] = useState<SignUpData>({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    phoneNumber: '',
    profilePrivacySetting: 'private',
  });

  const totalSteps = 6; // Updated from 5 to 6
  const progressPercentage = (step / totalSteps) * 100;

  // Handle step resumption after email verification
  useEffect(() => {
    const urlStep = searchParams.get('step');
    const verified = searchParams.get('verified');
    
    if (urlStep && verified === 'true' && user && session) {
      // User has verified email and is authenticated, advance to the specified step
      const targetStep = parseInt(urlStep, 10);
      setStep(targetStep);
      localStorage.setItem('signupStep', targetStep.toString());
      
      // Clean up URL params
      setSearchParams({});
    }
  }, [user, session, searchParams, setSearchParams]);

  // Save current step to localStorage
  useEffect(() => {
    localStorage.setItem('signupStep', step.toString());
  }, [step]);

  const nextStep = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    }
  };

  const prevStep = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const updateSignUpData = (data: Partial<SignUpData>) => {
    setSignUpData(prev => ({ ...prev, ...data }));
  };

  const handleSignUpComplete = () => {
    // Clear signup progress when complete
    localStorage.removeItem('signupStep');
    nextStep();
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <NameStep
            firstName={signUpData.firstName}
            lastName={signUpData.lastName}
            onNext={nextStep}
            onUpdate={updateSignUpData}
          />
        );
      case 2:
        return (
          <AuthStep
            email={signUpData.email}
            password={signUpData.password}
            phoneNumber={signUpData.phoneNumber}
            profilePrivacySetting={signUpData.profilePrivacySetting}
            firstName={signUpData.firstName}
            lastName={signUpData.lastName}
            onNext={nextStep}
            onPrev={prevStep}
            onUpdate={updateSignUpData}
          />
        );
      case 3:
        return (
          <EmailVerificationStep
            email={signUpData.email}
            onNext={nextStep}
            onPrev={prevStep}
          />
        );
      case 4:
        return (
          <PhotoStep
            onNext={nextStep}
            onPrev={prevStep}
            onUpdate={updateSignUpData}
          />
        );
      case 5:
        return (
          <BuildNetworkStep
            onNext={nextStep}
            onPrev={prevStep}
          />
        );
      case 6:
        return (
          <ConfirmationStep
            onPrev={prevStep}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-purple-50">
      <div className="py-8 text-center">
        <h1 className="text-2xl font-bold">ParentPal</h1>
      </div>
      
      <div className="flex-grow flex flex-col items-center justify-center px-6 pb-16">
        <div className="w-full max-w-md">
          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-600">Step {step} of {totalSteps}</span>
              <span className="text-sm text-gray-600">{Math.round(progressPercentage)}%</span>
            </div>
            <Progress value={progressPercentage} className="w-full" />
          </div>

          {/* Render Current Step */}
          {renderStep()}
        </div>
      </div>
    </div>
  );
};

export default SignUpFlow;
