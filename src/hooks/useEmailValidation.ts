
import { useState, useCallback, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

interface EmailExistsResponse {
  exists: boolean;
}

export const useEmailValidation = () => {
  const [isChecking, setIsChecking] = useState(false);
  const [emailExists, setEmailExists] = useState<boolean | null>(null);
  const { toast } = useToast();
  const abortControllerRef = useRef<AbortController | null>(null);

  const checkEmailExists = useCallback(async (email: string) => {
    // Cancel any ongoing request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    if (!email || !email.includes('@')) {
      console.log('useEmailValidation: Invalid email, skipping check');
      setEmailExists(null);
      setIsChecking(false);
      return;
    }

    console.log('useEmailValidation: Starting check for email:', email);
    
    // Create new abort controller for this request
    abortControllerRef.current = new AbortController();
    setIsChecking(true);
    
    try {
      const { data, error } = await supabase.rpc('check_if_email_exists', {
        p_email: email.toLowerCase().trim()
      });

      // Check if request was aborted
      if (abortControllerRef.current?.signal.aborted) {
        console.log('useEmailValidation: Request was aborted');
        return;
      }

      console.log('useEmailValidation: RPC response - data:', data, 'error:', error);

      if (error) {
        console.error('useEmailValidation: RPC error:', error);
        setEmailExists(null);
        setIsChecking(false);
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
        setEmailExists(null);
        setIsChecking(false);
        toast({
          title: "Validation error",
          description: "Unexpected response format. Please try again.",
          variant: "destructive",
        });
        return;
      }

      console.log('useEmailValidation: Email exists:', exists);
      setEmailExists(exists);
      
    } catch (error) {
      // Don't log errors for aborted requests
      if (error instanceof Error && error.name === 'AbortError') {
        console.log('useEmailValidation: Request aborted');
        return;
      }
      
      console.error('useEmailValidation: Catch block error:', error);
      setEmailExists(null);
      toast({
        title: "Validation error",
        description: "Network error. Please check your connection and try again.",
        variant: "destructive",
      });
    } finally {
      // Only update state if this request wasn't aborted
      if (!abortControllerRef.current?.signal.aborted) {
        console.log('useEmailValidation: Setting isChecking to false');
        setIsChecking(false);
      }
    }
  }, [toast]);

  const resetValidation = useCallback(() => {
    console.log('useEmailValidation: Resetting validation state');
    
    // Cancel any ongoing request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    
    setEmailExists(null);
    setIsChecking(false);
  }, []);

  return {
    checkEmailExists,
    resetValidation,
    isChecking,
    emailExists,
  };
};
