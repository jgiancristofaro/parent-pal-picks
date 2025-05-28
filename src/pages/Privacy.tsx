
import { Header } from "@/components/Header";
import { BottomNavigation } from "@/components/BottomNavigation";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Eye, Users, MapPin, Phone, Settings } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Privacy = () => {
  const navigate = useNavigate();

  const privacySettings = [
    {
      id: "profile_visibility",
      title: "Profile Visibility",
      description: "Make your profile visible to other parents",
      icon: Eye,
      enabled: true
    },
    {
      id: "contact_sharing",
      title: "Contact Information",
      description: "Allow babysitters to see your contact details",
      icon: Phone,
      enabled: false
    },
    {
      id: "location_sharing",
      title: "Location Sharing",
      description: "Share your location with matched babysitters",
      icon: MapPin,
      enabled: true
    },
    {
      id: "activity_status",
      title: "Activity Status",
      description: "Show when you're active on the app",
      icon: Users,
      enabled: false
    }
  ];

  return (
    <div className="min-h-screen pb-20 bg-gray-50">
      <Header title="Privacy" showBack={true} showSettings={false} backTo="/settings" />
      
      <div className="px-4 py-6">
        {/* Privacy & Discovery Settings Button */}
        <div className="mb-6">
          <Button 
            onClick={() => navigate('/privacy-settings')}
            className="w-full flex items-center justify-between p-4 h-auto bg-purple-500 hover:bg-purple-600"
          >
            <div className="flex items-center space-x-3">
              <Settings className="w-6 h-6" />
              <div className="text-left">
                <div className="font-medium">Privacy & Discovery Settings</div>
                <div className="text-sm opacity-90">Manage profile privacy and searchability</div>
              </div>
            </div>
          </Button>
        </div>

        <div className="bg-white rounded-lg shadow-sm">
          {privacySettings.map((setting, index) => (
            <div 
              key={setting.id}
              className={`flex items-center justify-between p-4 ${
                index !== privacySettings.length - 1 ? "border-b border-gray-100" : ""
              }`}
            >
              <div className="flex items-center flex-1">
                <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mr-4">
                  <setting.icon className="w-6 h-6 text-gray-600" />
                </div>
                <div className="flex-1">
                  <h3 className="text-base font-medium text-gray-900">{setting.title}</h3>
                  <p className="text-sm text-gray-500 mt-1">{setting.description}</p>
                </div>
              </div>
              <Switch defaultChecked={setting.enabled} />
            </div>
          ))}
        </div>
      </div>
      
      <BottomNavigation />
    </div>
  );
};

export default Privacy;
