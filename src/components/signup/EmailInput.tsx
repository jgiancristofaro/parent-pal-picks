
import React, { useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { useEmailValidation, ValidationStatus } from '@/hooks/useEmailValidation';
import { useDebounce } from '@/hooks/useDebounce';

interface EmailInputProps {
  email: string;
  onEmailChange: (email: string) => void;
  onValidationChange?: (status: ValidationStatus, message?: string) => void;
  disabled?: boolean;
}

const EmailInput = ({ email, onEmailChange, onValidationChange, disabled = false }: EmailInputProps) => {
  const { validationState, checkEmailExists, resetValidation } = useEmailValidation();
  const debouncedEmail = useDebounce(email, 800);

  // Basic email validation regex
  const isValidEmailFormat = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Single effect to handle validation based on debounced email
  useEffect(() => {
    console.log('EmailInput: debouncedEmail changed:', debouncedEmail);
    
    if (!debouncedEmail || debouncedEmail.trim() === '') {
      console.log('EmailInput: Empty email, resetting validation');
      resetValidation();
      return;
    }

    if (!isValidEmailFormat(debouncedEmail)) {
      console.log('EmailInput: Invalid email format');
      resetValidation();
      return;
    }

    console.log('EmailInput: Starting email validation for:', debouncedEmail);
    checkEmailExists(debouncedEmail);
  }, [debouncedEmail, checkEmailExists, resetValidation]);

  // Effect to notify parent component of validation changes
  useEffect(() => {
    console.log('EmailInput: Validation state changed:', validationState);
    onValidationChange?.(validationState.status, validationState.message);
  }, [validationState, onValidationChange]);

  return (
    <Input
      type="email"
      placeholder="Email"
      value={email}
      onChange={(e) => onEmailChange(e.target.value)}
      disabled={disabled}
      className="w-full py-3 text-lg"
    />
  );
};

export default EmailInput;
