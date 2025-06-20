
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

interface SignUpData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phoneNumber: string;
  profilePrivacySetting: 'public' | 'private';
  profilePhoto?: File;
  referralCode?: string;
}

export const useSignUpFlow = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const signUp = async (signUpData: SignUpData) => {
    setIsLoading(true);
    
    try {
      console.log('Starting sign up process with data:', signUpData);
      
      // Updated redirect URL to go to step 5 after email verification (since we added referral step)
      const redirectUrl = `${window.location.origin}/signup?step=5&verified=true`;
      
      const { data, error } = await supabase.auth.signUp({
        email: signUpData.email,
        password: signUpData.password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            first_name: signUpData.firstName,
            last_name: signUpData.lastName,
            phone_number: signUpData.phoneNumber,
            profile_privacy_setting: signUpData.profilePrivacySetting,
            phone_number_searchable: false,
            referral_code: signUpData.referralCode || null,
          }
        }
      });

      if (error) {
        console.error('Sign up error:', error);
        toast({
          title: 'Sign up failed',
          description: error.message,
          variant: 'destructive',
        });
        return { success: false, error };
      }

      console.log('Sign up successful:', data);
      
      toast({
        title: 'Account created successfully!',
        description: 'Please check your email to verify your account before continuing.',
      });

      // Return success without navigating - let the calling component handle the flow
      return { success: true, data };
      
    } catch (error) {
      console.error('Unexpected sign up error:', error);
      toast({
        title: 'Sign up failed',
        description: 'An unexpected error occurred. Please try again.',
        variant: 'destructive',
      });
      return { success: false, error };
    } finally {
      setIsLoading(false);
    }
  };

  return {
    signUp,
    isLoading,
  };
};
