
import React, { useState, useEffect } from 'react';
import { Progress } from '@/components/ui/progress';
import { useSearchParams } from 'react-router-dom';
import NameStep from '@/components/signup/NameStep';
import AuthStep from '@/components/signup/AuthStep';
import EmailVerificationStep from '@/components/signup/EmailVerificationStep';
import PhotoStep from '@/components/signup/PhotoStep';
import BuildNetworkStep from '@/components/signup/BuildNetworkStep';
import ConfirmationStep from '@/components/signup/ConfirmationStep';
import { ReferralCodeStep } from '@/components/signup/ReferralCodeStep';
import { useAuth } from '@/contexts/AuthContext';

interface SignUpData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phoneNumber: string;
  profilePrivacySetting: 'public' | 'private';
  profilePhoto?: File;
  referralCode?: string;
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
    referralCode: searchParams.get('ref') || '',
  });

  const totalSteps = 7; // Updated from 6 to 7 to include referral step
  const progressPercentage = (step / totalSteps) * 100;

  // Enhanced step resumption handling after email verification
  useEffect(() => {
    const urlStep = searchParams.get('step');
    const verified = searchParams.get('verified');
    
    if (urlStep && verified === 'true' && user && session) {
      console.log('📧 Email verification redirect detected:', {
        urlStep,
        userId: user.id,
        hasSession: !!session,
        emailConfirmed: !!user.email_confirmed_at
      });
      
      // Only proceed if email is actually confirmed
      if (user.email_confirmed_at) {
        const targetStep = parseInt(urlStep, 10);
        console.log('✅ Email confirmed, advancing to step:', targetStep);
        setStep(targetStep);
        localStorage.setItem('signupStep', targetStep.toString());
        
        // Clean up URL params
        setSearchParams({});
      } else {
        console.log('⚠️ Email not yet confirmed, staying on verification step');
        setStep(4); // Stay on email verification step
      }
    }
  }, [user, session, searchParams, setSearchParams]);

  // Save current step to localStorage
  useEffect(() => {
    localStorage.setItem('signupStep', step.toString());
  }, [step]);

  const nextStep = () => {
    if (step < totalSteps) {
      const nextStepNum = step + 1;
      console.log('➡️ Advancing to step:', nextStepNum);
      setStep(nextStepNum);
    }
  };

  const prevStep = () => {
    if (step > 1) {
      const prevStepNum = step - 1;
      console.log('⬅️ Going back to step:', prevStepNum);
      setStep(prevStepNum);
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
          <ReferralCodeStep
            referralCode={signUpData.referralCode || ''}
            setReferralCode={(code) => updateSignUpData({ referralCode: code })}
            onNext={nextStep}
            onSkip={nextStep}
          />
        );
      case 2:
        return (
          <NameStep
            firstName={signUpData.firstName}
            lastName={signUpData.lastName}
            onNext={nextStep}
            onPrev={prevStep}
            onUpdate={updateSignUpData}
          />
        );
      case 3:
        return (
          <AuthStep
            email={signUpData.email}
            password={signUpData.password}
            phoneNumber={signUpData.phoneNumber}
            profilePrivacySetting={signUpData.profilePrivacySetting}
            firstName={signUpData.firstName}
            lastName={signUpData.lastName}
            referralCode={signUpData.referralCode}
            onNext={nextStep}
            onPrev={prevStep}
            onUpdate={updateSignUpData}
          />
        );
      case 4:
        return (
          <EmailVerificationStep
            email={signUpData.email}
            onNext={nextStep}
            onPrev={prevStep}
          />
        );
      case 5:
        return (
          <PhotoStep
            onNext={nextStep}
            onPrev={prevStep}
            onUpdate={updateSignUpData}
          />
        );
      case 6:
        return (
          <BuildNetworkStep
            onNext={nextStep}
            onPrev={prevStep}
          />
        );
      case 7:
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
