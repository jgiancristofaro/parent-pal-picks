
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

interface EmailExistsResponse {
  exists: boolean;
}

export const useEmailValidation = () => {
  const [isChecking, setIsChecking] = useState(false);
  const [emailExists, setEmailExists] = useState<boolean | null>(null);
  const { toast } = useToast();

  const checkEmailExists = useCallback(async (email: string) => {
    if (!email || !email.includes('@')) {
      console.log('useEmailValidation: Invalid email, skipping check');
      setEmailExists(null);
      return;
    }

    console.log('useEmailValidation: Starting check for email:', email);
    setIsChecking(true);
    
    try {
      const { data, error } = await supabase.rpc('check_if_email_exists', {
        p_email: email.toLowerCase().trim()
      });

      console.log('useEmailValidation: RPC response - data:', data, 'error:', error);

      if (error) {
        console.error('useEmailValidation: RPC error:', error);
        toast({
          title: "Validation error",
          description: "Unable to validate email. Please try again.",
          variant: "destructive",
        });
        setEmailExists(null);
        return;
      }

      // Improved response parsing with better error handling
      let response: EmailExistsResponse;
      
      if (typeof data === 'object' && data !== null && 'exists' in data) {
        response = data as unknown as EmailExistsResponse;
      } else {
        console.error('useEmailValidation: Unexpected response format:', data);
        setEmailExists(null);
        toast({
          title: "Validation error",
          description: "Unexpected response format. Please try again.",
          variant: "destructive",
        });
        return;
      }

      console.log('useEmailValidation: Email exists:', response.exists);
      setEmailExists(response.exists || false);
      
    } catch (error) {
      console.error('useEmailValidation: Catch block error:', error);
      setEmailExists(null);
      toast({
        title: "Validation error",
        description: "Network error. Please check your connection and try again.",
        variant: "destructive",
      });
    } finally {
      console.log('useEmailValidation: Setting isChecking to false');
      setIsChecking(false);
    }
  }, [toast]);

  const resetValidation = useCallback(() => {
    console.log('useEmailValidation: Resetting validation state');
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
