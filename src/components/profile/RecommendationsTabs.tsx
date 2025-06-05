
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SitterCard } from "@/components/SitterCard";
import { ProductCard } from "@/components/ProductCard";

interface UserRecommendation {
  id: string;
  name: string;
  profile_image_url?: string;
  image_url?: string;
  rating?: number;
  experience?: string;
  bio?: string;
  hourly_rate?: number;
  category?: string;
  brand_name?: string;
  average_rating?: number;
  profile_owner_review: {
    rating: number;
    review_text_snippet: string;
  };
}

interface RecommendationsTabsProps {
  sitterRecommendations: UserRecommendation[];
  productRecommendations: UserRecommendation[];
}

export const RecommendationsTabs = ({ sitterRecommendations, productRecommendations }: RecommendationsTabsProps) => {
  return (
    <div className="mt-6 px-4">
      <h2 className="text-2xl font-bold mb-4">My Recommendations</h2>
      <Tabs defaultValue="babysitters">
        <TabsList className="grid grid-cols-2 mb-6">
          <TabsTrigger value="babysitters" className="text-base">Babysitters</TabsTrigger>
          <TabsTrigger value="products" className="text-base">Products</TabsTrigger>
        </TabsList>
        <TabsContent value="babysitters" className="space-y-4">
          {sitterRecommendations.length === 0 ? (
            <div className="bg-white rounded-lg p-8 text-center">
              <p className="text-gray-500">No sitter recommendations yet.</p>
              <Button className="mt-4 bg-purple-500 hover:bg-purple-600">
                Find Sitters
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              {sitterRecommendations.map((sitter) => (
                <SitterCard
                  key={sitter.id}
                  id={sitter.id}
                  name={sitter.name}
                  image={sitter.profile_image_url || ""}
                  rating={sitter.rating || 0}
                  experience={sitter.experience || ""}
                  recommendedBy=""
                  friendRecommendationCount={0}
                  userSpecificRating={sitter.profile_owner_review.rating}
                  reviewSnippet={sitter.profile_owner_review.review_text_snippet}
                />
              ))}
            </div>
          )}
        </TabsContent>
        <TabsContent value="products">
          {productRecommendations.length === 0 ? (
            <div className="bg-white rounded-lg p-8 text-center">
              <p className="text-gray-500">No product recommendations yet.</p>
              <Button className="mt-4 bg-purple-500 hover:bg-purple-600">
                Browse Products
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              {productRecommendations.map((product) => (
                <ProductCard
                  key={product.id}
                  id={product.id}
                  name={product.name}
                  image={product.image_url || ""}
                  category={product.category || ""}
                  rating={product.average_rating || 0}
                  uniqueRecommenderCount={1}
                  userSpecificRating={product.profile_owner_review.rating}
                  reviewSnippet={product.profile_owner_review.review_text_snippet}
                />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};
