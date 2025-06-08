
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Info } from "lucide-react";

interface SignUpFormProps {
  fullName: string;
  setFullName: (value: string) => void;
  email: string;
  setEmail: (value: string) => void;
  password: string;
  setPassword: (value: string) => void;
  phoneNumber: string;
  setPhoneNumber: (value: string) => void;
  isLoading?: boolean;
}

const SignUpForm = ({
  fullName,
  setFullName,
  email,
  setEmail,
  password,
  setPassword,
  phoneNumber,
  setPhoneNumber,
  isLoading = false
}: SignUpFormProps) => {
  return (
    <div className="space-y-6">
      <div>
        <Input
          type="text"
          placeholder="Full Name"
          className="input-field"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          disabled={isLoading}
          required
        />
      </div>

      <div>
        <Input
          type="email"
          placeholder="Email"
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

      <div>
        <Input
          type="tel"
          placeholder="Phone Number (Optional)"
          className="input-field"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          disabled={isLoading}
        />
        {phoneNumber && (
          <Alert className="mt-2">
            <Info className="h-4 w-4" />
            <AlertDescription className="text-sm">
              If you're having trouble signing up, try leaving the phone number field empty or use a different number.
            </AlertDescription>
          </Alert>
        )}
      </div>
    </div>
  );
};

export default SignUpForm;
