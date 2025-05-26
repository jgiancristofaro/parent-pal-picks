
import { ChevronLeft, Settings } from "lucide-react";
import { Link } from "react-router-dom";
import { Avatar, AvatarImage } from "@/components/ui/avatar";

interface HeaderProps {
  title?: string;
  showBack?: boolean;
  showSettings?: boolean;
  backTo?: string;
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
  backTo = "/",
  showUserProfileImage = false,
  userProfileImageUrl = null,
  userFullName = null,
  showLogo = false,
  logoUrl = ""
}: HeaderProps) => {
  return (
    <header className="flex items-center justify-between px-4 py-4 bg-white border-b border-gray-100">
      <div className="flex items-center">
        {showBack && (
          <Link to={backTo} className="mr-3">
            <ChevronLeft className="w-6 h-6 text-gray-700" />
          </Link>
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
            className={`h-6 w-auto ${showUserProfileImage && userProfileImageUrl ? 'ml-3' : ''}`}
          />
        )}

        {!showLogo && !showUserProfileImage && (
          <h1 className="text-xl font-bold">{title}</h1>
        )}
      </div>
      {showSettings && (
        <Link to="/settings">
          <Settings className="w-6 h-6 text-gray-700" />
        </Link>
      )}
    </header>
  );
};
