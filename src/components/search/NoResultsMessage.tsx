
import { Button } from "@/components/ui/button";

interface NoResultsMessageProps {
  type: 'sitter' | 'product';
  mode: 'discovery' | 'review';
  onCreateNew: () => void;
}

export const NoResultsMessage = ({ type, mode, onCreateNew }: NoResultsMessageProps) => {
  if (mode === 'review') {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600 mb-4">
          Can't find what you're looking for?
        </p>
        <Button
          onClick={onCreateNew}
          className="bg-purple-500 hover:bg-purple-600 text-white"
        >
          Create a new {type} profile
        </Button>
      </div>
    );
  }
  
  return (
    <div className="text-center py-8">
      <p className="text-gray-600">No results found</p>
    </div>
  );
};
