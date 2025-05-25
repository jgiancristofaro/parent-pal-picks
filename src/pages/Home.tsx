
import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { BottomNavigation } from "@/components/BottomNavigation";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { ArrowRight } from "lucide-react";

const Home = () => {
  // Mock user data
  const mockUserName = "Sarah";
  const mockUserProfileImage = "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=2487&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";
  
  // Dynamic hero message state
  const [heroMessage, setHeroMessage] = useState(`Welcome back, ${mockUserName}!`);
  
  // Mock data for demonstration
  const featuredProducts = [{
    id: "1",
    name: "Top-rated Baby Monitors",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80&w=2069&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    category: "Baby Safety"
  }, {
    id: "2",
    name: "Essential Baby Carriers",
    image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    category: "Carrying"
  }, {
    id: "3",
    name: "Organic Baby Food",
    image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=2420&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    category: "Nutrition"
  }, {
    id: "4",
    name: "Soft Baby Blankets",
    image: "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?q=80&w=2535&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    category: "Comfort"
  }];
  
  // Mock friends activity - can be empty to test empty state
  const friendActivity = [{
    userId: "101",
    userName: "Olivia Bennett",
    userImage: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=2487&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    action: "Recommended a sitter",
    timeAgo: "2d"
  }, {
    userId: "102",
    userName: "Ethan Chen",
    userImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=2487&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    action: "Booked a sitter",
    timeAgo: "3d"
  }, {
    userId: "103",
    userName: "Sarah Williams",
    userImage: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=2487&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    action: "Recommended baby bottles",
    timeAgo: "4d"
  }];

  // Mock dynamic message logic
  useEffect(() => {
    const timer = setTimeout(() => {
      const dynamicMessages = [
        "You have 3 new recommendations from friends.",
        "Olivia just reviewed a sitter you might like."
      ];
      const randomMessage = dynamicMessages[Math.floor(Math.random() * dynamicMessages.length)];
      setHeroMessage(randomMessage);
    }, 5000); // Changes after 5 seconds for demo

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen pb-20 bg-gray-50">
      <Header 
        showUserProfileImage={true}
        userProfileImageUrl={mockUserProfileImage}
        userFullName={mockUserName}
        showBack={false}
        showSettings={true}
      />
      
      {/* Dynamic Hero Section */}
      <div className="px-4 mb-8">
        <div className="relative h-44 bg-gradient-to-br from-purple-100 to-purple-50 rounded-2xl overflow-hidden">
          <div className="absolute inset-0 bg-center bg-cover opacity-30" style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1492725764893-90b379c2b6e7?q=80&w=2540&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')"
          }}>
          </div>
          <div className="relative h-full flex flex-col justify-center p-6 bg-violet-200">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">{heroMessage}</h1>
            <p className="text-gray-600">How can we help you today?</p>
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

      {/* Enhanced Friends' Activity Section */}
      <div className="mb-8">
        <div className="flex justify-between items-center px-4 mb-4">
          <h2 className="text-2xl font-bold">Friends' Activity</h2>
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
          <ScrollArea className="w-full whitespace-nowrap">
            <div className="flex w-max space-x-4 p-4">
              {friendActivity.map((item, index) => (
                <div key={index} className="flex-none w-64 bg-white rounded-xl shadow-sm p-4 border border-gray-100">
                  <div className="flex items-start">
                    <Link to={`/profile/${item.userId}`} className="flex-shrink-0">
                      <div className="w-12 h-12 rounded-full overflow-hidden">
                        <img src={item.userImage} alt={item.userName} className="w-full h-full object-cover" />
                      </div>
                    </Link>
                    <div className="ml-3 flex-grow">
                      <div className="flex justify-between items-start">
                        <Link to={`/profile/${item.userId}`}>
                          <p className="font-semibold text-gray-800 text-sm">{item.userName}</p>
                        </Link>
                        <p className="text-xs text-gray-500">{item.timeAgo}</p>
                      </div>
                      <p className="text-gray-600 text-sm mt-1">{item.action}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        )}
      </div>

      {/* Featured Recommendations - Horizontal Scroll */}
      <div className="mb-8">
        <div className="flex justify-between items-center px-4 mb-4">
          <h2 className="text-2xl font-bold">Featured Recommendations</h2>
          <button className="text-purple-500 text-sm font-medium">View All</button>
        </div>
        <ScrollArea className="w-full whitespace-nowrap">
          <div className="flex w-max space-x-4 p-4">
            {featuredProducts.map(product => (
              <div key={product.id} className="flex-none w-48">
                <Link to={`/product/${product.id}`}>
                  <div className="rounded-xl overflow-hidden bg-white shadow-sm hover:shadow-lg transition-shadow duration-200">
                    <div className="aspect-square overflow-hidden">
                      <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="p-3">
                      <h3 className="font-semibold text-gray-800 text-sm line-clamp-2">{product.name}</h3>
                      <p className="text-xs text-gray-500 mt-1">{product.category}</p>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>

      <BottomNavigation />
    </div>
  );
};

export default Home;
