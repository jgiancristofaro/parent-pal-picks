
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface LoginFormProps {
  email: string;
  setEmail: (email: string) => void;
  password: string;
  setPassword: (password: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  isLoading?: boolean;
}

export const LoginForm = ({
  email,
  setEmail,
  password,
  setPassword,
  onSubmit,
  isLoading = false,
}: LoginFormProps) => {
  return (
    <form onSubmit={onSubmit} className="w-full max-w-md space-y-6">
      <div>
        <Input
          type="email"
          placeholder="Email address"
          className="input-field"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={isLoading}
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
          disabled={isLoading}
          required
        />
      </div>
      
      <Button 
        type="submit" 
        className="w-full py-6 bg-purple-500 hover:bg-purple-600 text-white rounded-lg text-lg"
        disabled={isLoading}
      >
        {isLoading ? "Signing in..." : "Log In"}
      </Button>
    </form>
  );
};
