
import { Link } from "react-router-dom";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowRight, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/ProductCard";
import { useTopCommunityPicks } from "@/hooks/useTopCommunityPicks";

export const TopCommunityPicks = () => {
  const { data: topPicks = [], isLoading, error } = useTopCommunityPicks();

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
      <p className="text-gray-600 mb-4">Unable to load community picks right now.</p>
      <Button variant="outline" size="sm" onClick={() => window.location.reload()}>
        Try Again
      </Button>
    </div>
  );

  return (
    <div className="mb-4">
      <div className="flex justify-between items-center px-4 mb-2">
        <h2 className="text-xl font-bold">Top Community Picks</h2>
        {topPicks.length > 5 && (
          <Link to="/community-picks" className="flex items-center text-purple-500 text-sm font-medium hover:text-purple-600">
            View All
            <ArrowRight className="w-4 h-4 ml-1" />
          </Link>
        )}
      </div>

      {isLoading && <LoadingSkeleton />}

      {error && <ErrorState />}

      {!isLoading && !error && topPicks.length === 0 && (
        <div className="mx-4 bg-white rounded-xl shadow-sm p-8 text-center border border-gray-100">
          <p className="text-gray-600">No community picks available yet.</p>
        </div>
      )}

      {!isLoading && !error && topPicks.length > 0 && (
        <ScrollArea className="w-full whitespace-nowrap no-scrollbar">
          <div className="flex w-max space-x-3 px-4">
            {topPicks.slice(0, 5).map((pick) => (
              <div key={pick.product_id} className="flex-none w-40">
                <ProductCard
                  id={pick.product_id}
                  name={pick.product_name}
                  image={pick.product_image_url}
                  category={pick.product_category}
                  rating={pick.average_rating ? Number(pick.average_rating) : undefined}
                  friendRecommendationCount={Number(pick.unique_recommender_count)}
                  textColorClass="text-gray-600"
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
