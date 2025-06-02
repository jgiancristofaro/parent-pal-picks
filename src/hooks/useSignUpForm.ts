
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export const useSignUpForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [phoneNumberSearchable, setPhoneNumberSearchable] = useState(false);
  const [profilePrivacySetting, setProfilePrivacySetting] = useState<'public' | 'private'>('private');
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would normally authenticate with a backend
    // The form data would be sent to create the user profile
    console.log('Sign up data:', {
      email,
      password,
      fullName,
      phoneNumber,
      phoneNumberSearchable,
      profilePrivacySetting
    });
    navigate("/");
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
    handleSubmit
  };
};
