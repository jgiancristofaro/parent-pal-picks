
import { Button } from "@/components/ui/button";
import { useSignUpForm } from "@/hooks/useSignUpForm";
import WelcomeHeader from "@/components/auth/WelcomeHeader";
import SignUpForm from "@/components/auth/SignUpForm";
import PrivacySettingsCard from "@/components/auth/PrivacySettingsCard";
import SocialLoginButtons from "@/components/auth/SocialLoginButtons";
import LoginLink from "@/components/auth/LoginLink";

const Login = () => {
  const {
    email,
    setEmail,
    password,
    setPassword,
    fullName,
    setFullName,
    phoneNumber,
    setPhoneNumber,
    profilePrivacySetting,
    setProfilePrivacySetting,
    handleSubmit,
    isLoading
  } = useSignUpForm();

  return (
    <div className="min-h-screen flex flex-col bg-purple-50">
      <WelcomeHeader />
      
      <div className="flex-grow flex flex-col items-center justify-center px-6 pb-16">
        <form onSubmit={handleSubmit} className="w-full max-w-md space-y-6">
          <SignUpForm
            fullName={fullName}
            setFullName={setFullName}
            email={email}
            setEmail={setEmail}
            password={password}
            setPassword={setPassword}
            phoneNumber={phoneNumber}
            setPhoneNumber={setPhoneNumber}
            isLoading={isLoading}
          />

          <PrivacySettingsCard
            profilePrivacySetting={profilePrivacySetting}
            setProfilePrivacySetting={setProfilePrivacySetting}
          />
          
          <Button 
            type="submit" 
            className="w-full py-6 bg-purple-500 hover:bg-purple-600 text-white rounded-lg text-lg"
            disabled={isLoading}
          >
            {isLoading ? 'Creating Account...' : 'Sign Up'}
          </Button>
        </form>
        
        <SocialLoginButtons />
        <LoginLink />
      </div>
    </div>
  );
};

export default Login;
