
import React from 'react';
import { Button } from "@/components/ui/button";

interface NoResultsMessageProps {
  searchQuery: string;
  searchType: 'sitter' | 'product' | 'parent';
  onClearSearch: () => void;
}

export const NoResultsMessage = ({ searchQuery, searchType, onClearSearch }: NoResultsMessageProps) => {
  return (
    <div className="text-center py-8">
      <p className="text-gray-600 mb-4">
        No {searchType}s found for "{searchQuery}"
      </p>
      <Button variant="outline" onClick={onClearSearch}>
        Clear Search
      </Button>
    </div>
  );
};
