
import { Header } from "@/components/Header";
import { BottomNavigation } from "@/components/BottomNavigation";
import { Switch } from "@/components/ui/switch";
import { Bell, MessageSquare, Heart, Shield } from "lucide-react";

const Notifications = () => {
  const notificationSettings = [
    {
      id: "push",
      title: "Push Notifications",
      description: "Get notifications on your device",
      icon: Bell,
      enabled: true
    },
    {
      id: "messages",
      title: "Messages",
      description: "New messages from babysitters",
      icon: MessageSquare,
      enabled: true
    },
    {
      id: "favorites",
      title: "Favorites",
      description: "Updates from your favorite babysitters",
      icon: Heart,
      enabled: false
    },
    {
      id: "security",
      title: "Security Alerts", 
      description: "Important security notifications",
      icon: Shield,
      enabled: true
    }
  ];

  return (
    <div className="min-h-screen pb-20 bg-gray-50">
      <Header title="Notifications" showBack={true} showSettings={false} />
      
      <div className="px-4 py-6">
        <div className="bg-white rounded-lg shadow-sm">
          {notificationSettings.map((setting, index) => (
            <div 
              key={setting.id}
              className={`flex items-center justify-between p-4 ${
                index !== notificationSettings.length - 1 ? "border-b border-gray-100" : ""
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

export default Notifications;
