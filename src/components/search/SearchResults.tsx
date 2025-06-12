
import React from 'react';
import { Button } from "@/components/ui/button";

interface SearchResultsProps {
  results: any[];
  searchType: 'sitter' | 'product' | 'parent';
  loading: boolean;
  hasMore: boolean;
  onLoadMore: () => void;
  searchQuery: string;
  onClearSearch: () => void;
}

export const SearchResults = ({ 
  results, 
  searchType, 
  loading, 
  hasMore, 
  onLoadMore, 
  searchQuery, 
  onClearSearch 
}: SearchResultsProps) => {
  if (loading) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">Searching...</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">
          Search Results ({results.length} found)
        </h2>
        {searchQuery && (
          <Button variant="outline" onClick={onClearSearch}>
            Clear Search
          </Button>
        )}
      </div>

      {results.length > 0 ? (
        <div className="space-y-4">
          {results.map((result) => (
            <div key={result.id} className="p-4 bg-white rounded-lg border border-gray-200">
              <h3 className="font-medium">{result.full_name || result.name}</h3>
              {result.username && <p className="text-sm text-gray-600">@{result.username}</p>}
            </div>
          ))}
          
          {hasMore && (
            <div className="text-center">
              <Button onClick={onLoadMore} disabled={loading}>
                Load More
              </Button>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-8">
          <p className="text-gray-600">No results found</p>
        </div>
      )}
    </div>
  );
};
