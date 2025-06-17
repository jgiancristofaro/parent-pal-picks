
import { useState, useCallback, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

export type ValidationStatus = 'idle' | 'checking' | 'exists' | 'available' | 'error';

interface EmailValidationState {
  status: ValidationStatus;
  message: string;
}

export const useEmailValidation = () => {
  const [validationState, setValidationState] = useState<EmailValidationState>({
    status: 'idle',
    message: ''
  });
  const { toast } = useToast();
  const abortControllerRef = useRef<AbortController | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const resetValidation = useCallback(() => {
    console.log('useEmailValidation: Resetting validation state');
    
    // Cancel any ongoing request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    
    // Clear timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    
    setValidationState({ status: 'idle', message: '' });
  }, []);

  const checkEmailExists = useCallback(async (email: string) => {
    // Cancel any ongoing request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // Clear any existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    if (!email || !email.includes('@')) {
      console.log('useEmailValidation: Invalid email, resetting');
      setValidationState({ status: 'idle', message: '' });
      return;
    }

    console.log('useEmailValidation: Starting check for email:', email);
    
    // Create new abort controller for this request
    abortControllerRef.current = new AbortController();
    setValidationState({ status: 'checking', message: 'Checking email availability...' });
    
    // Set a timeout to prevent getting stuck in checking state
    timeoutRef.current = setTimeout(() => {
      console.log('useEmailValidation: Timeout reached, resetting validation');
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      setValidationState({ 
        status: 'error', 
        message: 'Validation timeout. Please try again.' 
      });
    }, 5000); // 5 second timeout
    
    try {
      const { data, error } = await supabase.rpc('check_if_email_exists', {
        p_email: email.toLowerCase().trim()
      });

      // Check if request was aborted
      if (abortControllerRef.current?.signal.aborted) {
        console.log('useEmailValidation: Request was aborted');
        return;
      }

      // Clear timeout since we got a response
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }

      console.log('useEmailValidation: RPC response - data:', data, 'error:', error);

      if (error) {
        console.error('useEmailValidation: RPC error:', error);
        setValidationState({ 
          status: 'error', 
          message: 'Unable to validate email. Please try again.' 
        });
        toast({
          title: "Validation error",
          description: "Unable to validate email. Please try again.",
          variant: "destructive",
        });
        return;
      }

      // Parse response
      let exists = false;
      if (typeof data === 'object' && data !== null && 'exists' in data) {
        exists = Boolean(data.exists);
      } else if (typeof data === 'boolean') {
        exists = data;
      } else {
        console.error('useEmailValidation: Unexpected response format:', data);
        setValidationState({ 
          status: 'error', 
          message: 'Unexpected response format. Please try again.' 
        });
        return;
      }

      console.log('useEmailValidation: Email exists:', exists);
      
      if (exists) {
        setValidationState({ 
          status: 'exists', 
          message: 'An account with this email already exists.' 
        });
      } else {
        setValidationState({ 
          status: 'available', 
          message: 'Email is available' 
        });
      }
      
    } catch (error) {
      // Don't process errors for aborted requests
      if (error instanceof Error && error.name === 'AbortError') {
        console.log('useEmailValidation: Request aborted');
        return;
      }
      
      console.error('useEmailValidation: Catch block error:', error);
      
      // Clear timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
      
      setValidationState({ 
        status: 'error', 
        message: 'Network error. Please check your connection and try again.' 
      });
      
      toast({
        title: "Validation error",
        description: "Network error. Please check your connection and try again.",
        variant: "destructive",
      });
    } finally {
      // Clean up abort controller
      abortControllerRef.current = null;
    }
  }, [toast]);

  return {
    validationState,
    checkEmailExists,
    resetValidation,
  };
};
