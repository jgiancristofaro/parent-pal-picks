
import { useLoginForm } from "@/hooks/useLoginForm";
import { LoginForm } from "@/components/auth/LoginForm";
import WelcomeBackSection from "@/components/auth/WelcomeBackSection";
import LoginFooterLinks from "@/components/auth/LoginFooterLinks";

const ExistingUserLoginPage = () => {
  const {
    email,
    setEmail,
    password,
    setPassword,
    handleSubmit,
    isLoading,
  } = useLoginForm();

  return (
    <div className="min-h-screen flex flex-col bg-purple-50">
      <div className="py-8 text-center">
        <h1 className="text-2xl font-bold">ParentPal</h1>
      </div>
      
      <div className="flex-grow flex flex-col items-center justify-center px-6 pb-16">
        <WelcomeBackSection />

        <LoginForm
          email={email}
          setEmail={setEmail}
          password={password}
          setPassword={setPassword}
          onSubmit={handleSubmit}
          isLoading={isLoading}
        />

        <LoginFooterLinks />
      </div>
    </div>
  );
};

export default ExistingUserLoginPage;
