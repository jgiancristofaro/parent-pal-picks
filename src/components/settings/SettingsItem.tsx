
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { LucideIcon } from "lucide-react";

interface SettingsItemProps {
  id: string;
  title: string;
  description: string;
  icon?: LucideIcon | null;
  avatar?: boolean;
  href: string;
  isFirst: boolean;
  isLast: boolean;
}

export const SettingsItem = ({ 
  id, 
  title, 
  description, 
  icon: Icon, 
  avatar, 
  href, 
  isFirst, 
  isLast 
}: SettingsItemProps) => {
  return (
    <Link 
      to={href}
      className={`flex items-center p-4 hover:bg-gray-50 transition-colors ${
        !isLast ? "border-b border-gray-100" : ""
      } ${isFirst ? "rounded-t-lg" : ""} ${
        isLast ? "rounded-b-lg" : ""
      }`}
    >
      <div className="flex-shrink-0 mr-4">
        {avatar ? (
          <Avatar className="w-12 h-12">
            <AvatarImage 
              src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=2487&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" 
              alt="Profile" 
            />
            <AvatarFallback>SC</AvatarFallback>
          </Avatar>
        ) : (
          <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
            {Icon && <Icon className="w-6 h-6 text-gray-600" />}
          </div>
        )}
      </div>
      
      <div className="flex-grow">
        <h3 className="text-base font-medium text-gray-900">{title}</h3>
        <p className="text-sm text-gray-500 mt-1">{description}</p>
      </div>
      
      <ChevronRight className="w-5 h-5 text-gray-400" />
    </Link>
  );
};
