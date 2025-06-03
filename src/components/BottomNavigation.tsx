
import { Home, Search, Plus, Users, User } from "lucide-react";
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
      <Link to="/" className="flex flex-col items-center">
        <Home className={`w-6 h-6 ${isActive("/")}`} />
        <span className={`text-xs mt-1 ${isActive("/")}`}>Home</span>
      </Link>
      <Link to="/activity-feed" className="flex flex-col items-center">
        <Users className={`w-6 h-6 ${isActive("/activity-feed")}`} />
        <span className={`text-xs mt-1 ${isActive("/activity-feed")}`}>Friends</span>
      </Link>
      <Link to="/search" className="flex flex-col items-center">
        <Search className={`w-6 h-6 ${isActive("/search")}`} />
        <span className={`text-xs mt-1 ${isActive("/search")}`}>Search</span>
      </Link>
      <Link to="/add-review" className="flex flex-col items-center">
        <Plus className={`w-6 h-6 ${isActive("/add-review")}`} />
        <span className={`text-xs mt-1 ${isActive("/add-review")}`}>Review</span>
      </Link>
      <Link to="/profile" className="flex flex-col items-center">
        <User className={`w-6 h-6 ${isActive("/profile")}`} />
        <span className={`text-xs mt-1 ${isActive("/profile")}`}>Profile</span>
      </Link>
    </div>
  );
};
