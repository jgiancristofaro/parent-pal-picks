
import { useState } from "react";
import { Header } from "@/components/Header";
import { BottomNavigation } from "@/components/BottomNavigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search as SearchIcon } from "lucide-react";
import { SitterCard } from "@/components/SitterCard";
import { FriendRecommendedFilter } from "@/components/FriendRecommendedFilter";
import { useFriendRecommendedSitters } from "@/hooks/useFriendRecommendedSitters";

interface SearchFilters {
  location: string;
  date: string;
  time: string;
  availability: string;
  experience: string;
  friendRecommendedOnly: boolean;
}

const Search = () => {
  const [searchFilters, setSearchFilters] = useState<SearchFilters>({
    location: "",
    date: "",
    time: "",
    availability: "",
    experience: "",
    friendRecommendedOnly: false
  });
  
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [hasSearched, setHasSearched] = useState(false);

  // Mock user ID - in a real app, this would come from authentication
  const currentUserId = "mock-user-id";

  // Fetch friend-recommended sitters
  const { 
    data: friendRecommendedSitters, 
    isLoading: loadingFriendRecommended,
    error: friendRecommendedError
  } = useFriendRecommendedSitters(
    currentUserId, 
    searchFilters.friendRecommendedOnly
  );

  // Mock sitter data for demonstration
  const mockSitters = [
    {
      id: "1",
      name: "Emma Johnson",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=2487&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      rating: 4.8,
      experience: "5+ years experience",
      recommendedBy: "Sarah M."
    },
    {
      id: "2", 
      name: "Sophia Bennett",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      rating: 4.9,
      experience: "3+ years experience"
    },
    {
      id: "3",
      name: "Madison Clark",
      image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=2564&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      rating: 4.7,
      experience: "2+ years experience",
      recommendedBy: "Kelly R."
    }
  ];

  const handleSearch = () => {
    console.log("Search filters:", searchFilters);
    
    let filteredSitters = mockSitters;
    
    // If friend-recommended filter is active, use the data from the hook
    if (searchFilters.friendRecommendedOnly) {
      if (loadingFriendRecommended) {
        console.log("Still loading friend recommendations...");
        return;
      }
      
      if (friendRecommendedError) {
        console.error("Error loading friend recommendations:", friendRecommendedError);
        filteredSitters = [];
      } else {
        filteredSitters = friendRecommendedSitters || [];
        console.log("Using friend-recommended sitters:", filteredSitters.length);
      }
    } else {
      // Apply other filters to mock data
      if (searchFilters.location) {
        filteredSitters = filteredSitters.filter(() => true);
      }
    }
    
    setSearchResults(filteredSitters);
    setHasSearched(true);
  };

  const handleFriendRecommendedToggle = (enabled: boolean) => {
    setSearchFilters(prev => ({ ...prev, friendRecommendedOnly: enabled }));
    
    // Auto-search when toggling friend-recommended filter
    if (enabled) {
      setHasSearched(true);
      if (!loadingFriendRecommended && friendRecommendedSitters) {
        setSearchResults(friendRecommendedSitters);
      }
    }
  };

  return (
    <div className="min-h-screen pb-20 bg-purple-50">
      <Header title="Find a sitter" showBack={true} />
      
      <div className="p-4">
        <div className="relative mb-6">
          <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <Input 
            className="pl-10 py-6 bg-white rounded-lg border-gray-200" 
            placeholder="Search by location"
            value={searchFilters.location}
            onChange={(e) => setSearchFilters(prev => ({ ...prev, location: e.target.value }))}
          />
        </div>

        {/* Friend-Recommended Filter - Prominently displayed */}
        <div className="mb-6">
          <FriendRecommendedFilter
            enabled={searchFilters.friendRecommendedOnly}
            onToggle={handleFriendRecommendedToggle}
            friendCount={0} // This could be fetched from a separate query
          />
        </div>
        
        <div className="mb-6">
          <label className="block text-xl font-semibold mb-2">Date</label>
          <div className="relative">
            <Button 
              variant="outline" 
              className="w-full justify-between py-6 text-left bg-white border-gray-200"
              onClick={() => setSearchFilters(prev => ({ ...prev, date: "2024-07-15" }))}
            >
              <span className={searchFilters.date ? "text-gray-900" : "text-gray-500"}>
                {searchFilters.date || "Select date"}
              </span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </Button>
          </div>
        </div>
        
        <div className="mb-6">
          <label className="block text-xl font-semibold mb-2">Time</label>
          <div className="relative">
            <Button 
              variant="outline" 
              className="w-full justify-between py-6 text-left bg-white border-gray-200"
              onClick={() => setSearchFilters(prev => ({ ...prev, time: "6:00 PM - 10:00 PM" }))}
            >
              <span className={searchFilters.time ? "text-gray-900" : "text-gray-500"}>
                {searchFilters.time || "Select time"}
              </span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </Button>
          </div>
        </div>
        
        <div className="flex gap-4 mb-6">
          <Button 
            variant="outline" 
            className="flex-1 justify-between py-3 text-left bg-white border-gray-200"
            onClick={() => setSearchFilters(prev => ({ ...prev, availability: "Available today" }))}
          >
            <span>Availability</span>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </Button>
          
          <Button 
            variant="outline" 
            className="flex-1 justify-between py-3 text-left bg-white border-gray-200"
            onClick={() => setSearchFilters(prev => ({ ...prev, experience: "3+ years" }))}
          >
            <span>Experience</span>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </Button>
        </div>
        
        <Button 
          className="w-full py-6 bg-purple-500 hover:bg-purple-600 text-white rounded-lg"
          onClick={handleSearch}
          disabled={searchFilters.friendRecommendedOnly && loadingFriendRecommended}
        >
          {searchFilters.friendRecommendedOnly && loadingFriendRecommended ? "Loading..." : "Search"}
        </Button>

        {hasSearched && (
          <div className="mt-6">
            <h2 className="text-xl font-semibold mb-4">
              {searchFilters.friendRecommendedOnly ? (
                <>Friend-Recommended Sitters ({searchResults.length} found)</>
              ) : (
                <>Search Results ({searchResults.length} sitters found)</>
              )}
            </h2>
            {searchResults.length > 0 ? (
              <div>
                {searchResults.map((sitter) => (
                  <SitterCard
                    key={sitter.id}
                    id={sitter.id}
                    name={sitter.name}
                    image={sitter.image}
                    rating={sitter.rating}
                    experience={sitter.experience}
                    recommendedBy={sitter.recommendedBy}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                {searchFilters.friendRecommendedOnly ? (
                  <>
                    <p className="text-gray-500">No friend-recommended sitters found.</p>
                    <p className="text-gray-400 text-sm mt-2">
                      Try following more friends or search without the filter.
                    </p>
                  </>
                ) : (
                  <>
                    <p className="text-gray-500">No sitters found matching your criteria.</p>
                    <p className="text-gray-400 text-sm mt-2">Try adjusting your filters.</p>
                  </>
                )}
              </div>
            )}
          </div>
        )}
      </div>
      
      <BottomNavigation />
    </div>
  );
};

export default Search;
