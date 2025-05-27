
import { SitterCard } from "@/components/SitterCard";
import { useHyperLocalSitters } from "@/hooks/useHyperLocalSitters";

interface HyperLocalSittersProps {
  currentUserId: string | undefined;
  selectedLocationId: string | undefined;
  locationNickname: string;
}

export const HyperLocalSitters = ({ 
  currentUserId, 
  selectedLocationId, 
  locationNickname 
}: HyperLocalSittersProps) => {
  const { data: hyperLocalSitters, isLoading, error } = useHyperLocalSitters(
    currentUserId, 
    selectedLocationId
  );

  if (isLoading) {
    return (
      <div className="mt-6">
        <h2 className="text-xl font-semibold mb-4">
          Sitters Recommended for {locationNickname}
        </h2>
        <div className="text-center py-8">
          <p className="text-gray-500">Loading hyper-local recommendations...</p>
        </div>
      </div>
    );
  }

  if (error) {
    console.error('Error loading hyper-local sitters:', error);
    return (
      <div className="mt-6">
        <h2 className="text-xl font-semibold mb-4">
          Sitters Recommended for {locationNickname}
        </h2>
        <div className="text-center py-8">
          <p className="text-red-500">Error loading recommendations</p>
        </div>
      </div>
    );
  }

  if (!hyperLocalSitters || hyperLocalSitters.length === 0) {
    return (
      <div className="mt-6">
        <h2 className="text-xl font-semibold mb-4">
          Sitters Recommended for {locationNickname}
        </h2>
        <div className="text-center py-8">
          <p className="text-gray-500">No local recommendations found yet.</p>
          <p className="text-gray-400 text-sm mt-2">
            Reviews from neighbors in your building will appear here.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-6">
      <h2 className="text-xl font-semibold mb-4">
        Sitters Recommended for {locationNickname} ({hyperLocalSitters.length} found)
      </h2>
      <div className="grid grid-cols-2 gap-4">
        {hyperLocalSitters.map((sitter) => (
          <SitterCard
            key={sitter.id}
            id={sitter.id}
            name={sitter.name}
            image={sitter.profile_image_url || "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=2487&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"}
            rating={sitter.rating || 0}
            experience={sitter.experience || "Experience not specified"}
            recommendedBy="Your neighbors"
            friendRecommendationCount={0}
          />
        ))}
      </div>
    </div>
  );
};
