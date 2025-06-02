
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SitterCard } from "@/components/SitterCard";

interface Sitter {
  id: string;
  name: string;
  image: string;
  rating: number;
  experience: string;
  recommendedBy: string;
  friendRecommendationCount: number;
}

interface RecommendationsTabsProps {
  recommendedSitters: Sitter[];
}

export const RecommendationsTabs = ({ recommendedSitters }: RecommendationsTabsProps) => {
  return (
    <div className="mt-6 px-4">
      <h2 className="text-2xl font-bold mb-4">Recommendations</h2>
      <Tabs defaultValue="babysitters">
        <TabsList className="grid grid-cols-2 mb-6">
          <TabsTrigger value="babysitters" className="text-base">Babysitters</TabsTrigger>
          <TabsTrigger value="products" className="text-base">Products</TabsTrigger>
        </TabsList>
        <TabsContent value="babysitters" className="space-y-4">
          {recommendedSitters.map((sitter) => (
            <SitterCard
              key={sitter.id}
              id={sitter.id}
              name={sitter.name}
              image={sitter.image}
              rating={sitter.rating}
              experience={sitter.experience}
              recommendedBy={sitter.recommendedBy}
              friendRecommendationCount={sitter.friendRecommendationCount}
            />
          ))}
        </TabsContent>
        <TabsContent value="products">
          <div className="bg-white rounded-lg p-8 text-center">
            <p className="text-gray-500">No product recommendations yet.</p>
            <Button className="mt-4 bg-purple-500 hover:bg-purple-600">
              Browse Products
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
