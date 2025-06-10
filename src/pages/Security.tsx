
import { Header } from "@/components/Header";
import { BottomNavigation } from "@/components/BottomNavigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Lock, Shield, Smartphone } from "lucide-react";
import { useState } from "react";

const Security = () => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle password change logic here
    console.log("Password change requested");
  };

  const securityOptions = [
    {
      id: "two_factor",
      title: "Two-Factor Authentication",
      description: "Add an extra layer of security",
      icon: Smartphone,
      action: "Enable"
    },
    {
      id: "login_alerts",
      title: "Login Alerts",
      description: "Get notified of new logins",
      icon: Shield,
      action: "Manage"
    }
  ];

  return (
    <div className="min-h-screen pb-20 bg-gray-50">
      <Header title="Security" showBack={true} showSettings={false} />
      
      <div className="px-4 py-6 space-y-6">
        {/* Change Password Section */}
        <div className="bg-white rounded-lg shadow-sm p-4">
          <h2 className="text-lg font-semibold mb-4 flex items-center">
            <Lock className="w-5 h-5 mr-2" />
            Change Password
          </h2>
          <form onSubmit={handlePasswordChange} className="space-y-4">
            <Input
              type="password"
              placeholder="Current Password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
            />
            <Input
              type="password"
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
            <Input
              type="password"
              placeholder="Confirm New Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            <Button type="submit" className="w-full bg-purple-500 hover:bg-purple-600">
              Update Password
            </Button>
          </form>
        </div>

        {/* Security Options */}
        <div className="bg-white rounded-lg shadow-sm">
          {securityOptions.map((option, index) => (
            <div 
              key={option.id}
              className={`flex items-center justify-between p-4 ${
                index !== securityOptions.length - 1 ? "border-b border-gray-100" : ""
              }`}
            >
              <div className="flex items-center flex-1">
                <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mr-4">
                  <option.icon className="w-6 h-6 text-gray-600" />
                </div>
                <div className="flex-1">
                  <h3 className="text-base font-medium text-gray-900">{option.title}</h3>
                  <p className="text-sm text-gray-500 mt-1">{option.description}</p>
                </div>
              </div>
              <Button variant="outline" size="sm">
                {option.action}
              </Button>
            </div>
          ))}
        </div>
      </div>
      
      <BottomNavigation />
    </div>
  );
};

export default Security;
