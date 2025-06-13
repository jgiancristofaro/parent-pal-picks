
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

export const useSignUpForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [phoneNumberSearchable, setPhoneNumberSearchable] = useState(true);
  const [profilePrivacySetting, setProfilePrivacySetting] = useState<'public' | 'private'>('private');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const getSpecificErrorMessage = (error: any) => {
    console.log('Signup error details:', error);
    
    // Check for duplicate phone number error
    if (error.message?.includes('duplicate key value violates unique constraint "profiles_phone_number_key"')) {
      return "This phone number is already associated with another account. Please use a different phone number.";
    }
    
    // Check for duplicate email error
    if (error.message?.includes('User already registered')) {
      return "An account with this email address already exists. Please try signing in instead or use a different email address.";
    }
    
    // Check for weak password
    if (error.message?.includes('Password should be at least')) {
      return "Your password is too weak. Please choose a stronger password with at least 6 characters.";
    }
    
    // Check for invalid email format
    if (error.message?.includes('Invalid email')) {
      return "Please enter a valid email address.";
    }
    
    // Check for database connection issues
    if (error.message?.includes('Database error saving new user')) {
      return "There was a problem creating your account. This might be due to a duplicate phone number or email. Please try again with different information or contact support.";
    }
    
    // Default fallback message
    return error.message || "An unexpected error occurred during sign up. Please try again.";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Validate required fields including phone number
      if (!email || !password || !firstName || !lastName || !phoneNumber) {
        toast({
          title: "Missing required information",
          description: "Please fill in your first name, last name, email, password, and phone number to continue.",
          variant: "destructive",
        });
        return;
      }

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: firstName,
            last_name: lastName,
            full_name: `${firstName} ${lastName}`, // Keep for backward compatibility
            phone_number: phoneNumber,
            profile_privacy_setting: profilePrivacySetting,
            phone_number_searchable: phoneNumberSearchable
          }
        }
      });

      if (error) {
        const specificMessage = getSpecificErrorMessage(error);
        toast({
          title: "Sign up failed",
          description: specificMessage,
          variant: "destructive",
        });
        return;
      }

      if (data?.user) {
        toast({
          title: "Account created successfully!",
          description: "Please check your email to verify your account.",
        });
        navigate("/home");
      }
    } catch (error) {
      console.error('Sign up error:', error);
      const specificMessage = getSpecificErrorMessage(error);
      toast({
        title: "Sign up failed",
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
    firstName,
    setFirstName,
    lastName,
    setLastName,
    phoneNumber,
    setPhoneNumber,
    phoneNumberSearchable,
    setPhoneNumberSearchable,
    profilePrivacySetting,
    setProfilePrivacySetting,
    handleSubmit,
    isLoading
  };
};
