
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Mail, CheckCircle, Clock, RefreshCw } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

interface EmailVerificationStepProps {
  email: string;
  onNext: () => void;
  onPrev: () => void;
}

const EmailVerificationStep = ({ email, onNext, onPrev }: EmailVerificationStepProps) => {
  const [isResending, setIsResending] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const { user, session } = useAuth();
  const { toast } = useToast();

  // Handle resend cooldown
  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => {
        setResendCooldown(resendCooldown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  const handleResendEmail = async () => {
    if (resendCooldown > 0 || isResending) return;

    setIsResending(true);
    
    try {
      const redirectUrl = `${window.location.origin}/signup?step=5&verified=true`;
      
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: email,
        options: {
          emailRedirectTo: redirectUrl
        }
      });

      if (error) {
        toast({
          title: 'Error resending email',
          description: error.message,
          variant: 'destructive',
        });
      } else {
        toast({
          title: 'Email sent!',
          description: 'Please check your inbox for the verification email.',
        });
        setResendCooldown(60); // 60 second cooldown
      }
    } catch (error) {
      console.error('Error resending email:', error);
      toast({
        title: 'Error resending email',
        description: 'An unexpected error occurred. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsResending(false);
    }
  };

  const handleManualContinue = () => {
    // Only allow continuation if user is authenticated AND email is verified
    if (user && session && user.email_confirmed_at) {
      onNext();
    } else {
      toast({
        title: 'Email not verified',
        description: 'Please verify your email by clicking the link in your inbox before continuing.',
        variant: 'destructive',
      });
    }
  };

  // Check if user has verified their email
  const isEmailVerified = user && user.email_confirmed_at;

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-4">Check Your Email</h2>
        <p className="text-gray-600">We've sent a verification link to your email address</p>
      </div>

      <Card className="p-8 text-center">
        <div className="flex flex-col items-center space-y-6">
          <div className="p-4 bg-purple-100 rounded-full">
            <Mail className="w-12 h-12 text-purple-600" />
          </div>
          
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">Verification Email Sent</h3>
            <p className="text-gray-600">
              We've sent a verification link to:
            </p>
            <p className="font-medium text-purple-600">{email}</p>
          </div>

          {isEmailVerified && (
            <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center gap-2 text-green-700">
                <CheckCircle className="w-5 h-5" />
                <span className="text-sm font-medium">Email verified! You can now continue.</span>
              </div>
            </div>
          )}

          <div className="space-y-4 text-sm text-gray-500">
            <div className="flex items-center justify-center gap-2">
              <Clock className="w-4 h-4" />
              <span>This usually takes less than a minute</span>
            </div>
            
            <div className="space-y-2">
              <p>1. Check your inbox (and spam folder)</p>
              <p>2. Click the verification link in the email</p>
              <p>3. You'll be automatically redirected back here</p>
            </div>
          </div>

          <div className="pt-4 space-y-3">
            <Button
              variant="outline"
              onClick={handleResendEmail}
              disabled={isResending || resendCooldown > 0}
              className="w-full"
            >
              {isResending ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  Sending...
                </>
              ) : resendCooldown > 0 ? (
                `Resend in ${resendCooldown}s`
              ) : (
                'Resend Email'
              )}
            </Button>

            {isEmailVerified && (
              <Button
                onClick={handleManualContinue}
                className="w-full bg-green-600 hover:bg-green-700"
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                Continue to Next Step
              </Button>
            )}
          </div>
        </div>
      </Card>

      <div className="flex gap-4">
        <Button
          onClick={onPrev}
          variant="outline"
          className="flex-1 py-6 text-lg"
        >
          Back
        </Button>
        
        <Button
          onClick={handleManualContinue}
          disabled={!isEmailVerified}
          className="flex-1 py-6 bg-purple-500 hover:bg-purple-600 text-white rounded-lg text-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Continue
        </Button>
      </div>
    </div>
  );
};

export default EmailVerificationStep;
