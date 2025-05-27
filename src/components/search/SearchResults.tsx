
import { SitterCard } from "@/components/SitterCard";

interface SearchResultsProps {
  searchResults: any[];
  hasSearched: boolean;
  friendRecommendedOnly: boolean;
}

export const SearchResults = ({ searchResults, hasSearched, friendRecommendedOnly }: SearchResultsProps) => {
  if (!hasSearched) return null;

  return (
    <div className="mt-6">
      <h2 className="text-xl font-semibold mb-4">
        {friendRecommendedOnly ? (
          <>Friend-Recommended Sitters ({searchResults.length} found)</>
        ) : (
          <>Search Results ({searchResults.length} sitters found)</>
        )}
      </h2>
      {searchResults.length > 0 ? (
        <div>
          {searchResults.map((sitter) => (
            <SitterCard
              key={sitter.id}
              id={sitter.id}
              name={sitter.name}
              image={sitter.image}
              rating={sitter.rating}
              experience={sitter.experience}
              recommendedBy={sitter.recommendedBy}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          {friendRecommendedOnly ? (
            <>
              <p className="text-gray-500">No friend-recommended sitters found.</p>
              <p className="text-gray-400 text-sm mt-2">
                Try following more friends or search without the filter.
              </p>
            </>
          ) : (
            <>
              <p className="text-gray-500">No sitters found matching your criteria.</p>
              <p className="text-gray-400 text-sm mt-2">Try adjusting your filters.</p>
            </>
          )}
        </div>
      )}
    </div>
  );
};
