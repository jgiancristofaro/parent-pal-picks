
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import SearchInput from './SearchInput';
import SearchFilters from './SearchFilters';
import SearchResults from './SearchResults';
import NoResultsMessage from './NoResultsMessage';
import SuggestedProfilesSection from './SuggestedProfilesSection';
import { useSearchFilters } from '@/hooks/useSearchFilters';
import { useUnifiedSearch } from '@/hooks/useUnifiedSearch';
import { useAuth } from '@/contexts/AuthContext';

interface SearchPageContentProps {
  searchType: 'sitter' | 'product' | 'parent';
  mode: 'discovery' | 'search';
}

const SearchPageContent = ({ searchType, mode }: SearchPageContentProps) => {
  const [searchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const { user } = useAuth();

  const {
    filters,
    updateFilter,
    resetFilters,
    hasActiveFilters
  } = useSearchFilters();

  const {
    results,
    loading,
    error,
    hasMore,
    loadMore,
    search
  } = useUnifiedSearch({
    searchType,
    filters,
    enabled: searchQuery.length > 0 || hasActiveFilters
  });

  useEffect(() => {
    if (searchQuery.length > 0 || hasActiveFilters) {
      search(searchQuery);
    }
  }, [searchQuery, filters, hasActiveFilters, search]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    resetFilters();
  };

  const showResults = searchQuery.length > 0 || hasActiveFilters;
  const showNoResults = showResults && results.length === 0 && !loading;
  const showSuggestions = !showResults && searchType === 'parent';

  return (
    <div className="space-y-6">
      <SearchInput
        searchType={searchType}
        onSearch={handleSearch}
        initialValue={searchQuery}
        placeholder={
          searchType === 'sitter'
            ? 'Search for babysitters...'
            : searchType === 'product'
            ? 'Search for products...'
            : 'Search for parents...'
        }
      />

      <SearchFilters
        searchType={searchType}
        filters={filters}
        onFilterChange={updateFilter}
        onClearFilters={resetFilters}
        hasActiveFilters={hasActiveFilters}
      />

      {error && (
        <div className="text-center py-8">
          <p className="text-red-600">Error: {error}</p>
        </div>
      )}

      {showResults && (
        <SearchResults
          results={results}
          searchType={searchType}
          loading={loading}
          hasMore={hasMore}
          onLoadMore={loadMore}
          searchQuery={searchQuery}
          onClearSearch={handleClearSearch}
        />
      )}

      {showNoResults && (
        <NoResultsMessage
          searchQuery={searchQuery}
          searchType={searchType}
          onClearSearch={handleClearSearch}
        />
      )}

      {showSuggestions && user && (
        <SuggestedProfilesSection />
      )}
    </div>
  );
};

export default SearchPageContent;
