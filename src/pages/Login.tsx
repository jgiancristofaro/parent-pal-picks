
import { useLoginForm } from "@/hooks/useLoginForm";
import { LoginForm } from "@/components/auth/LoginForm";
import WelcomeBackSection from "@/components/auth/WelcomeBackSection";
import LoginFooterLinks from "@/components/auth/LoginFooterLinks";
import { Link } from "react-router-dom";

const Login = () => {
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
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-4">Welcome Back!</h2>
          <p className="text-gray-600">Sign in to your account</p>
        </div>

        <LoginForm
          email={email}
          setEmail={setEmail}
          password={password}
          setPassword={setPassword}
          onSubmit={handleSubmit}
          isLoading={isLoading}
        />

        <div className="mt-6 text-center">
          <p className="text-gray-600">
            Don't have an account?{" "}
            <Link to="/signup" className="text-purple-600 hover:text-purple-700 font-medium">
              Sign up here
            </Link>
          </p>
        </div>

        <LoginFooterLinks />
      </div>
    </div>
  );
};

export default Login;
