
import { Link } from "react-router-dom";
import { Bell, X } from "lucide-react";

interface NotificationBannerProps {
  notificationMessage: string;
  onDismiss: () => void;
  onActivityFeedClick: () => Promise<void>;
}

export const NotificationBanner = ({ 
  notificationMessage, 
  onDismiss, 
  onActivityFeedClick 
}: NotificationBannerProps) => {
  return (
    <div className="mx-4 mt-4 mb-4 bg-blue-100 border border-blue-200 rounded-lg overflow-hidden hover:bg-blue-200 transition-colors">
      <div className="flex items-center justify-between">
        <Link 
          to="/activity-feed" 
          className="flex items-center flex-1 p-4 cursor-pointer"
          onClick={onActivityFeedClick}
        >
          <Bell className="w-5 h-5 text-blue-700 mr-3" />
          <span className="text-blue-700 font-medium">{notificationMessage}</span>
        </Link>
        <button 
          onClick={(e) => {
            e.stopPropagation();
            onDismiss();
          }}
          className="text-blue-700 hover:text-blue-900 p-4"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
