
import { useState } from "react";
import { Header } from "@/components/Header";
import { BottomNavigation } from "@/components/BottomNavigation";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Search as SearchIcon, Home } from "lucide-react";
import { SitterCard } from "@/components/SitterCard";
import { HyperLocalSitters } from "@/components/search/HyperLocalSitters";
import { useUserLocations } from "@/hooks/useUserLocations";
import { useLocalSitters } from "@/hooks/useLocalSitters";

const Search = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [friendRecommendedOnly, setFriendRecommendedOnly] = useState(false);
  
  // New state for home selection and local filtering
  const [selectedUserHomeId, setSelectedUserHomeId] = useState<string | null>(null);
  const [localSearchScope, setLocalSearchScope] = useState<string>("ANY");

  // Mock current user ID for demonstration - in a real app this would come from auth
  const mockCurrentUserId = "user-2";

  // Fetch user's saved locations
  const { data: userLocations = [], isLoading: locationsLoading } = useUserLocations();

  // Get selected home details
  const selectedUserHomeDetails = userLocations.find(loc => loc.id === selectedUserHomeId);

  // Fetch local sitters when local scope is active
  const shouldFetchLocalSitters = localSearchScope !== "ANY" && selectedUserHomeId !== null;
  const { data: localSittersRaw = [], isLoading: localSittersLoading } = useLocalSitters(
    mockCurrentUserId,
    selectedUserHomeId || undefined,
    localSearchScope as 'BUILDING' | 'AREA_ZIP',
    shouldFetchLocalSitters
  );

  // Transform local sitters to match SitterCard format
  const localSitters = localSittersRaw.map(sitter => ({
    id: sitter.id,
    name: sitter.name,
    image: sitter.profile_image_url || "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=2487&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    rating: sitter.rating || 0,
    experience: sitter.experience || "Experience not specified",
    friendRecommendationCount: 0,
    workedInUserLocationNickname: selectedUserHomeDetails?.location_nickname
  }));

  // Enhanced mock sitter data with friendRecommendationCount
  const mockSitters = [
    {
      id: "1",
      name: "Emma Johnson",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=2487&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      rating: 4.8,
      experience: "5+ years experience",
      friendRecommendationCount: 5,
      workedInUserLocationNickname: undefined
    },
    {
      id: "2", 
      name: "Sophia Bennett",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      rating: 4.9,
      experience: "3+ years experience",
      friendRecommendationCount: 3,
      workedInUserLocationNickname: undefined
    },
    {
      id: "3",
      name: "Madison Clark",
      image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=2564&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      rating: 4.7,
      experience: "2+ years experience",
      friendRecommendationCount: 1,
      workedInUserLocationNickname: undefined
    },
    {
      id: "4",
      name: "Jessica Williams",
      image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=2488&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      rating: 4.6,
      experience: "4+ years experience",
      friendRecommendationCount: 0,
      workedInUserLocationNickname: undefined
    },
    {
      id: "5",
      name: "Ashley Davis",
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=2487&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      rating: 4.9,
      experience: "6+ years experience",
      friendRecommendationCount: 2,
      workedInUserLocationNickname: undefined
    }
  ];

  // Determine which sitters to display based on filters
  const getDisplayedSitters = () => {
    let sittersToShow = mockSitters;

    // If local scope is active and we have results, use those instead
    if (shouldFetchLocalSitters && localSitters.length > 0) {
      sittersToShow = localSitters;
    }

    // Apply friend recommendation filter
    if (friendRecommendedOnly) {
      sittersToShow = sittersToShow.filter(sitter => sitter.friendRecommendationCount > 0);
    }

    // Apply search term filter
    if (searchTerm) {
      sittersToShow = sittersToShow.filter(sitter => 
        sitter.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    } else if (!shouldFetchLocalSitters && !friendRecommendedOnly) {
      // Sort by friend recommendations when no other filters are active
      sittersToShow = sittersToShow.sort((a, b) => b.friendRecommendationCount - a.friendRecommendationCount);
    }

    return sittersToShow;
  };

  const displayedSitters = getDisplayedSitters();

  // Check if building filter option should be available
  const canFilterByBuilding = selectedUserHomeDetails?.dwelling_type === 'APARTMENT_BUILDING' && 
                              selectedUserHomeDetails?.building_identifier && 
                              selectedUserHomeDetails.building_identifier.trim() !== '';

  return (
    <div className="min-h-screen pb-20 bg-purple-50">
      <Header title="Find a sitter" showBack={true} showSettings={false} />
      
      <div className="p-4">
        {/* Search Bar */}
        <div className="relative mb-4">
          <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <Input 
            className="pl-10 py-3 bg-white rounded-lg border-gray-200" 
            placeholder="Search sitters by name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Home Selection */}
        {userLocations.length > 0 && (
          <div className="mb-4 p-4 bg-white rounded-lg border border-gray-200">
            <div className="flex items-center space-x-3 mb-3">
              <Home className="h-5 w-5 text-purple-600" />
              <Label className="text-sm font-medium">Search for sitters near:</Label>
            </div>
            <Select value={selectedUserHomeId || ""} onValueChange={setSelectedUserHomeId}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select your home" />
              </SelectTrigger>
              <SelectContent>
                {userLocations.map((location) => (
                  <SelectItem key={location.id} value={location.id}>
                    {location.location_nickname} ({location.dwelling_type.replace('_', ' ').toLowerCase()})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Dynamic Local Options Filter */}
        {selectedUserHomeDetails && (
          <div className="mb-4 p-4 bg-white rounded-lg border border-gray-200">
            <Label className="text-sm font-medium mb-3 block">Find sitters reviewed by others:</Label>
            <RadioGroup value={localSearchScope} onValueChange={setLocalSearchScope}>
              {/* Building Option - Only show for apartment buildings with building identifier */}
              {canFilterByBuilding && (
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="BUILDING" id="building" />
                  <Label htmlFor="building" className="text-sm cursor-pointer">
                    In my building ({selectedUserHomeDetails.building_identifier})
                  </Label>
                </div>
              )}
              
              {/* Area/Zip Option */}
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="AREA_ZIP" id="area" />
                <Label htmlFor="area" className="text-sm cursor-pointer">
                  In my area ({selectedUserHomeDetails.zip_code})
                </Label>
              </div>
              
              {/* Anywhere Option */}
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="ANY" id="anywhere" />
                <Label htmlFor="anywhere" className="text-sm cursor-pointer">
                  Anywhere
                </Label>
              </div>
            </RadioGroup>
          </div>
        )}

        {/* Friend Recommended Filter */}
        <div className="mb-4 p-4 bg-white rounded-lg border border-gray-200">
          <div className="flex items-center space-x-3">
            <Switch
              id="friend-recommended"
              checked={friendRecommendedOnly}
              onCheckedChange={setFriendRecommendedOnly}
            />
            <Label htmlFor="friend-recommended" className="text-sm font-medium">
              Friend-Recommended Only
            </Label>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Show only sitters recommended by people you follow.
          </p>
        </div>

        {/* Original Hyper-Local Component - Only show when no filters are active */}
        {!searchTerm && !friendRecommendedOnly && localSearchScope === "ANY" && userLocations.length > 0 && (
          <HyperLocalSitters 
            currentUserId={mockCurrentUserId}
            selectedLocationId={userLocations[0]?.id}
            locationNickname={userLocations[0]?.location_nickname}
            searchScope="BUILDING"
          />
        )}

        {/* Results Section */}
        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-4">
            {searchTerm && `Search Results (${displayedSitters.length} found)`}
            {!searchTerm && friendRecommendedOnly && 'Friend-Recommended Sitters'}
            {!searchTerm && !friendRecommendedOnly && localSearchScope === "BUILDING" && selectedUserHomeDetails && 
              `Sitters from ${selectedUserHomeDetails.building_identifier} (${displayedSitters.length} found)`}
            {!searchTerm && !friendRecommendedOnly && localSearchScope === "AREA_ZIP" && selectedUserHomeDetails && 
              `Sitters from ${selectedUserHomeDetails.zip_code} area (${displayedSitters.length} found)`}
            {!searchTerm && !friendRecommendedOnly && localSearchScope === "ANY" && 'All Sitters'}
          </h2>
          
          {(localSittersLoading && shouldFetchLocalSitters) ? (
            <div className="text-center py-8">
              <p className="text-gray-500">Loading local recommendations...</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              {displayedSitters.map((sitter) => (
                <SitterCard
                  key={sitter.id}
                  id={sitter.id}
                  name={sitter.name}
                  image={sitter.image}
                  rating={sitter.rating}
                  experience={sitter.experience}
                  friendRecommendationCount={sitter.friendRecommendationCount}
                  workedInUserLocationNickname={sitter.workedInUserLocationNickname}
                />
              ))}
            </div>
          )}
        </div>

        {/* No Results Message */}
        {displayedSitters.length === 0 && !localSittersLoading && (
          <div className="text-center py-8">
            {searchTerm && (
              <>
                <p className="text-gray-500">No sitters found matching "{searchTerm}"</p>
                <p className="text-gray-400 text-sm mt-2">Try searching with a different name.</p>
              </>
            )}
            {!searchTerm && friendRecommendedOnly && (
              <>
                <p className="text-gray-500">No friend-recommended sitters found.</p>
                <p className="text-gray-400 text-sm mt-2">Try following more friends or search without the filter.</p>
              </>
            )}
            {!searchTerm && !friendRecommendedOnly && shouldFetchLocalSitters && (
              <>
                <p className="text-gray-500">No local sitters found yet.</p>
                <p className="text-gray-400 text-sm mt-2">Try searching anywhere or check back later.</p>
              </>
            )}
          </div>
        )}
      </div>
      
      <BottomNavigation />
    </div>
  );
};

export default Search;
