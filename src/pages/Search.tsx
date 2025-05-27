
import { useState } from "react";
import { Header } from "@/components/Header";
import { BottomNavigation } from "@/components/BottomNavigation";
import { Button } from "@/components/ui/button";
import { FriendRecommendedFilter } from "@/components/FriendRecommendedFilter";
import { useFriendRecommendedSitters } from "@/hooks/useFriendRecommendedSitters";
import { format } from "date-fns";
import { SearchFilters } from "@/components/search/SearchFilters";
import { DateTimeFilters } from "@/components/search/DateTimeFilters";
import { AdditionalFilters } from "@/components/search/AdditionalFilters";
import { SearchResults } from "@/components/search/SearchResults";

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
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>("");

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

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
    if (date) {
      setSearchFilters(prev => ({ ...prev, date: format(date, "yyyy-MM-dd") }));
    } else {
      setSearchFilters(prev => ({ ...prev, date: "" }));
    }
  };

  const handleTimeSlotSelect = (value: string) => {
    setSelectedTimeSlot(value);
    const timeSlots = [
      { value: "morning", label: "Morning", time: "8am-12pm" },
      { value: "afternoon", label: "Afternoon", time: "12pm-5pm" },
      { value: "evening", label: "Evening", time: "5pm-9pm" },
      { value: "anytime", label: "Any Time", time: "" }
    ];
    const selectedSlot = timeSlots.find(slot => slot.value === value);
    if (selectedSlot) {
      const timeString = selectedSlot.time ? `${selectedSlot.label} (${selectedSlot.time})` : selectedSlot.label;
      setSearchFilters(prev => ({ ...prev, time: timeString }));
    }
  };

  const handleLocationChange = (location: string) => {
    setSearchFilters(prev => ({ ...prev, location }));
  };

  const handleAvailabilityFilter = () => {
    setSearchFilters(prev => ({ ...prev, availability: "Available today" }));
  };

  const handleExperienceFilter = () => {
    setSearchFilters(prev => ({ ...prev, experience: "3+ years" }));
  };

  return (
    <div className="min-h-screen pb-20 bg-purple-50">
      <Header title="Find a sitter" showBack={true} />
      
      <div className="p-4">
        <SearchFilters 
          location={searchFilters.location}
          onLocationChange={handleLocationChange}
        />

        {/* Friend-Recommended Filter - Prominently displayed */}
        <div className="mb-6">
          <FriendRecommendedFilter
            enabled={searchFilters.friendRecommendedOnly}
            onToggle={handleFriendRecommendedToggle}
            friendCount={0} // This could be fetched from a separate query
          />
        </div>

        <DateTimeFilters
          selectedDate={selectedDate}
          selectedTimeSlot={selectedTimeSlot}
          onDateSelect={handleDateSelect}
          onTimeSlotSelect={handleTimeSlotSelect}
        />
        
        <AdditionalFilters
          onAvailabilityFilter={handleAvailabilityFilter}
          onExperienceFilter={handleExperienceFilter}
        />
        
        <Button 
          className="w-full py-6 bg-purple-500 hover:bg-purple-600 text-white rounded-lg"
          onClick={handleSearch}
          disabled={searchFilters.friendRecommendedOnly && loadingFriendRecommended}
        >
          {searchFilters.friendRecommendedOnly && loadingFriendRecommended ? "Loading..." : "Search"}
        </Button>

        <SearchResults
          searchResults={searchResults}
          hasSearched={hasSearched}
          friendRecommendedOnly={searchFilters.friendRecommendedOnly}
        />
      </div>
      
      <BottomNavigation />
    </div>
  );
};

export default Search;
