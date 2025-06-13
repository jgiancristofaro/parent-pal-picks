
import { Input } from "@/components/ui/input";

interface SignUpFormProps {
  firstName: string;
  setFirstName: (value: string) => void;
  lastName: string;
  setLastName: (value: string) => void;
  email: string;
  setEmail: (value: string) => void;
  password: string;
  setPassword: (value: string) => void;
  phoneNumber: string;
  setPhoneNumber: (value: string) => void;
  isLoading?: boolean;
}

const SignUpForm = ({
  firstName,
  setFirstName,
  lastName,
  setLastName,
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
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Input
            type="text"
            placeholder="First Name"
            className="input-field"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            disabled={isLoading}
            required
          />
        </div>
        <div>
          <Input
            type="text"
            placeholder="Last Name"
            className="input-field"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            disabled={isLoading}
            required
          />
        </div>
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
