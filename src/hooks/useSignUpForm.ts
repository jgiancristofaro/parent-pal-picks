
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

export const useSignUpForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [phoneNumberSearchable, setPhoneNumberSearchable] = useState(false);
  const [profilePrivacySetting, setProfilePrivacySetting] = useState<'public' | 'private'>('private');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            phone_number: phoneNumber,
            profile_privacy_setting: profilePrivacySetting,
            phone_number_searchable: phoneNumberSearchable
          }
        }
      });

      if (error) {
        toast({
          title: "Sign up failed",
          description: error.message,
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
      toast({
        title: "Sign up failed",
        description: "An unexpected error occurred. Please try again.",
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
    fullName,
    setFullName,
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
