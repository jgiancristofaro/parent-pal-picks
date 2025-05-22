
import { Link } from "react-router-dom";

interface ActivityItemProps {
  userId: string;
  userName: string;
  userImage: string;
  action: string;
  timeAgo: string;
}

export const ActivityItem = ({ 
  userId, 
  userName, 
  userImage, 
  action, 
  timeAgo 
}: ActivityItemProps) => {
  return (
    <div className="flex items-start py-3">
      <Link to={`/profile/${userId}`} className="flex-shrink-0">
        <div className="w-12 h-12 rounded-full overflow-hidden">
          <img 
            src={userImage} 
            alt={userName} 
            className="w-full h-full object-cover"
          />
        </div>
      </Link>
      <div className="ml-4 flex-grow">
        <div className="flex justify-between">
          <Link to={`/profile/${userId}`}>
            <p className="font-semibold text-gray-800">{userName}</p>
          </Link>
          <p className="text-sm text-gray-500">{timeAgo}</p>
        </div>
        <p className="text-gray-600 text-sm mt-1">{action}</p>
      </div>
    </div>
  );
};
