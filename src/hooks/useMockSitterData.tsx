
import { useMockUserLocations } from "@/hooks/useMockUserLocations";
import { useMockLocalSitters } from "@/hooks/useMockLocalSitters";

interface Sitter {
  id: string;
  name: string;
  image: string;
  rating: number;
  experience?: string;
  friendRecommendationCount: number;
  workedInUserLocationNickname?: string;
}

interface UseMockSitterDataProps {
  mockCurrentUserId: string;
  selectedUserHomeId: string | null;
  localSearchScope: string;
  searchTerm: string;
  friendRecommendedOnly: boolean;
}

export const useMockSitterData = ({
  mockCurrentUserId,
  selectedUserHomeId,
  localSearchScope,
  searchTerm,
  friendRecommendedOnly
}: UseMockSitterDataProps) => {
  // Fetch mock user's saved locations
  const { data: userLocations = [], isLoading: locationsLoading } = useMockUserLocations();

  // Get selected home details
  const selectedUserHomeDetails = userLocations.find(loc => loc.id === selectedUserHomeId);

  // Fetch local sitters when local scope is active
  const shouldFetchLocalSitters = localSearchScope !== "ANY" && selectedUserHomeId !== null;
  const { data: localSittersRaw = [], isLoading: localSittersLoading } = useMockLocalSitters(
    mockCurrentUserId,
    selectedUserHomeId || undefined,
    localSearchScope as 'BUILDING' | 'AREA_ZIP',
    shouldFetchLocalSitters
  );

  // Transform local sitters to match SitterCard format
  const localSitters = localSittersRaw.map(sitter => ({
    id: sitter.id,
    name: sitter.name,
    image: sitter.profile_image_url,
    rating: sitter.rating,
    experience: sitter.experience,
    friendRecommendationCount: Math.floor(Math.random() * 3), // Random friend recommendations
    workedInUserLocationNickname: selectedUserHomeDetails?.location_nickname
  }));

  // Enhanced mock sitter data with friendRecommendationCount
  const mockSitters: Sitter[] = [
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

  return {
    userLocations,
    locationsLoading,
    selectedUserHomeDetails,
    localSittersLoading,
    shouldFetchLocalSitters,
    displayedSitters
  };
};
