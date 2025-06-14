
import { Link } from "react-router-dom";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowRight, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SitterCard } from "@/components/SitterCard";
import { useNewlyRecommendedSitters } from "@/hooks/useNewlyRecommendedSitters";

interface NewRecommendedSittersProps {
  currentUserId?: string;
}

export const NewRecommendedSitters = ({ currentUserId }: NewRecommendedSittersProps) => {
  const { data: newlyRecommendedSitters = [], isLoading, error } = useNewlyRecommendedSitters(
    currentUserId,
    5 // Limit to 5 recommendations for the preview
  );

  const LoadingSkeleton = () => (
    <div className="mx-4 bg-white rounded-xl shadow-sm p-4 border border-gray-100">
      <div className="flex space-x-3">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="flex-none w-40">
            <div className="space-y-2">
              <Skeleton className="h-32 w-full rounded-lg" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-3 w-20" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const ErrorState = () => (
    <div className="mx-4 bg-white rounded-xl shadow-sm p-8 text-center border border-gray-100">
      <AlertCircle className="w-8 h-8 text-gray-400 mx-auto mb-3" />
      <p className="text-gray-600 mb-4">Unable to load recommendations right now.</p>
      <Button variant="outline" size="sm" onClick={() => window.location.reload()}>
        Try Again
      </Button>
    </div>
  );

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

      {isLoading && <LoadingSkeleton />}

      {error && <ErrorState />}

      {!isLoading && !error && newlyRecommendedSitters.length === 0 && (
        <div className="mx-4 bg-white rounded-xl shadow-sm p-8 text-center border border-gray-100">
          <p className="text-gray-600">No new sitter recommendations yet.</p>
        </div>
      )}

      {!isLoading && !error && newlyRecommendedSitters.length > 0 && (
        <ScrollArea className="w-full whitespace-nowrap no-scrollbar">
          <div className="flex w-max space-x-3 px-4">
            {newlyRecommendedSitters.map((sitter) => (
              <div key={`${sitter.sitter_id}-${sitter.recommender_user_id}`} className="flex-none w-40">
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
