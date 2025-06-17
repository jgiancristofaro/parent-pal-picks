
import React, { useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { useEmailValidation } from '@/hooks/useEmailValidation';
import { useDebounce } from '@/hooks/useDebounce';

interface EmailInputProps {
  email: string;
  onEmailChange: (email: string) => void;
  onValidationChange?: (status: 'idle' | 'checking' | 'exists' | 'available', message?: string) => void;
  disabled?: boolean;
}

const EmailInput = ({ email, onEmailChange, onValidationChange, disabled = false }: EmailInputProps) => {
  const { checkEmailExists, isChecking, emailExists, resetValidation } = useEmailValidation();
  const debouncedEmail = useDebounce(email, 800);

  // Basic email validation regex
  const isValidEmailFormat = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Single validation trigger - only on debounced email change
  useEffect(() => {
    console.log('EmailInput: debouncedEmail changed:', debouncedEmail);
    
    if (!debouncedEmail || debouncedEmail.trim() === '') {
      console.log('EmailInput: Empty email, resetting validation');
      resetValidation();
      onValidationChange?.('idle');
      return;
    }

    if (!isValidEmailFormat(debouncedEmail)) {
      console.log('EmailInput: Invalid email format');
      resetValidation();
      onValidationChange?.('idle');
      return;
    }

    console.log('EmailInput: Starting email validation for:', debouncedEmail);
    onValidationChange?.('checking');
    checkEmailExists(debouncedEmail);
  }, [debouncedEmail, checkEmailExists, onValidationChange, resetValidation]);

  // Separate effect to handle validation state changes (UI updates only, no validation triggers)
  useEffect(() => {
    console.log('EmailInput: Validation state changed - isChecking:', isChecking, 'emailExists:', emailExists);
    
    // Only update UI if we have a valid email format
    if (!email || !isValidEmailFormat(email)) {
      onValidationChange?.('idle');
      return;
    }

    if (isChecking) {
      onValidationChange?.('checking');
    } else if (emailExists === true) {
      console.log('EmailInput: Email exists');
      onValidationChange?.('exists', 'An account with this email already exists.');
    } else if (emailExists === false) {
      console.log('EmailInput: Email available');
      onValidationChange?.('available');
    } else {
      // emailExists is null - this means validation was reset or failed
      onValidationChange?.('idle');
    }
  }, [isChecking, emailExists]); // Removed email and onValidationChange from dependencies to prevent loops

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
