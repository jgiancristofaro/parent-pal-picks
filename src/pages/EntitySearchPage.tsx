
import SearchPageContent from "@/components/search/SearchPageContent";

interface EntitySearchPageProps {
  type: 'sitter' | 'product';
  mode: 'discovery' | 'review';
}

const EntitySearchPage = ({ type, mode }: EntitySearchPageProps) => {
  return (
    <SearchPageContent 
      searchType={type}
      mode={mode}
    />
  );
};

export default EntitySearchPage;
