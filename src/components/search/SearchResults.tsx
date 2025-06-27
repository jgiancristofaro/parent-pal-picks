
import { useOmniSearch } from "@/hooks/useOmniSearch";
import { OmniSearchResults } from "@/components/search/OmniSearchResults";

interface SearchResultsProps {
  searchTerm: string;
  hasSearched: boolean;
}

export const SearchResults = ({ searchTerm, hasSearched }: SearchResultsProps) => {
  const { results, isLoading } = useOmniSearch(searchTerm);

  if (!hasSearched && !searchTerm.trim()) {
    return null;
  }

  return (
    <div className="mt-6">
      <OmniSearchResults results={results} isLoading={isLoading} />
    </div>
  );
};
