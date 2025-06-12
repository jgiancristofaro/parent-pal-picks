
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

  const {
    searchTerm,
    setSearchTerm,
    friendRecommendedOnly,
    setFriendRecommendedOnly,
    selectedUserHomeId,
    setSelectedUserHomeId,
    localSearchScope,
    setLocalSearchScope
  } = useSearchFilters();

  const {
    searchTerm: unifiedSearchTerm,
    setSearchTerm: setUnifiedSearchTerm,
    searchResults,
    isSearching,
    handleSearch,
    handleKeyPress,
    refreshResults
  } = useUnifiedSearch();

  useEffect(() => {
    if (searchQuery.length > 0) {
      setUnifiedSearchTerm(searchQuery);
      handleSearch();
    }
  }, [searchQuery, setUnifiedSearchTerm, handleSearch]);

  const handleSearchInput = (query: string) => {
    setSearchQuery(query);
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    setUnifiedSearchTerm('');
  };

  const showResults = searchQuery.length > 0;
  const showNoResults = showResults && searchResults.length === 0 && !isSearching;
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
          results={searchResults}
          searchType={searchType}
          loading={isSearching}
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
