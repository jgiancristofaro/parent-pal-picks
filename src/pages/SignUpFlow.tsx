
import React, { useState } from 'react';
import { Progress } from '@/components/ui/progress';
import NameStep from '@/components/signup/NameStep';
import AuthStep from '@/components/signup/AuthStep';
import PhotoStep from '@/components/signup/PhotoStep';
import BuildNetworkStep from '@/components/signup/BuildNetworkStep';
import ConfirmationStep from '@/components/signup/ConfirmationStep';

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
  const [step, setStep] = useState(1);
  const [signUpData, setSignUpData] = useState<SignUpData>({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    phoneNumber: '',
    profilePrivacySetting: 'private',
  });

  const totalSteps = 5; // Updated to include the new network building step
  const progressPercentage = (step / totalSteps) * 100;

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
            onNext={nextStep}
            onPrev={prevStep}
            onUpdate={updateSignUpData}
          />
        );
      case 3:
        return (
          <PhotoStep
            onNext={nextStep}
            onPrev={prevStep}
            onUpdate={updateSignUpData}
          />
        );
      case 4:
        return (
          <BuildNetworkStep
            onNext={nextStep}
            onPrev={prevStep}
          />
        );
      case 5:
        return (
          <ConfirmationStep
            signUpData={signUpData}
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
