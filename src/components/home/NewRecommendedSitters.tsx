
import { Link } from "react-router-dom";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { ArrowRight } from "lucide-react";
import { SitterCard } from "@/components/SitterCard";

interface NewlyRecommendedSitter {
  id: string;
  name: string;
  image: string;
  rating: number;
  experience: string;
  recommendedBy: string;
  recommendationDate: string;
}

interface NewRecommendedSittersProps {
  newlyRecommendedSitters: NewlyRecommendedSitter[];
}

export const NewRecommendedSitters = ({ newlyRecommendedSitters }: NewRecommendedSittersProps) => {
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
          <div className="flex w-max space-x-4 px-4">
            {newlyRecommendedSitters.map((sitter) => (
              <div key={sitter.id} className="flex-none w-48">
                <SitterCard
                  id={sitter.id}
                  name={sitter.name}
                  image={sitter.image}
                  rating={sitter.rating}
                  experience={sitter.experience}
                  recommendedBy={sitter.recommendedBy}
                  friendRecommendationCount={0}
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
