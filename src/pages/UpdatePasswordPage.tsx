
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";

const UpdatePasswordPage = () => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isVerifying, setIsVerifying] = useState(true);
  const [isValidToken, setIsValidToken] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    // Set up auth state listener to handle PASSWORD_RECOVERY event
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === 'PASSWORD_RECOVERY') {
          // Password recovery event received
          setIsValidToken(true);
          setIsVerifying(false);
        }
      }
    );

    // Set a timeout to handle cases where the token is invalid
    const timeout = setTimeout(() => {
      if (isVerifying) {
        setIsValidToken(false);
        setIsVerifying(false);
      }
    }, 3000);

    return () => {
      subscription.unsubscribe();
      clearTimeout(timeout);
    };
  }, [isVerifying]);

  const validateForm = () => {
    if (!newPassword || !confirmPassword) {
      toast({
        title: "Error",
        description: "Please fill in both password fields.",
        variant: "destructive",
      });
      return false;
    }

    if (newPassword.length < 8) {
      toast({
        title: "Error",
        description: "Password must be at least 8 characters long.",
        variant: "destructive",
      });
      return false;
    }

    if (newPassword !== confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords do not match.",
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);

    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (error) {
        console.error('Password update error:', error);
        toast({
          title: "Error",
          description: "There was an error updating your password. Please try again.",
          variant: "destructive",
        });
        return;
      }

      setIsSuccess(true);
      
      // Redirect to login after 3 seconds
      setTimeout(() => {
        navigate('/login');
      }, 3000);

    } catch (error) {
      console.error('Password update error:', error);
      toast({
        title: "Error",
        description: "There was an error updating your password. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Loading/Verifying state
  if (isVerifying) {
    return (
      <div className="min-h-screen flex flex-col bg-purple-50">
        <div className="py-8 text-center">
          <h1 className="text-2xl font-bold">ParentPal</h1>
        </div>
        
        <div className="flex-grow flex flex-col items-center justify-center px-6">
          <div className="w-full max-w-md bg-white rounded-lg shadow-md p-8 text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Verifying...</h2>
            <p className="text-gray-600">
              Please wait while we verify your password reset link.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Invalid token state
  if (!isValidToken) {
    return (
      <div className="min-h-screen flex flex-col bg-purple-50">
        <div className="py-8 text-center">
          <h1 className="text-2xl font-bold">ParentPal</h1>
        </div>
        
        <div className="flex-grow flex flex-col items-center justify-center px-6">
          <div className="w-full max-w-md bg-white rounded-lg shadow-md p-8">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Link Invalid</h2>
              <p className="text-gray-600 mb-6">
                This password reset link is invalid or has expired. Please request a new one.
              </p>
              <Button 
                onClick={() => navigate('/forgot-password')}
                className="w-full py-3 bg-purple-500 hover:bg-purple-600 text-white rounded-lg"
              >
                Request New Reset Link
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Success state
  if (isSuccess) {
    return (
      <div className="min-h-screen flex flex-col bg-purple-50">
        <div className="py-8 text-center">
          <h1 className="text-2xl font-bold">ParentPal</h1>
        </div>
        
        <div className="flex-grow flex flex-col items-center justify-center px-6">
          <div className="w-full max-w-md bg-white rounded-lg shadow-md p-8">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Success!</h2>
              <p className="text-gray-600 mb-6">
                Your password has been reset successfully! You will be redirected to the login page in a few seconds.
              </p>
              <Button 
                onClick={() => navigate('/login')}
                className="w-full py-3 bg-purple-500 hover:bg-purple-600 text-white rounded-lg"
              >
                Go to Login
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Password reset form
  return (
    <div className="min-h-screen flex flex-col bg-purple-50">
      <div className="py-8 text-center">
        <h1 className="text-2xl font-bold">ParentPal</h1>
      </div>
      
      <div className="flex-grow flex flex-col items-center justify-center px-6">
        <div className="w-full max-w-md bg-white rounded-lg shadow-md p-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Create a New Password</h2>
            <p className="text-gray-600">
              Enter a new password for your ParentPal account.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Input
                type="password"
                placeholder="New Password"
                className="w-full py-3 px-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                disabled={isLoading}
                required
              />
            </div>
            
            <div>
              <Input
                type="password"
                placeholder="Confirm New Password"
                className="w-full py-3 px-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={isLoading}
                required
              />
            </div>

            <div className="text-sm text-gray-500">
              <p>Password requirements:</p>
              <ul className="list-disc list-inside mt-1">
                <li>Must be at least 8 characters long</li>
              </ul>
            </div>
            
            <Button 
              type="submit" 
              className="w-full py-3 bg-purple-500 hover:bg-purple-600 text-white rounded-lg text-lg"
              disabled={isLoading}
            >
              {isLoading ? "Updating Password..." : "Update Password"}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <button 
              onClick={() => navigate('/login')}
              className="text-purple-500 hover:text-purple-600 font-medium"
            >
              Back to Login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdatePasswordPage;
