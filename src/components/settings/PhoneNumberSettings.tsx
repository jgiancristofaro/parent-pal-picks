
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { validatePhoneNumber } from "@/utils/phoneValidation";

interface PhoneNumberSettingsProps {
  phoneNumber: string;
  phoneNumberSearchable: boolean;
  onPhoneNumberChange: (phone: string) => void;
  onPhoneNumberSearchableChange: (searchable: boolean) => void;
}

export const PhoneNumberSettings = ({
  phoneNumber,
  phoneNumberSearchable,
  onPhoneNumberChange,
  onPhoneNumberSearchableChange,
}: PhoneNumberSettingsProps) => {
  const [phoneValidationError, setPhoneValidationError] = useState<string>('');

  const handlePhoneNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    onPhoneNumberChange(value);
    
    const validation = validatePhoneNumber(value);
    setPhoneValidationError(validation.error);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Phone Number</CardTitle>
        <CardDescription>
          Manage your phone number and searchability settings
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="phone">Phone Number *</Label>
          <Input
            id="phone"
            type="tel"
            placeholder="Enter your phone number"
            value={phoneNumber}
            onChange={handlePhoneNumberChange}
            required
            className={phoneValidationError ? 'border-red-500' : ''}
          />
          
          {phoneValidationError && (
            <div className="text-sm text-red-600 flex items-center gap-2">
              <span>⚠️</span>
              <span>{phoneValidationError}</span>
            </div>
          )}
        </div>
        
        <div className="flex items-center space-x-2">
          <Checkbox
            id="phone-searchable"
            checked={phoneNumberSearchable}
            onCheckedChange={(checked) => onPhoneNumberSearchableChange(checked as boolean)}
          />
          <Label htmlFor="phone-searchable" className="text-sm">
            Allow others to find my profile by my phone number. My phone number will not be publicly displayed.
          </Label>
        </div>
      </CardContent>
    </Card>
  );
};
