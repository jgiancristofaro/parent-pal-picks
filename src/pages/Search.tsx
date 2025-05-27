
import { useState } from "react";
import { Header } from "@/components/Header";
import { BottomNavigation } from "@/components/BottomNavigation";
import { Input } from "@/components/ui/input";
import { Search as SearchIcon } from "lucide-react";
import { SitterCard } from "@/components/SitterCard";

const Search = () => {
  const [searchTerm, setSearchTerm] = useState("");

  // Enhanced mock sitter data with friendRecommendationCount
  const mockSitters = [
    {
      id: "1",
      name: "Emma Johnson",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=2487&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      rating: 4.8,
      experience: "5+ years experience",
      friendRecommendationCount: 5
    },
    {
      id: "2", 
      name: "Sophia Bennett",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      rating: 4.9,
      experience: "3+ years experience",
      friendRecommendationCount: 3
    },
    {
      id: "3",
      name: "Madison Clark",
      image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=2564&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      rating: 4.7,
      experience: "2+ years experience",
      friendRecommendationCount: 1
    },
    {
      id: "4",
      name: "Jessica Williams",
      image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=2488&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      rating: 4.6,
      experience: "4+ years experience",
      friendRecommendationCount: 0
    },
    {
      id: "5",
      name: "Ashley Davis",
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=2487&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      rating: 4.9,
      experience: "6+ years experience",
      friendRecommendationCount: 2
    }
  ];

  // Filter and sort sitters based on search term
  const filteredSitters = searchTerm 
    ? mockSitters.filter(sitter => 
        sitter.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : mockSitters.sort((a, b) => b.friendRecommendationCount - a.friendRecommendationCount);

  return (
    <div className="min-h-screen pb-20 bg-purple-50">
      <Header title="Find a sitter" showBack={true} showSettings={false} />
      
      <div className="p-4">
        {/* Search Bar */}
        <div className="relative mb-6">
          <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <Input 
            className="pl-10 py-3 bg-white rounded-lg border-gray-200" 
            placeholder="Search sitters by name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Sitter Results Grid */}
        <div className="grid grid-cols-2 gap-4">
          {filteredSitters.map((sitter) => (
            <SitterCard
              key={sitter.id}
              id={sitter.id}
              name={sitter.name}
              image={sitter.image}
              rating={sitter.rating}
              experience={sitter.experience}
              friendRecommendationCount={sitter.friendRecommendationCount}
            />
          ))}
        </div>

        {filteredSitters.length === 0 && searchTerm && (
          <div className="text-center py-8">
            <p className="text-gray-500">No sitters found matching "{searchTerm}"</p>
            <p className="text-gray-400 text-sm mt-2">Try searching with a different name.</p>
          </div>
        )}
      </div>
      
      <BottomNavigation />
    </div>
  );
};

export default Search;
