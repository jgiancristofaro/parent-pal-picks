
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { CheckCircle, Loader2 } from 'lucide-react';
import { useSignUpFlow } from '@/hooks/useSignUpFlow';

interface SignUpData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phoneNumber: string;
  profilePrivacySetting: 'public' | 'private';
  profilePhoto?: File;
}

interface ConfirmationStepProps {
  signUpData: SignUpData;
  onPrev: () => void;
}

const ConfirmationStep = ({ signUpData, onPrev }: ConfirmationStepProps) => {
  const { signUp, isLoading } = useSignUpFlow();

  const handleCreateAccount = async () => {
    await signUp(signUpData);
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
        <h2 className="text-3xl font-bold mb-4">Almost Done!</h2>
        <p className="text-gray-600">Review your information and create your account</p>
      </div>

      <Card className="p-6 space-y-4">
        <div>
          <h3 className="font-semibold text-gray-800">Name</h3>
          <p className="text-gray-600">{signUpData.firstName} {signUpData.lastName}</p>
        </div>
        
        <div>
          <h3 className="font-semibold text-gray-800">Email</h3>
          <p className="text-gray-600">{signUpData.email}</p>
        </div>
        
        <div>
          <h3 className="font-semibold text-gray-800">Phone</h3>
          <p className="text-gray-600">{signUpData.phoneNumber}</p>
        </div>
        
        <div>
          <h3 className="font-semibold text-gray-800">Privacy Setting</h3>
          <p className="text-gray-600 capitalize">{signUpData.profilePrivacySetting}</p>
        </div>
      </Card>

      <div className="flex gap-4">
        <Button
          onClick={onPrev}
          variant="outline"
          className="flex-1 py-6 text-lg"
          disabled={isLoading}
        >
          Back
        </Button>
        
        <Button
          onClick={handleCreateAccount}
          disabled={isLoading}
          className="flex-1 py-6 bg-purple-500 hover:bg-purple-600 text-white rounded-lg text-lg"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Creating Account...
            </>
          ) : (
            'Create Account'
          )}
        </Button>
      </div>
    </div>
  );
};

export default ConfirmationStep;
