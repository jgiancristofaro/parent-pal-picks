
import { Header } from "@/components/Header";
import { BottomNavigation } from "@/components/BottomNavigation";
import { ProductCard } from "@/components/ProductCard";
import { SitterCard } from "@/components/SitterCard";
import { ActivityItem } from "@/components/ActivityItem";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Home = () => {
  // Mock data for demonstration
  const featuredProducts = [
    {
      id: "1",
      name: "Top-rated Baby Monitors",
      image: "https://images.unsplash.com/photo-1595586964632-b215dfbc064d?q=80&w=2532&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      category: "Baby Safety"
    },
    {
      id: "2",
      name: "Essential Baby Carriers",
      image: "https://images.unsplash.com/photo-1622987564758-a5476cb9f6d7?q=80&w=2487&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      category: "Carrying"
    },
  ];

  const friendActivity = [
    {
      userId: "101",
      userName: "Olivia Bennett",
      userImage: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=2487&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      action: "Recommended a sitter",
      timeAgo: "2d"
    },
    {
      userId: "102",
      userName: "Ethan Chen", 
      userImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=2487&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      action: "Booked a sitter",
      timeAgo: "3d"
    },
  ];
  
  const upcomingEvents = [
    {
      id: "event1",
      type: "Babysitting",
      details: "Sitter: Jessica",
      date: "Tomorrow"
    },
    {
      id: "event2",
      type: "Baby Products",
      details: "Order #12345",
      date: "Arriving in 2 days"
    }
  ];

  return (
    <div className="min-h-screen pb-20 bg-gray-50">
      <Header showSettings={true} />
      
      <div className="relative mb-8">
        <div className="h-44 bg-gradient-to-b from-purple-100 to-purple-50 flex items-end">
          <div className="absolute inset-0 bg-center bg-cover opacity-20" 
              style={{ backgroundImage: "url('https://images.unsplash.com/photo-1492725764893-90b379c2b6e7?q=80&w=2540&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')" }}>
          </div>
          <div className="relative w-full p-6">
            <h1 className="text-3xl font-bold text-gray-800">Welcome back, Sarah!</h1>
          </div>
        </div>
      </div>

      <div className="px-4 mb-8 flex gap-4">
        <Link to="/find-sitter" className="flex-1">
          <Button className="w-full py-6 text-white bg-purple-500 hover:bg-purple-600 rounded-lg">
            Find a Sitter
          </Button>
        </Link>
        <Link to="/shop" className="flex-1">
          <Button variant="outline" className="w-full py-6 bg-white border-gray-200 hover:bg-gray-50 rounded-lg">
            Shop Products
          </Button>
        </Link>
      </div>
      
      <Link to="/bookings" className="block px-4 mb-8">
        <div className="py-4 px-6 bg-white rounded-lg shadow-sm text-center border border-gray-100">
          My Bookings/Orders
        </div>
      </Link>

      <div className="px-4 mb-8">
        <h2 className="text-2xl font-bold mb-4">Friends' Activity</h2>
        <div className="bg-white rounded-lg shadow-sm p-4 divide-y divide-gray-100">
          {friendActivity.map((item, index) => (
            <ActivityItem
              key={index}
              userId={item.userId}
              userName={item.userName}
              userImage={item.userImage}
              action={item.action}
              timeAgo={item.timeAgo}
            />
          ))}
        </div>
      </div>

      <div className="px-4 mb-8">
        <h2 className="text-2xl font-bold mb-4">Featured Recommendations</h2>
        <div className="grid grid-cols-2 gap-4">
          {featuredProducts.map((product) => (
            <ProductCard
              key={product.id}
              id={product.id}
              name={product.name}
              image={product.image}
              category={product.category}
            />
          ))}
        </div>
      </div>

      <div className="px-4 mb-8">
        <h2 className="text-2xl font-bold mb-4">Upcoming</h2>
        <div className="bg-white rounded-lg shadow-sm divide-y divide-gray-100">
          {upcomingEvents.map((event) => (
            <div key={event.id} className="py-4 px-4 flex items-center">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mr-4">
                {event.type === "Babysitting" ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-purple-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                    <line x1="16" y1="2" x2="16" y2="6"></line>
                    <line x1="8" y1="2" x2="8" y2="6"></line>
                    <line x1="3" y1="10" x2="21" y2="10"></line>
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-purple-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 10V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16v-3"></path>
                    <path d="M16.5 9.4 7.55 4.24"></path><path d="M3.29 7 12 12l8.71-5"></path><path d="M12 22V12"></path>
                  </svg>
                )}
              </div>
              <div className="flex-grow">
                <h3 className="font-semibold text-gray-800">{event.type}</h3>
                <p className="text-sm text-gray-500">{event.details}</p>
              </div>
              <div className="text-right text-sm text-purple-500">{event.date}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="px-4 mb-8">
        <h2 className="text-2xl font-bold mb-4">Tips & Resources</h2>
        <Link to="/tips/sleep-training" className="flex items-center p-4 bg-white rounded-lg shadow-sm">
          <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mr-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-purple-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
              <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
            </svg>
          </div>
          <div>
            <h3 className="font-semibold text-gray-800">Sleep Training Guide</h3>
          </div>
        </Link>
      </div>

      <BottomNavigation />
    </div>
  );
};

export default Home;
