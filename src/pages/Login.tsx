
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const Login = () => {
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
              type="text"
              placeholder="Full Name"
              className="input-field"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
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

          <div>
            <Input
              type="tel"
              placeholder="Phone Number (Optional)"
              className="input-field"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
            />
          </div>

          <Card className="p-4">
            <div className="space-y-4">
              <div className="flex items-start space-x-2">
                <Checkbox
                  id="phone-searchable"
                  checked={phoneNumberSearchable}
                  onCheckedChange={(checked) => setPhoneNumberSearchable(checked as boolean)}
                />
                <Label htmlFor="phone-searchable" className="text-sm leading-relaxed">
                  Allow others to find my profile by my phone number. My phone number will not be publicly displayed.
                </Label>
              </div>

              <div>
                <Label className="text-sm font-medium mb-3 block">Profile Privacy</Label>
                <RadioGroup 
                  value={profilePrivacySetting} 
                  onValueChange={(value) => setProfilePrivacySetting(value as 'public' | 'private')}
                  className="space-y-3"
                >
                  <div className="flex items-start space-x-2">
                    <RadioGroupItem value="private" id="private-signup" className="mt-1" />
                    <Label htmlFor="private-signup" className="text-sm leading-relaxed">
                      <div className="font-medium">Private (Recommended)</div>
                      <div className="text-gray-500">You approve who can follow you</div>
                    </Label>
                  </div>
                  <div className="flex items-start space-x-2">
                    <RadioGroupItem value="public" id="public-signup" className="mt-1" />
                    <Label htmlFor="public-signup" className="text-sm leading-relaxed">
                      <div className="font-medium">Public</div>
                      <div className="text-gray-500">Anyone can follow you</div>
                    </Label>
                  </div>
                </RadioGroup>
              </div>
            </div>
          </Card>
          
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

        <div className="mt-8 text-center">
          <p className="text-gray-600">
            Already have an account?{" "}
            <Link 
              to="/login-existing" 
              className="text-purple-500 font-semibold hover:text-purple-600 underline"
            >
              Log In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
