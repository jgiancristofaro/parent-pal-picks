
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface ProfilePrivacySettingsProps {
  profilePrivacySetting: 'public' | 'private';
  onProfilePrivacySettingChange: (setting: 'public' | 'private') => void;
}

export const ProfilePrivacySettings = ({
  profilePrivacySetting,
  onProfilePrivacySettingChange,
}: ProfilePrivacySettingsProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile Privacy</CardTitle>
        <CardDescription>
          Control who can follow you and see your activity
        </CardDescription>
      </CardHeader>
      <CardContent>
        <RadioGroup 
          value={profilePrivacySetting} 
          onValueChange={(value) => onProfilePrivacySettingChange(value as 'public' | 'private')}
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="public" id="public" />
            <Label htmlFor="public" className="flex-1">
              <div className="font-medium">Public</div>
              <div className="text-sm text-gray-500">
                Anyone can follow you without approval. Your reviews and activity are visible to all users.
              </div>
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="private" id="private" />
            <Label htmlFor="private" className="flex-1">
              <div className="font-medium">Private</div>
              <div className="text-sm text-gray-500">
                You must approve follow requests. Only followers can see your reviews and activity.
              </div>
            </Label>
          </div>
        </RadioGroup>
      </CardContent>
    </Card>
  );
};
