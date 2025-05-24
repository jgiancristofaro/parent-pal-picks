import { Header } from "@/components/Header";
import { BottomNavigation } from "@/components/BottomNavigation";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { ChevronRight, CreditCard, Bell, Globe, Shield, Lock, HelpCircle, Info } from "lucide-react";
import { Link } from "react-router-dom";

const Settings = () => {
  const settingsItems = [
    {
      section: "Account",
      items: [
        {
          id: "profile",
          title: "Profile",
          description: "Manage your profile information",
          icon: null,
          avatar: true,
          href: "/profile"
        },
        {
          id: "payment",
          title: "Payment Methods",
          description: "Manage your payment methods",
          icon: CreditCard,
          href: "/payment-methods"
        }
      ]
    },
    {
      section: "Preferences",
      items: [
        {
          id: "notifications",
          title: "Notifications",
          description: "Customize your notification settings",
          icon: Bell,
          href: "/notifications"
        },
        {
          id: "language",
          title: "Language",
          description: "Adjust your app language",
          icon: Globe,
          href: "/language"
        }
      ]
    },
    {
      section: "Privacy & Security",
      items: [
        {
          id: "privacy",
          title: "Privacy",
          description: "Manage your privacy settings",
          icon: Shield,
          href: "/privacy"
        },
        {
          id: "security",
          title: "Security",
          description: "Update your password",
          icon: Lock,
          href: "/security"
        }
      ]
    },
    {
      section: "Support",
      items: [
        {
          id: "help",
          title: "Help & Support",
          description: "Get help and support",
          icon: HelpCircle,
          href: "/help"
        },
        {
          id: "about",
          title: "About ParentPal",
          description: "Learn more about ParentPal",
          icon: Info,
          href: "/about"
        }
      ]
    }
  ];

  return (
    <div className="min-h-screen pb-20 bg-gray-50">
      <Header title="Settings" showBack={true} showSettings={false} />
      
      <div className="px-4 py-6">
        {settingsItems.map((section, sectionIndex) => (
          <div key={section.section} className={sectionIndex > 0 ? "mt-8" : ""}>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">{section.section}</h2>
            
            <div className="bg-white rounded-lg shadow-sm">
              {section.items.map((item, itemIndex) => (
                <Link 
                  key={item.id}
                  to={item.href}
                  className={`flex items-center p-4 hover:bg-gray-50 transition-colors ${
                    itemIndex !== section.items.length - 1 ? "border-b border-gray-100" : ""
                  } ${itemIndex === 0 ? "rounded-t-lg" : ""} ${
                    itemIndex === section.items.length - 1 ? "rounded-b-lg" : ""
                  }`}
                >
                  <div className="flex-shrink-0 mr-4">
                    {item.avatar ? (
                      <Avatar className="w-12 h-12">
                        <AvatarImage 
                          src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=2487&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" 
                          alt="Profile" 
                        />
                        <AvatarFallback>SC</AvatarFallback>
                      </Avatar>
                    ) : (
                      <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                        {item.icon && <item.icon className="w-6 h-6 text-gray-600" />}
                      </div>
                    )}
                  </div>
                  
                  <div className="flex-grow">
                    <h3 className="text-base font-medium text-gray-900">{item.title}</h3>
                    <p className="text-sm text-gray-500 mt-1">{item.description}</p>
                  </div>
                  
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
      
      <BottomNavigation />
    </div>
  );
};

export default Settings;
