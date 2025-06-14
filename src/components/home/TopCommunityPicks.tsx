
import { Link } from "react-router-dom";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { ArrowRight } from "lucide-react";
import { ProductCard } from "@/components/ProductCard";
import { useTopCommunityPicks } from "@/hooks/useTopCommunityPicks";

export const TopCommunityPicks = () => {
  const { data: topPicks = [], isLoading, error } = useTopCommunityPicks();

  if (isLoading) {
    return (
      <div className="mb-4">
        <div className="flex justify-between items-center px-4 mb-2">
          <h2 className="text-xl font-bold">Top Community Picks</h2>
        </div>
        <div className="mx-4 bg-white rounded-xl shadow-sm p-8 text-center border border-gray-100">
          <p className="text-gray-600">Loading top community picks...</p>
        </div>
      </div>
    );
  }

  if (error) {
    console.error('Error loading top community picks:', error);
    return (
      <div className="mb-4">
        <div className="flex justify-between items-center px-4 mb-2">
          <h2 className="text-xl font-bold">Top Community Picks</h2>
        </div>
        <div className="mx-4 bg-white rounded-xl shadow-sm p-8 text-center border border-gray-100">
          <p className="text-gray-600">Unable to load community picks right now.</p>
        </div>
      </div>
    );
  }

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

      {topPicks.length === 0 ? (
        <div className="mx-4 bg-white rounded-xl shadow-sm p-8 text-center border border-gray-100">
          <p className="text-gray-600">No community picks available yet.</p>
        </div>
      ) : (
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
