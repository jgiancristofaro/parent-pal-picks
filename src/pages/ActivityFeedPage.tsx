
import { Header } from "@/components/Header";
import { ActivityItem } from "@/components/ActivityItem";

const ActivityFeedPage = () => {
  // Mock activity feed data with diverse activities
  const mockFeedItems = [
    {
      userId: "user-101",
      userName: "Emma Rodriguez",
      userImage: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=2487&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      action: "Just booked Maria for weekend childcare",
      timeAgo: "5m",
      itemType: "sitter" as const,
      itemId: "sitter-401"
    },
    {
      userId: "user-102",
      userName: "David Chen",
      userImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=2487&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      action: "Highly recommends these organic baby snacks",
      timeAgo: "12m",
      itemType: "product" as const,
      itemId: "product-205"
    },
    {
      userId: "user-103",
      userName: "Sarah Williams",
      userImage: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=2487&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      action: "Left a 5-star review for Jennifer's babysitting",
      timeAgo: "1h",
      itemType: "sitter" as const,
      itemId: "sitter-312"
    },
    {
      userId: "user-104",
      userName: "Michael Torres",
      userImage: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      action: "Found the perfect baby monitor system",
      timeAgo: "2h",
      itemType: "product" as const,
      itemId: "product-108"
    },
    {
      userId: "user-105",
      userName: "Jessica Park",
      userImage: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=2088&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      action: "Scheduled regular sessions with Alex for next month",
      timeAgo: "3h",
      itemType: "sitter" as const,
      itemId: "sitter-567"
    },
    {
      userId: "user-106",
      userName: "Robert Kim",
      userImage: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=2487&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      action: "These baby bottles are game-changers!",
      timeAgo: "4h",
      itemType: "product" as const,
      itemId: "product-789"
    },
    {
      userId: "user-107",
      userName: "Olivia Bennett",
      userImage: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=2564&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      action: "Recommends Lisa for emergency childcare",
      timeAgo: "6h",
      itemType: "sitter" as const,
      itemId: "sitter-234"
    },
    {
      userId: "user-108",
      userName: "Andrew Mitchell",
      userImage: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=2487&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      action: "Finally found a stroller that fits our lifestyle",
      timeAgo: "8h",
      itemType: "product" as const,
      itemId: "product-156"
    },
    {
      userId: "user-109",
      userName: "Maria Lopez",
      userImage: "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=2561&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      action: "Had an amazing experience with Tom's childcare",
      timeAgo: "12h",
      itemType: "sitter" as const,
      itemId: "sitter-890"
    },
    {
      userId: "user-110",
      userName: "Kevin Zhang",
      userImage: "https://images.unsplash.com/photo-1519345182560-3f2917c472ef?q=80&w=2148&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      action: "These educational toys are worth every penny",
      timeAgo: "1d",
      itemType: "product" as const,
      itemId: "product-445"
    },
    {
      userId: "user-111",
      userName: "Amanda Foster",
      userImage: "https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=2487&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      action: "Booked recurring sessions with Rachel",
      timeAgo: "1d",
      itemType: "sitter" as const,
      itemId: "sitter-123"
    },
    {
      userId: "user-112",
      userName: "James Wilson",
      userImage: "https://images.unsplash.com/photo-1463453091185-61582044d556?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      action: "Best car seat purchase we've made",
      timeAgo: "2d",
      itemType: "product" as const,
      itemId: "product-667"
    },
    {
      userId: "user-113",
      userName: "Lisa Thompson",
      userImage: "https://images.unsplash.com/photo-1506277886164-e25aa3f4ef7f?q=80&w=2535&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      action: "Scheduled weekend care with Emma",
      timeAgo: "2d",
      itemType: "sitter" as const,
      itemId: "sitter-456"
    },
    {
      userId: "user-114",
      userName: "Chris Garcia",
      userImage: "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=2487&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      action: "These sleep training books are life-savers",
      timeAgo: "3d",
      itemType: "product" as const,
      itemId: "product-334"
    },
    {
      userId: "user-115",
      userName: "Rachel Adams",
      userImage: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?q=80&w=2671&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      action: "Had a wonderful experience with Sophie's care",
      timeAgo: "3d",
      itemType: "sitter" as const,
      itemId: "sitter-789"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header 
        title="Activity Feed"
        showBack={true}
        showSettings={false}
        backTo="/"
      />
      
      <div className="px-4 py-6">
        {mockFeedItems.length === 0 ? (
          // Empty state
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-24 h-24 bg-purple-100 rounded-full flex items-center justify-center mb-6">
              <svg className="w-12 h-12 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-3">No Activity Yet</h3>
            <p className="text-gray-600 max-w-sm mx-auto leading-relaxed">
              This is where you'll see updates from friends you follow. Start following other parents to see their recommendations and experiences!
            </p>
          </div>
        ) : (
          // Activity feed list
          <div className="space-y-4">
            {mockFeedItems.map((item, index) => (
              <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
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
        )}
      </div>
    </div>
  );
};

export default ActivityFeedPage;
