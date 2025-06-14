
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { useNavigate } from 'react-router-dom';

interface SignUpData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phoneNumber: string;
  profilePrivacySetting: 'public' | 'private';
  profilePhoto?: File;
}

export const useSignUpFlow = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const signUp = async (signUpData: SignUpData) => {
    setIsLoading(true);
    
    try {
      console.log('Starting sign up process with data:', signUpData);
      
      const redirectUrl = `${window.location.origin}/home`;
      
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
        description: 'Welcome to ParentPal! Please check your email to verify your account.',
      });

      // Navigate to home - the AuthContext will handle profile creation
      navigate('/home');
      
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
