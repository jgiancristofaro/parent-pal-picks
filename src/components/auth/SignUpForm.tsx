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
  onEmailValidationChange?: (status: ValidationStatus, message?: string) => void;
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
  isLoading,
  onEmailValidationChange
}: SignUpFormProps) => {
  const [emailValidationStatus, setEmailValidationStatus] = useState<ValidationStatus>('idle');
  const [emailValidationMessage, setEmailValidationMessage] = useState<string>('');
  const [phoneValidationError, setPhoneValidationError] = useState<string>('');

  const handleEmailValidationChange = (status: ValidationStatus, message?: string) => {
    setEmailValidationStatus(status);
    setEmailValidationMessage(message || '');
    onEmailValidationChange?.(status, message);
  };

  const validatePhoneNumber = (phone: string) => {
    // Remove all non-digit characters
    const cleanPhone = phone.replace(/\D/g, '');
    
    if (cleanPhone.length === 0) {
      setPhoneValidationError('');
      return true;
    }
    
    if (cleanPhone.length < 10) {
      setPhoneValidationError('Phone number must be at least 10 digits');
      return false;
    }
    
    if (cleanPhone.length > 11) {
      setPhoneValidationError('Phone number must be 10 or 11 digits');
      return false;
    }
    
    // If 11 digits, first digit should be 1 (US country code)
    if (cleanPhone.length === 11 && !cleanPhone.startsWith('1')) {
      setPhoneValidationError('11-digit numbers must start with 1');
      return false;
    }
    
    setPhoneValidationError('');
    return true;
  };

  const handlePhoneNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPhoneNumber(value);
    validatePhoneNumber(value);
  };

  const isEmailAvailable = emailValidationStatus === 'available';
  const hasEmailError = emailValidationStatus === 'exists' || emailValidationStatus === 'error';

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
        
        {isEmailAvailable && (
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

      <div className="space-y-2">
        <Input
          type="tel"
          placeholder="Phone Number"
          value={phoneNumber}
          onChange={handlePhoneNumberChange}
          disabled={isLoading}
          className={`py-3 text-lg ${phoneValidationError ? 'border-red-500' : ''}`}
        />
        
        {phoneValidationError && (
          <div className="text-sm text-red-600 flex items-center gap-2">
            <span>⚠️</span>
            <span>{phoneValidationError}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default SignUpForm;
