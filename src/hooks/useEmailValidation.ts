
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface EmailValidationResult {
  exists: boolean | null;
  isChecking: boolean;
  error: string | null;
}

export const useEmailValidation = () => {
  const [validationState, setValidationState] = useState<EmailValidationResult>({
    exists: null,
    isChecking: false,
    error: null,
  });

  const checkEmailExists = useCallback(async (email: string) => {
    if (!email.trim()) {
      setValidationState({ exists: null, isChecking: false, error: null });
      return;
    }

    // Basic email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setValidationState({ exists: null, isChecking: false, error: null });
      return;
    }

    setValidationState({ exists: null, isChecking: true, error: null });

    try {
      const { data, error } = await supabase.functions.invoke('check-email-exists', {
        body: { email },
      });

      if (error) {
        console.error('Error checking email:', error);
        setValidationState({ 
          exists: null, 
          isChecking: false, 
          error: 'Failed to validate email' 
        });
        return;
      }

      setValidationState({ 
        exists: data.exists, 
        isChecking: false, 
        error: null 
      });
    } catch (error) {
      console.error('Unexpected error validating email:', error);
      setValidationState({ 
        exists: null, 
        isChecking: false, 
        error: 'Failed to validate email' 
      });
    }
  }, []);

  const resetValidation = useCallback(() => {
    setValidationState({ exists: null, isChecking: false, error: null });
  }, []);

  return {
    ...validationState,
    checkEmailExists,
    resetValidation,
  };
};
