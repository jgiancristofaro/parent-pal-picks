
import { ProductCard } from "@/components/ProductCard";
import { Skeleton } from "@/components/ui/skeleton";
import { useTopCommunityPicks } from "@/hooks/useTopCommunityPicks";
import { useTopCommunityPicksMock } from "@/hooks/useTopCommunityPicksMock";

export const TopCommunityPicks = () => {
  // Try real data first, fallback to mock data
  const { data: realPicks, isLoading: realLoading, error: realError } = useTopCommunityPicks();
  const { data: mockPicks, isLoading: mockLoading } = useTopCommunityPicksMock();
  
  // Use real data if available and not empty, otherwise use mock data
  const shouldUseMock = !realPicks || realPicks.length === 0;
  const topPicks = shouldUseMock ? mockPicks : realPicks;
  const isLoading = shouldUseMock ? mockLoading : realLoading;
  const error = shouldUseMock ? null : realError;

  if (error) {
    return (
      <div className="mb-4">
        <div className="flex justify-between items-center px-4 mb-2">
          <h2 className="text-xl font-bold">Top Community Picks</h2>
        </div>
        <div className="px-4">
          <div className="text-center py-8">
            <p className="text-gray-500">Unable to load community picks</p>
            <p className="text-gray-400 text-sm mt-2">Please try again later.</p>
          </div>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="mb-4">
        <div className="flex justify-between items-center px-4 mb-2">
          <h2 className="text-xl font-bold">Top Community Picks</h2>
        </div>
        <div className="grid grid-cols-2 gap-4 px-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="w-full">
              <div className="rounded-xl overflow-hidden bg-white shadow-sm">
                <Skeleton className="aspect-square w-full" />
                <div className="p-3">
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-3 w-2/3 mb-1" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!topPicks || topPicks.length === 0) {
    return (
      <div className="mb-4">
        <div className="flex justify-between items-center px-4 mb-2">
          <h2 className="text-xl font-bold">Top Community Picks</h2>
        </div>
        <div className="px-4">
          <div className="text-center py-8">
            <p className="text-gray-500">No community picks available</p>
            <p className="text-gray-400 text-sm mt-2">Check back later for new recommendations.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mb-4">
      <div className="flex justify-between items-center px-4 mb-2">
        <h2 className="text-xl font-bold">Top Community Picks</h2>
        {shouldUseMock && (
          <span className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded">Demo Data</span>
        )}
      </div>
      <div className="grid grid-cols-2 gap-4 px-4">
        {topPicks.map(pick => (
          <ProductCard
            key={pick.product_id}
            id={pick.product_id}
            name={pick.product_name}
            image={pick.product_image_url || "https://images.unsplash.com/photo-1586685715203-7cfac24d9afa?q=80&w=2487&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"}
            category={pick.product_category}
            rating={pick.average_rating}
            uniqueRecommenderCount={pick.unique_recommender_count}
          />
        ))}
      </div>
    </div>
  );
};
