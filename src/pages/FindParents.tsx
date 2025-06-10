
import { Header } from "@/components/Header";
import { BottomNavigation } from "@/components/BottomNavigation";
import { OmniSearchInput } from "@/components/search/OmniSearchInput";
import { SuggestedParentsSection } from "@/components/search/SuggestedParentsSection";
import { SearchResultsSection } from "@/components/search/SearchResultsSection";
import { useParentSearch } from "@/hooks/useParentSearch";

const FindParents = () => {
  const {
    searchTerm,
    setSearchTerm,
    results,
    isLoading,
    handleKeyPress,
    refreshResults,
    isSearchActive
  } = useParentSearch();

  const handleFollowStatusChange = () => {
    refreshResults();
  };

  return (
    <div className="min-h-screen pb-20 bg-gray-50">
      <Header title="Find Parents" showBack={true} showSettings={false} />
      
      <div className="px-4 py-6">
        <OmniSearchInput
          searchTerm={searchTerm}
          onSearchTermChange={setSearchTerm}
          onKeyPress={handleKeyPress}
          isLoading={isLoading}
        />

        {/* Show suggestions when not actively searching */}
        {!isSearchActive && (
          <SuggestedParentsSection 
            suggestions={results}
            isLoading={isLoading}
            onFollowStatusChange={handleFollowStatusChange} 
          />
        )}

        {/* Show search results when actively searching */}
        {isSearchActive && (
          <SearchResultsSection
            searchResults={results}
            searchTerm={searchTerm}
            isLoading={isLoading}
            onFollowStatusChange={handleFollowStatusChange}
          />
        )}
      </div>
      
      <BottomNavigation />
    </div>
  );
};

export default FindParents;
