
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card } from "@/components/ui/card";

interface PrivacySettingsCardProps {
  phoneNumberSearchable: boolean;
  setPhoneNumberSearchable: (value: boolean) => void;
  profilePrivacySetting: 'public' | 'private';
  setProfilePrivacySetting: (value: 'public' | 'private') => void;
}

const PrivacySettingsCard = ({
  phoneNumberSearchable,
  setPhoneNumberSearchable,
  profilePrivacySetting,
  setProfilePrivacySetting
}: PrivacySettingsCardProps) => {
  return (
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
  );
};

export default PrivacySettingsCard;
