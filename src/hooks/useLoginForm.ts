
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

export const useLoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const getSpecificLoginErrorMessage = (error: any) => {
    console.log('Login error details:', error);
    
    // Check for invalid credentials
    if (error.message?.includes('Invalid login credentials')) {
      return "The email or password you entered is incorrect. Please check your credentials and try again.";
    }
    
    // Check for email not confirmed
    if (error.message?.includes('Email not confirmed')) {
      return "Please check your email and click the confirmation link before signing in.";
    }
    
    // Check for too many requests
    if (error.message?.includes('Too many requests')) {
      return "Too many login attempts. Please wait a few minutes before trying again.";
    }
    
    // Default fallback message
    return error.message || "Login failed. Please check your credentials and try again.";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Validate required fields
      if (!email || !password) {
        toast({
          title: "Missing information",
          description: "Please enter both your email and password.",
          variant: "destructive",
        });
        return;
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        const specificMessage = getSpecificLoginErrorMessage(error);
        toast({
          title: "Login failed",
          description: specificMessage,
          variant: "destructive",
        });
        return;
      }

      if (data?.user) {
        toast({
          title: "Welcome back!",
          description: "You have successfully signed in.",
        });
        navigate("/home");
      }
    } catch (error) {
      console.error('Login error:', error);
      const specificMessage = getSpecificLoginErrorMessage(error);
      toast({
        title: "Login failed",
        description: specificMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    email,
    setEmail,
    password,
    setPassword,
    handleSubmit,
    isLoading,
  };
};
