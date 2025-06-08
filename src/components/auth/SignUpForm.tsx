
import { Input } from "@/components/ui/input";

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
          placeholder="Phone Number"
          className="input-field"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          disabled={isLoading}
          required
        />
      </div>
    </div>
  );
};

export default SignUpForm;
