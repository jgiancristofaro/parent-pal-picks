
import { SearchPageContent } from "@/components/search/SearchPageContent";

interface EntitySearchPageProps {
  type: 'sitter' | 'product';
  mode: 'discovery' | 'review';
  onSitterSelect?: (sitter: any) => void;
  onProductSelect?: (product: any) => void;
  onCreateNew?: () => void;
}

const EntitySearchPage = ({ 
  type, 
  mode, 
  onSitterSelect, 
  onProductSelect, 
  onCreateNew 
}: EntitySearchPageProps) => {
  return (
    <SearchPageContent 
      type={type}
      mode={mode}
      onSitterSelect={onSitterSelect}
      onProductSelect={onProductSelect}
      onCreateNew={onCreateNew}
    />
  );
};

export default EntitySearchPage;
