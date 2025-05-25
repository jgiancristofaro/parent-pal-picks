
import { Link } from "react-router-dom";

interface ActivityItemProps {
  userId: string;
  userName: string;
  userImage: string;
  action: string;
  timeAgo: string;
  itemType: 'product' | 'sitter';
  itemId: string;
}

export const ActivityItem = ({ 
  userId, 
  userName, 
  userImage, 
  action, 
  timeAgo,
  itemType,
  itemId
}: ActivityItemProps) => {
  // Generate the appropriate route based on item type
  const itemRoute = itemType === 'product' ? `/product/${itemId}` : `/sitter/${itemId}`;

  return (
    <div className="flex items-start py-3 px-4">
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
            <p className="font-semibold text-gray-800 hover:text-purple-600 transition-colors">{userName}</p>
          </Link>
          <p className="text-sm text-gray-500">{timeAgo}</p>
        </div>
        <Link to={itemRoute} className="block mt-1 group">
          <p className="text-gray-600 text-sm group-hover:text-purple-600 transition-colors">{action}</p>
        </Link>
      </div>
    </div>
  );
};
