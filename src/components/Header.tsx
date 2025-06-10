
import { ChevronLeft, Settings, Bell } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/contexts/AuthContext";
import { useAlertsContext } from "@/contexts/AlertsContext";

interface HeaderProps {
  title?: string;
  showBack?: boolean;
  showSettings?: boolean;
  showUserProfileImage?: boolean;
  userProfileImageUrl?: string | null;
  userFullName?: string | null;
  showLogo?: boolean;
  logoUrl?: string;
}

export const Header = ({ 
  title = "ParentPal", 
  showBack = false, 
  showSettings = true, 
  showUserProfileImage = false,
  userProfileImageUrl = null,
  userFullName = null,
  showLogo = false,
  logoUrl = ""
}: HeaderProps) => {
  const { user } = useAuth();
  const { hasNewAlerts } = useAlertsContext();
  const navigate = useNavigate();

  const handleBackClick = () => {
    navigate(-1);
  };

  return (
    <header className="flex items-center justify-between px-4 py-4 bg-white border-b border-gray-100">
      <div className="flex items-center">
        {showBack && (
          <button onClick={handleBackClick} className="mr-3">
            <ChevronLeft className="w-6 h-6 text-gray-700" />
          </button>
        )}
        
        {showUserProfileImage && userProfileImageUrl && (
          <Link to="/profile">
            <Avatar className="w-10 h-10">
              <AvatarImage src={userProfileImageUrl} alt={userFullName || "User"} className="object-cover" />
            </Avatar>
          </Link>
        )}

        {showLogo && logoUrl && (
          <img 
            src={logoUrl} 
            alt="ParentPal Logo" 
            className={`h-10 w-auto ${showUserProfileImage && userProfileImageUrl ? 'ml-3' : ''}`}
          />
        )}

        {!showLogo && !showUserProfileImage && (
          <h1 className="text-xl font-bold">{title}</h1>
        )}
      </div>
      
      <div className="flex items-center space-x-3">
        {/* Notification Bell - Only show when user is authenticated */}
        {user && (
          <Link to="/alerts" className="relative">
            <Bell className="w-6 h-6 text-gray-700" />
            {hasNewAlerts && (
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></div>
            )}
          </Link>
        )}
        
        {showSettings && (
          <Link to="/settings">
            <Settings className="w-6 h-6 text-gray-700" />
          </Link>
        )}
      </div>
    </header>
  );
};
