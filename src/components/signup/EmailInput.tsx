
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
  const { checkEmailExists, isChecking, emailExists } = useEmailValidation();
  const debouncedEmail = useDebounce(email, 500);

  // Basic email validation regex
  const isValidEmailFormat = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleEmailBlur = async () => {
    if (!email || !isValidEmailFormat(email)) {
      onValidationChange?.('idle');
      return;
    }

    onValidationChange?.('checking');
    await checkEmailExists(email);
  };

  // Effect to handle real-time validation as user types (debounced)
  useEffect(() => {
    if (debouncedEmail && isValidEmailFormat(debouncedEmail)) {
      onValidationChange?.('checking');
      checkEmailExists(debouncedEmail);
    } else if (debouncedEmail && !isValidEmailFormat(debouncedEmail)) {
      onValidationChange?.('idle');
    }
  }, [debouncedEmail, checkEmailExists, onValidationChange]);

  // Effect to update parent component when validation status changes
  useEffect(() => {
    if (!email || !isValidEmailFormat(email)) {
      onValidationChange?.('idle');
      return;
    }

    if (isChecking) {
      onValidationChange?.('checking');
    } else if (emailExists === true) {
      onValidationChange?.('exists', 'An account with this email already exists.');
    } else if (emailExists === false) {
      onValidationChange?.('available');
    }
  }, [isChecking, emailExists, email, onValidationChange]);

  return (
    <Input
      type="email"
      placeholder="Email"
      value={email}
      onChange={(e) => onEmailChange(e.target.value)}
      onBlur={handleEmailBlur}
      disabled={disabled}
      className="w-full py-3 text-lg"
    />
  );
};

export default EmailInput;
