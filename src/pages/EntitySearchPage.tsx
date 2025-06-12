
import SearchPageContent from "@/components/search/SearchPageContent";

interface EntitySearchPageProps {
  type: 'sitter' | 'product';
  mode: 'discovery' | 'review';
}

const EntitySearchPage = ({ type, mode }: EntitySearchPageProps) => {
  // Map review mode to search for compatibility with SearchPageContent
  const searchMode = mode === 'review' ? 'search' : mode;

  return (
    <SearchPageContent 
      searchType={type}
      mode={searchMode}
    />
  );
};

export default EntitySearchPage;
