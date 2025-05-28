
import { useQuery } from "@tanstack/react-query";

interface MockLocalSitter {
  id: string;
  name: string;
  profile_image_url: string;
  rating: number;
  experience: string;
}

export const useMockLocalSitters = (
  currentUserId: string | undefined, 
  selectedLocationId: string | undefined,
  searchScope: 'BUILDING' | 'AREA_ZIP' = 'BUILDING',
  enabled: boolean = true
) => {
  return useQuery({
    queryKey: ['mock-local-sitters', currentUserId, selectedLocationId, searchScope],
    queryFn: async () => {
      if (!currentUserId || !selectedLocationId) return [];

      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 800));

      // Different sitters based on location and scope
      const mockSittersByLocation: Record<string, Record<string, MockLocalSitter[]>> = {
        "mock-home-1": { // Downtown Apartment (The Metropolitan)
          "BUILDING": [
            {
              id: "building-sitter-1",
              name: "Maria Santos",
              profile_image_url: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=2487&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
              rating: 4.9,
              experience: "Lives in 12A, 4 years experience"
            },
            {
              id: "building-sitter-2", 
              name: "Jennifer Kim",
              profile_image_url: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
              rating: 4.8,
              experience: "Lives in 8C, 6 years experience"
            },
            {
              id: "building-sitter-3",
              name: "Alex Rodriguez",
              profile_image_url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=2487&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
              rating: 4.7,
              experience: "Lives in 21D, 3 years experience"
            }
          ],
          "AREA_ZIP": [
            {
              id: "area-sitter-1",
              name: "Sarah Chen", 
              profile_image_url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=2564&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
              rating: 4.6,
              experience: "10001 area, 5 years experience"
            },
            {
              id: "area-sitter-2",
              name: "David Park",
              profile_image_url: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=2487&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
              rating: 4.5,
              experience: "10001 area, 2 years experience"
            }
          ]
        },
        "mock-home-2": { // Weekend House (Nyack)
          "AREA_ZIP": [
            {
              id: "nyack-sitter-1",
              name: "Lisa Thompson",
              profile_image_url: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=2488&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
              rating: 4.8,
              experience: "Nyack resident, 7 years experience"
            },
            {
              id: "nyack-sitter-2",
              name: "Michael Johnson",
              profile_image_url: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=2487&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
              rating: 4.7,
              experience: "Nyack area, 4 years experience"
            }
          ]
        },
        "mock-home-3": { // Mom's Place (Townhouse)
          "AREA_ZIP": [
            {
              id: "midtown-sitter-1",
              name: "Rachel Williams",
              profile_image_url: "https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?q=80&w=2487&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
              rating: 4.9,
              experience: "Midtown East, 5 years experience"
            }
          ]
        }
      };

      const locationSitters = mockSittersByLocation[selectedLocationId];
      if (!locationSitters) return [];

      const scopeSitters = locationSitters[searchScope];
      return scopeSitters || [];
    },
    enabled: enabled && !!currentUserId && !!selectedLocationId,
  });
};
