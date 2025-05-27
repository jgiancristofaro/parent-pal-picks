
import { useState } from "react";
import { Header } from "@/components/Header";
import { BottomNavigation } from "@/components/BottomNavigation";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search as SearchIcon } from "lucide-react";
import { SitterCard } from "@/components/SitterCard";
import { HyperLocalSitters } from "@/components/search/HyperLocalSitters";
import { useUserLocations } from "@/hooks/useUserLocations";
import { useHyperLocalSitters } from "@/hooks/useHyperLocalSitters";

const Search = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [hyperLocalFilterActive, setHyperLocalFilterActive] = useState(false);
  const [selectedLocationIdForFilter, setSelectedLocationIdForFilter] = useState<string | null>(null);

  // Mock current user ID for demonstration - in a real app this would come from auth
  const mockCurrentUserId = "user-2";

  // Fetch user's saved locations
  const { data: userLocations = [], isLoading: locationsLoading } = useUserLocations();

  // Get apartment buildings only for hyper-local filter
  const apartmentBuildings = userLocations.filter(loc => loc.dwelling_type === 'APARTMENT_BUILDING');

  // Fetch hyper-local sitters when filter is active
  const { data: hyperLocalSittersRaw = [], isLoading: hyperLocalLoading } = useHyperLocalSitters(
    mockCurrentUserId,
    selectedLocationIdForFilter,
    hyperLocalFilterActive && !!selectedLocationIdForFilter
  );

  // Transform hyper-local sitters to match SitterCard format and add location context
  const selectedLocation = userLocations.find(loc => loc.id === selectedLocationIdForFilter);
  const hyperLocalSitters = hyperLocalSittersRaw.map(sitter => ({
    id: sitter.id,
    name: sitter.name,
    image: sitter.profile_image_url || "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=2487&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    rating: sitter.rating || 0,
    experience: sitter.experience || "Experience not specified",
    friendRecommendationCount: 0,
    workedInUserLocationNickname: selectedLocation?.location_nickname
  }));

  // Enhanced mock sitter data with friendRecommendationCount and workedInUserLocationNickname
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

  // Handle location filter toggle
  const handleHyperLocalToggle = (checked: boolean) => {
    setHyperLocalFilterActive(checked);
    
    // Auto-select location if user has exactly one apartment building
    if (checked && apartmentBuildings.length === 1) {
      setSelectedLocationIdForFilter(apartmentBuildings[0].id);
    } else if (!checked) {
      setSelectedLocationIdForFilter(null);
    }
  };

  // Determine which sitters to display
  const getDisplayedSitters = () => {
    let sittersToShow = mockSitters;

    // If hyper-local filter is active and we have results, use those
    if (hyperLocalFilterActive && selectedLocationIdForFilter && hyperLocalSitters.length > 0) {
      sittersToShow = hyperLocalSitters;
    }

    // Apply search term filter
    if (searchTerm) {
      sittersToShow = sittersToShow.filter(sitter => 
        sitter.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    } else if (!hyperLocalFilterActive) {
      // Sort by friend recommendations when no search term and no hyper-local filter
      sittersToShow = sittersToShow.sort((a, b) => b.friendRecommendationCount - a.friendRecommendationCount);
    }

    return sittersToShow;
  };

  const displayedSitters = getDisplayedSitters();

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

        {/* Hyper-Local Filter - Only show if user has apartment buildings */}
        {apartmentBuildings.length > 0 && (
          <div className="mb-6 p-4 bg-white rounded-lg border border-gray-200">
            <div className="flex items-center space-x-3 mb-3">
              <Switch
                id="hyper-local-filter"
                checked={hyperLocalFilterActive}
                onCheckedChange={handleHyperLocalToggle}
              />
              <Label htmlFor="hyper-local-filter" className="text-sm font-medium">
                Sitters from my building
              </Label>
            </div>
            
            <p className="text-xs text-gray-500 ml-8 mb-3">
              Find sitters who have worked in your apartment building based on neighbor reviews.
            </p>

            {hyperLocalFilterActive && apartmentBuildings.length > 1 && (
              <div className="ml-8">
                <Select 
                  value={selectedLocationIdForFilter || ""} 
                  onValueChange={setSelectedLocationIdForFilter}
                >
                  <SelectTrigger className="w-full max-w-xs">
                    <SelectValue placeholder="Select your building" />
                  </SelectTrigger>
                  <SelectContent>
                    {apartmentBuildings.map((location) => (
                      <SelectItem key={location.id} value={location.id}>
                        {location.location_nickname}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {hyperLocalFilterActive && apartmentBuildings.length === 1 && (
              <p className="text-xs text-gray-600 ml-8">
                Filtering for: {apartmentBuildings[0].location_nickname}
              </p>
            )}
          </div>
        )}

        {apartmentBuildings.length === 0 && (
          <div className="mb-6 p-4 bg-white rounded-lg border border-gray-200">
            <p className="text-sm text-gray-500">
              Add an apartment building in your settings to get hyper-local sitter recommendations from your neighbors.
            </p>
          </div>
        )}

        {/* Hyper-Local Sitter Recommendations (Original Component - shown when no filters) */}
        {!searchTerm && !hyperLocalFilterActive && apartmentBuildings.length > 0 && (
          <HyperLocalSitters 
            currentUserId={mockCurrentUserId}
            selectedLocationId={apartmentBuildings[0]?.id}
            locationNickname={apartmentBuildings[0]?.location_nickname}
          />
        )}

        {/* All Sitters Results Grid */}
        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-4">
            {searchTerm && `Search Results (${displayedSitters.length} found)`}
            {!searchTerm && hyperLocalFilterActive && selectedLocationIdForFilter && `Sitters from ${apartmentBuildings.find(loc => loc.id === selectedLocationIdForFilter)?.location_nickname} (${displayedSitters.length} found)`}
            {!searchTerm && !hyperLocalFilterActive && 'All Sitters'}
          </h2>
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
        </div>

        {displayedSitters.length === 0 && (searchTerm || hyperLocalFilterActive) && (
          <div className="text-center py-8">
            {searchTerm && (
              <>
                <p className="text-gray-500">No sitters found matching "{searchTerm}"</p>
                <p className="text-gray-400 text-sm mt-2">Try searching with a different name.</p>
              </>
            )}
            {!searchTerm && hyperLocalFilterActive && (
              <>
                <p className="text-gray-500">No sitters found from your building yet.</p>
                <p className="text-gray-400 text-sm mt-2">Try searching all sitters or check back later.</p>
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
