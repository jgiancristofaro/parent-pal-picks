
import React, { useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { useEmailValidation } from '@/hooks/useEmailValidation';
import { useDebounce } from '@/hooks/useDebounce';

interface EmailInputProps {
  email: string;
  onEmailChange: (email: string) => void;
  disabled?: boolean;
}

const EmailInput = ({ email, onEmailChange, disabled = false }: EmailInputProps) => {
  const { checkEmailExists, isChecking, emailExists } = useEmailValidation();
  const debouncedEmail = useDebounce(email, 500);

  useEffect(() => {
    if (debouncedEmail && debouncedEmail.includes('@')) {
      checkEmailExists(debouncedEmail);
    }
  }, [debouncedEmail, checkEmailExists]);

  const getValidationIcon = () => {
    if (!email || !email.includes('@')) return null;
    
    if (isChecking) {
      return <Loader2 className="h-4 w-4 animate-spin text-gray-400" />;
    }
    
    if (emailExists === true) {
      return <XCircle className="h-4 w-4 text-red-500" />;
    }
    
    if (emailExists === false) {
      return <CheckCircle className="h-4 w-4 text-green-500" />;
    }
    
    return null;
  };

  const getValidationMessage = () => {
    if (!email || !email.includes('@')) return null;
    
    if (isChecking) {
      return <span className="text-sm text-gray-500">Checking availability...</span>;
    }
    
    if (emailExists === true) {
      return <span className="text-sm text-red-500">This email is already registered</span>;
    }
    
    if (emailExists === false) {
      return <span className="text-sm text-green-500">Email is available</span>;
    }
    
    return null;
  };

  return (
    <div className="space-y-2">
      <div className="relative">
        <Input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => onEmailChange(e.target.value)}
          disabled={disabled}
          className={`w-full py-3 pr-10 text-lg ${
            emailExists === true ? 'border-red-500 focus:border-red-500' : 
            emailExists === false ? 'border-green-500 focus:border-green-500' : ''
          }`}
        />
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
          {getValidationIcon()}
        </div>
      </div>
      {getValidationMessage()}
    </div>
  );
};

export default EmailInput;
