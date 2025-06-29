
import { Header } from "@/components/Header";
import { BottomNavigation } from "@/components/BottomNavigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { PhoneNumberSettings } from "@/components/settings/PhoneNumberSettings";
import { ProfilePrivacySettings } from "@/components/settings/ProfilePrivacySettings";
import { usePrivacySettings } from "@/hooks/usePrivacySettings";

const PrivacySettings = () => {
  const {
    phoneNumber,
    setPhoneNumber,
    phoneNumberSearchable,
    setPhoneNumberSearchable,
    profilePrivacySetting,
    setProfilePrivacySetting,
    isLoading,
    handleSave,
    isSaving,
  } = usePrivacySettings();

  if (isLoading) {
    return (
      <div className="min-h-screen pb-20 bg-gray-50">
        <Header title="Privacy Settings" showBack={true} />
        <div className="px-4 py-6">
          <div className="text-center">Loading...</div>
        </div>
        <BottomNavigation />
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-20 bg-gray-50">
      <Header title="Privacy Settings" showBack={true} />
      
      <div className="px-4 py-6 space-y-6">
        {/* Phone Number Settings */}
        <PhoneNumberSettings
          phoneNumber={phoneNumber}
          phoneNumberSearchable={phoneNumberSearchable}
          onPhoneNumberChange={setPhoneNumber}
          onPhoneNumberSearchableChange={setPhoneNumberSearchable}
        />

        {/* Profile Privacy Settings */}
        <ProfilePrivacySettings
          profilePrivacySetting={profilePrivacySetting}
          onProfilePrivacySettingChange={setProfilePrivacySetting}
        />

        {/* Save Button */}
        <Button 
          onClick={handleSave} 
          className="w-full"
          disabled={isSaving}
        >
          {isSaving ? 'Saving...' : 'Save Settings'}
        </Button>
        
        {/* Note about follow requests */}
        {profilePrivacySetting === 'private' && (
          <Card>
            <CardContent className="pt-6">
              <p className="text-sm text-gray-600 text-center">
                Follow requests can be managed in the <strong>Alerts</strong> section.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
      
      <BottomNavigation />
    </div>
  );
};

export default PrivacySettings;
