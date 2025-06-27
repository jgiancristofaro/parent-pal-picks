
import { Home, Search, Users, User, Plus } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useScrollDirection } from "@/hooks/useScrollDirection";

export const BottomNavigation = () => {
  const location = useLocation();
  const path = location.pathname;
  const { visible } = useScrollDirection();

  const isActive = (route: string) => {
    return path === route ? "text-purple-500" : "text-gray-500";
  };

  return (
    <div 
      className={`fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex justify-around items-center h-16 px-4 z-10 transition-transform duration-300 ${
        visible ? "translate-y-0" : "translate-y-full"
      }`}
    >
      {/* Home Tab */}
      <Link to="/home" className="flex flex-col items-center">
        <Home className={`w-6 h-6 ${isActive("/home")}`} />
        <span className={`text-xs mt-1 ${isActive("/home")}`}>Home</span>
      </Link>

      {/* Friends Tab */}
      <Link to="/connections" className="flex flex-col items-center">
        <Users className={`w-6 h-6 ${isActive("/connections")}`} />
        <span className={`text-xs mt-1 ${isActive("/connections")}`}>Friends</span>
      </Link>

      {/* Central FAB - Floating Action Button */}
      <div className="relative">
        <Link 
          to="/add-review" 
          className="flex items-center justify-center w-14 h-14 bg-purple-600 hover:bg-purple-700 rounded-full shadow-lg transition-colors duration-200 -mt-2"
        >
          <Plus className="w-7 h-7 text-white" />
        </Link>
      </div>

      {/* Search Tab */}
      <Link to="/search" className="flex flex-col items-center">
        <Search className={`w-6 h-6 ${isActive("/search")}`} />
        <span className={`text-xs mt-1 ${isActive("/search")}`}>Search</span>
      </Link>

      {/* Profile Tab */}
      <Link to="/profile" className="flex flex-col items-center">
        <User className={`w-6 h-6 ${isActive("/profile")}`} />
        <span className={`text-xs mt-1 ${isActive("/profile")}`}>Profile</span>
      </Link>
    </div>
  );
};
