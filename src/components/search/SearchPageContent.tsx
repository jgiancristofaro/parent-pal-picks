
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SearchInput } from './SearchInput';
import { SearchResults } from './SearchResults';
import { NoResultsMessage } from './NoResultsMessage';
import { SuggestedProfilesSection } from './SuggestedProfilesSection';
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

  const searchFilters = useSearchFilters();

  const unifiedSearch = useUnifiedSearch();

  useEffect(() => {
    if (searchQuery.length > 0) {
      unifiedSearch.setSearchTerm(searchQuery);
      unifiedSearch.handleSearch();
    }
  }, [searchQuery]);

  const handleSearchInput = (query: string) => {
    setSearchQuery(query);
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    unifiedSearch.setSearchTerm('');
  };

  const showResults = searchQuery.length > 0;
  const showNoResults = showResults && unifiedSearch.searchResults.length === 0 && !unifiedSearch.isSearching;
  const showSuggestions = !showResults && searchType === 'parent';

  return (
    <div className="space-y-6">
      <SearchInput
        searchType={searchType}
        onSearch={handleSearchInput}
        initialValue={searchQuery}
        placeholder={
          searchType === 'sitter'
            ? 'Search for babysitters...'
            : searchType === 'product'
            ? 'Search for products...'
            : 'Search for parents...'
        }
      />

      {showResults && (
        <SearchResults
          results={unifiedSearch.searchResults}
          searchType={searchType}
          loading={unifiedSearch.isSearching}
          hasMore={false}
          onLoadMore={() => {}}
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
