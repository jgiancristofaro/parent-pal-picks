
import { ChevronLeft, Settings } from "lucide-react";
import { Link } from "react-router-dom";

interface HeaderProps {
  title?: string;
  showBack?: boolean;
  showSettings?: boolean;
  backTo?: string;
}

export const Header = ({ 
  title = "ParentPal", 
  showBack = false, 
  showSettings = true, 
  backTo = "/" 
}: HeaderProps) => {
  return (
    <header className="flex items-center justify-between px-4 py-4 bg-white border-b border-gray-100">
      <div className="flex items-center">
        {showBack && (
          <Link to={backTo} className="mr-3">
            <ChevronLeft className="w-6 h-6 text-gray-700" />
          </Link>
        )}
        <h1 className="text-xl font-bold">{title}</h1>
      </div>
      {showSettings && (
        <Link to="/settings">
          <Settings className="w-6 h-6 text-gray-700" />
        </Link>
      )}
    </header>
  );
};
