
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import EmailInput from '@/components/signup/EmailInput';
import { ValidationStatus } from '@/hooks/useEmailValidation';

interface SignUpFormProps {
  firstName: string;
  setFirstName: (value: string) => void;
  lastName: string;
  setLastName: (value: string) => void;
  email: string;
  setEmail: (value: string) => void;
  password: string;
  setPassword: (value: string) => void;
  phoneNumber: string;
  setPhoneNumber: (value: string) => void;
  isLoading: boolean;
}

const SignUpForm = ({
  firstName,
  setFirstName,
  lastName,
  setLastName,
  email,
  setEmail,
  password,
  setPassword,
  phoneNumber,
  setPhoneNumber,
  isLoading
}: SignUpFormProps) => {
  const [emailValidationStatus, setEmailValidationStatus] = useState<ValidationStatus>('idle');
  const [emailValidationMessage, setEmailValidationMessage] = useState<string>('');

  const handleEmailValidationChange = (status: ValidationStatus, message?: string) => {
    setEmailValidationStatus(status);
    setEmailValidationMessage(message || '');
  };

  const isEmailValid = emailValidationStatus === 'valid';
  const hasEmailError = emailValidationStatus === 'error';

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <Input
          type="text"
          placeholder="First Name"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          disabled={isLoading}
          className="py-3 text-lg"
        />
        <Input
          type="text"
          placeholder="Last Name"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          disabled={isLoading}
          className="py-3 text-lg"
        />
      </div>

      <div className="space-y-2">
        <EmailInput
          email={email}
          onEmailChange={setEmail}
          onValidationChange={handleEmailValidationChange}
          disabled={isLoading}
        />
        
        {hasEmailError && emailValidationMessage && (
          <div className="text-sm text-red-600 flex items-center gap-2">
            <span>⚠️</span>
            <span>{emailValidationMessage}</span>
          </div>
        )}
        
        {isEmailValid && (
          <div className="text-sm text-green-600 flex items-center gap-2">
            <span>✓</span>
            <span>Email is available</span>
          </div>
        )}
      </div>

      <Input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        disabled={isLoading}
        className="py-3 text-lg"
      />

      <Input
        type="tel"
        placeholder="Phone Number"
        value={phoneNumber}
        onChange={(e) => setPhoneNumber(e.target.value)}
        disabled={isLoading}
        className="py-3 text-lg"
      />
    </div>
  );
};

export default SignUpForm;
