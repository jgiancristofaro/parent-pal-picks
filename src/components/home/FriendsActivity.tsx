import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { ArrowRight } from "lucide-react";
import { ActivityItem } from "@/components/ActivityItem";

interface FriendActivityItem {
  userId: string;
  userName: string;
  userImage: string;
  action: string;
  timeAgo: string;
  itemType: 'product' | 'sitter';
  itemId: string;
}

interface FriendsActivityProps {
  friendActivity: FriendActivityItem[];
}

export const FriendsActivity = ({ friendActivity }: FriendsActivityProps) => {
  return (
    <div className="mb-4">
      <div className="flex justify-between items-center px-4 mb-2">
        <h2 className="text-xl font-bold">Friends' Activity</h2>
        {friendActivity.length > 0 && (
          <Link to="/activity-feed" className="flex items-center text-purple-500 text-sm font-medium hover:text-purple-600">
            View All
            <ArrowRight className="w-4 h-4 ml-1" />
          </Link>
        )}
      </div>

      {friendActivity.length === 0 ? (
        <div className="mx-4 bg-white rounded-xl shadow-sm p-8 text-center border border-gray-100">
          <p className="text-gray-600 mb-4">Find and follow friends to see their recommendations here!</p>
          <Link to="/search">
            <Button variant="link" className="text-purple-500 hover:text-purple-600">
              Find Friends
            </Button>
          </Link>
        </div>
      ) : (
        <ScrollArea className="w-full whitespace-nowrap no-scrollbar">
          <div className="flex w-max space-x-4 px-4">
            {friendActivity.map((item, index) => (
              <div key={index} className="flex-none w-64 bg-white rounded-xl shadow-sm border border-gray-100">
                <ActivityItem
                  userId={item.userId}
                  userName={item.userName}
                  userImage={item.userImage}
                  action={item.action}
                  timeAgo={item.timeAgo}
                  itemType={item.itemType}
                  itemId={item.itemId}
                />
              </div>
            ))}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      )}
    </div>
  );
};
