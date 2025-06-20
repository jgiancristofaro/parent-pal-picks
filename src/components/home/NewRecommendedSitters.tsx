
import { Link } from "react-router-dom";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { ArrowRight } from "lucide-react";
import { SitterCard } from "@/components/SitterCard";
import { useNewSitterRecommendations } from "@/hooks/useNewSitterRecommendations";

interface NewRecommendedSittersProps {
  currentUserId?: string;
}

export const NewRecommendedSitters = ({ currentUserId }: NewRecommendedSittersProps) => {
  const { data: newlyRecommendedSitters = [], isLoading, error } = useNewSitterRecommendations(
    currentUserId,
    5 // Limit to 5 recommendations for the preview
  );

  if (isLoading) {
    return (
      <div className="mb-4">
        <div className="flex justify-between items-center px-4 mb-2">
          <h2 className="text-xl font-bold">New Sitters for You</h2>
        </div>
        <div className="mx-4 bg-white rounded-xl shadow-sm p-8 text-center border border-gray-100">
          <p className="text-gray-600">Loading new sitter recommendations...</p>
        </div>
      </div>
    );
  }

  if (error) {
    console.error('Error loading newly recommended sitters:', error);
    return (
      <div className="mb-4">
        <div className="flex justify-between items-center px-4 mb-2">
          <h2 className="text-xl font-bold">New Sitters for You</h2>
        </div>
        <div className="mx-4 bg-white rounded-xl shadow-sm p-8 text-center border border-gray-100">
          <p className="text-gray-600">Unable to load recommendations right now.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mb-4">
      <div className="flex justify-between items-center px-4 mb-2">
        <h2 className="text-xl font-bold">New Sitters for You</h2>
        {newlyRecommendedSitters.length > 0 && (
          <Link to="/newly-recommended-sitters" className="flex items-center text-purple-500 text-sm font-medium hover:text-purple-600">
            View All
            <ArrowRight className="w-4 h-4 ml-1" />
          </Link>
        )}
      </div>

      {newlyRecommendedSitters.length === 0 ? (
        <div className="mx-4 bg-white rounded-xl shadow-sm p-8 text-center border border-gray-100">
          <p className="text-gray-600">No new sitter recommendations yet.</p>
        </div>
      ) : (
        <ScrollArea className="w-full whitespace-nowrap no-scrollbar">
          <div className="flex w-max space-x-3 px-4 pb-2">
            {newlyRecommendedSitters.map((sitter) => (
              <div key={`${sitter.sitter_id}-${sitter.recommender_user_id}`} className="flex-none w-48">
                <SitterCard
                  id={sitter.sitter_id}
                  name={sitter.sitter_name}
                  image={sitter.sitter_profile_image_url || '/placeholder.svg'}
                  rating={sitter.sitter_rating || 0}
                  recommendedBy={sitter.recommender_full_name}
                  friendRecommendationCount={1}
                />
              </div>
            ))}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      )}
    </div>
  );
};
