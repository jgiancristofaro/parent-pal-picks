
import { Header } from "@/components/Header";
import { BottomNavigation } from "@/components/BottomNavigation";
import { SettingsSection } from "@/components/settings/SettingsSection";
import { SettingsItem } from "@/components/settings/SettingsItem";
import { LogoutSection } from "@/components/settings/LogoutSection";
import { CreditCard, Bell, Globe, Shield, Lock, HelpCircle, Info, Home } from "lucide-react";

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
          id: "my-homes",
          title: "My Homes",
          description: "Manage your home locations",
          icon: Home,
          href: "/settings/my-homes"
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
          href: "/privacy-settings"
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
      <Header title="Settings" showBack={true} />
      
      <div className="px-4 py-6">
        {settingsItems.map((section, sectionIndex) => (
          <SettingsSection 
            key={section.section} 
            title={section.section}
            className={sectionIndex > 0 ? "mt-8" : ""}
          >
            {section.items.map((item, itemIndex) => (
              <SettingsItem
                key={item.id}
                id={item.id}
                title={item.title}
                description={item.description}
                icon={item.icon}
                avatar={item.avatar}
                href={item.href}
                isFirst={itemIndex === 0}
                isLast={itemIndex === section.items.length - 1}
              />
            ))}
          </SettingsSection>
        ))}
        
        <LogoutSection />
      </div>
      
      <BottomNavigation />
    </div>
  );
};

export default Settings;
