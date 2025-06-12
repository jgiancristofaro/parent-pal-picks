
import React from 'react';
import { Button } from "@/components/ui/button";

interface NoResultsMessageProps {
  searchQuery?: string;
  searchType?: 'sitter' | 'product' | 'parent';
  onClearSearch?: () => void;
  type?: string;
  mode?: 'discovery' | 'review';
  onCreateNew?: () => void;
}

export const NoResultsMessage = ({ 
  searchQuery, 
  searchType, 
  onClearSearch,
  type,
  mode,
  onCreateNew 
}: NoResultsMessageProps) => {
  // Support both interface patterns for backward compatibility
  const displayType = type || searchType;
  const displayQuery = searchQuery;
  const clearAction = onClearSearch;
  const createAction = onCreateNew;

  return (
    <div className="text-center py-8">
      {displayQuery ? (
        <p className="text-gray-600 mb-4">
          No {displayType}s found for "{displayQuery}"
        </p>
      ) : (
        <p className="text-gray-600 mb-4">
          No {displayType}s found
        </p>
      )}
      
      <div className="space-y-2">
        {clearAction && (
          <Button variant="outline" onClick={clearAction}>
            Clear Search
          </Button>
        )}
        
        {createAction && mode === 'review' && (
          <Button onClick={createAction}>
            Create New {displayType}
          </Button>
        )}
      </div>
    </div>
  );
};
