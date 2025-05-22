
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would normally authenticate with a backend
    navigate("/");
  };

  return (
    <div className="min-h-screen flex flex-col bg-purple-50">
      <div className="py-8 text-center">
        <h1 className="text-2xl font-bold">ParentPal</h1>
      </div>
      
      <div className="flex-grow flex flex-col items-center justify-center px-6 pb-16">
        <div className="w-full max-w-md text-center mb-10">
          <h1 className="text-4xl font-bold mb-4">Welcome to ParentPal</h1>
          <p className="text-lg text-gray-600 mb-8">
            Join our community of parents and find trusted care for your little ones.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="w-full max-w-md space-y-6">
          <div>
            <Input
              type="email"
              placeholder="Email"
              className="input-field"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          
          <div>
            <Input
              type="password"
              placeholder="Password"
              className="input-field"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          
          <Button 
            type="submit" 
            className="w-full py-6 bg-purple-500 hover:bg-purple-600 text-white rounded-lg text-lg"
          >
            Sign Up
          </Button>
        </form>
        
        <div className="mt-8 text-center">
          <p className="text-gray-600 mb-6">Or sign up with</p>
          
          <div className="flex gap-4 justify-center">
            <Button 
              variant="outline" 
              className="flex-1 py-6 bg-white border-gray-200 hover:bg-gray-50 max-w-[170px]"
            >
              Facebook
            </Button>
            
            <Button 
              variant="outline" 
              className="flex-1 py-6 bg-white border-gray-200 hover:bg-gray-50 max-w-[170px]"
            >
              Google
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
