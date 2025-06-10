
import { useUserLocations } from "@/hooks/useUserLocations";
import { useLocalSitters } from "@/hooks/useLocalSitters";
import { useFriendRecommendedSitters } from "@/hooks/useFriendRecommendedSitters";
import { useAllSitters } from "@/hooks/useAllSitters";

interface Sitter {
  id: string;
  name: string;
  image: string;
  rating: number;
  experience?: string;
  friendRecommendationCount: number;
  workedInUserLocationNickname?: string;
}

interface UseSitterDataProps {
  currentUserId: string;
  selectedUserHomeId: string | null;
  localSearchScope: string;
  searchTerm: string;
  friendRecommendedOnly: boolean;
}

export const useSitterData = ({
  currentUserId,
  selectedUserHomeId,
  localSearchScope,
  searchTerm,
  friendRecommendedOnly
}: UseSitterDataProps) => {
  // Fetch user's saved locations
  const { data: userLocations = [], isLoading: locationsLoading } = useUserLocations();

  // Get selected home details
  const selectedUserHomeDetails = userLocations.find(loc => loc.id === selectedUserHomeId);

  // Fetch local sitters when local scope is active
  const shouldFetchLocalSitters = localSearchScope !== "ANY" && selectedUserHomeId !== null;
  const { data: localSittersRaw = [], isLoading: localSittersLoading } = useLocalSitters(
    currentUserId,
    selectedUserHomeId || undefined,
    localSearchScope as 'BUILDING' | 'AREA_ZIP',
    shouldFetchLocalSitters
  );

  // Fetch friend recommended sitters
  const { data: friendRecommendedSittersRaw = [] } = useFriendRecommendedSitters(
    currentUserId,
    true
  );

  // Fetch all sitters as fallback
  const shouldFetchAllSitters = !shouldFetchLocalSitters && !friendRecommendedOnly;
  const { data: allSittersRaw = [], isLoading: allSittersLoading } = useAllSitters(shouldFetchAllSitters);

  // Transform local sitters to match SitterCard format
  const localSitters = localSittersRaw.map(sitter => ({
    id: sitter.id,
    name: sitter.name,
    image: sitter.profile_image_url || "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=2487&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    rating: sitter.rating ? Number(sitter.rating) : 0,
    experience: sitter.experience,
    friendRecommendationCount: 0,
    workedInUserLocationNickname: selectedUserHomeDetails?.location_nickname
  }));

  // Transform friend recommended sitters
  const friendRecommendedSitters = friendRecommendedSittersRaw.map(sitter => ({
    id: sitter.id,
    name: sitter.name,
    image: sitter.image,
    rating: sitter.rating,
    experience: sitter.experience,
    friendRecommendationCount: 1,
    recommendedBy: sitter.recommendedBy
  }));

  // Transform all sitters
  const allSitters = allSittersRaw.map(sitter => ({
    id: sitter.id,
    name: sitter.name,
    image: sitter.profile_image_url || "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=2487&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    rating: sitter.rating ? Number(sitter.rating) : 0,
    experience: sitter.experience,
    friendRecommendationCount: 0
  }));

  // Determine which sitters to display based on filters
  const getDisplayedSitters = () => {
    let sittersToShow: Sitter[] = [];

    // Priority 1: Local sitters when local scope is active
    if (shouldFetchLocalSitters && localSitters.length > 0) {
      sittersToShow = localSitters;
    } 
    // Priority 2: Friend recommended sitters when that filter is on
    else if (friendRecommendedOnly) {
      sittersToShow = friendRecommendedSitters;
    } 
    // Priority 3: All sitters as default fallback
    else {
      sittersToShow = allSitters;
    }

    // Apply search term filter
    if (searchTerm) {
      sittersToShow = sittersToShow.filter(sitter => 
        sitter.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return sittersToShow;
  };

  const displayedSitters = getDisplayedSitters();

  // Determine if we're currently loading
  const isLoading = locationsLoading || 
    (shouldFetchLocalSitters && localSittersLoading) || 
    (shouldFetchAllSitters && allSittersLoading);

  return {
    userLocations,
    locationsLoading,
    selectedUserHomeDetails,
    localSittersLoading: isLoading,
    shouldFetchLocalSitters,
    displayedSitters
  };
};
