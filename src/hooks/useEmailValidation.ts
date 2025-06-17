
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

export const useEmailValidation = () => {
  const [isChecking, setIsChecking] = useState(false);
  const [emailExists, setEmailExists] = useState<boolean | null>(null);
  const { toast } = useToast();

  const checkEmailExists = useCallback(async (email: string) => {
    if (!email || !email.includes('@')) {
      setEmailExists(null);
      return;
    }

    setIsChecking(true);
    
    try {
      const { data, error } = await supabase.rpc('check_if_email_exists', {
        p_email: email.toLowerCase().trim()
      });

      if (error) {
        console.error('Email validation error:', error);
        toast({
          title: "Validation error",
          description: "Unable to validate email. Please try again.",
          variant: "destructive",
        });
        setEmailExists(null);
        return;
      }

      setEmailExists(data?.exists || false);
    } catch (error) {
      console.error('Email validation error:', error);
      setEmailExists(null);
    } finally {
      setIsChecking(false);
    }
  }, [toast]);

  const resetValidation = useCallback(() => {
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
