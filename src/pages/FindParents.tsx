
import { Header } from "@/components/Header";
import { BottomNavigation } from "@/components/BottomNavigation";
import { UnifiedSearchCard } from "@/components/search/UnifiedSearchCard";
import { UnifiedSearchResults } from "@/components/search/UnifiedSearchResults";
import { SuggestedProfilesSection } from "@/components/search/SuggestedProfilesSection";
import { useUnifiedSearch } from "@/hooks/useUnifiedSearch";

const FindParents = () => {
  const {
    searchTerm,
    setSearchTerm,
    searchResults,
    isSearching,
    handleSearch,
    handleKeyPress,
    refreshResults
  } = useUnifiedSearch();

  const handleFollowStatusChange = () => {
    refreshResults();
  };

  return (
    <div className="min-h-screen pb-20 bg-gray-50">
      <Header title="Find Parents" showBack={true} showSettings={false} backTo="/search" />
      
      <div className="px-4 py-6">
        <UnifiedSearchCard
          searchTerm={searchTerm}
          onSearchTermChange={setSearchTerm}
          onSearch={handleSearch}
          onKeyPress={handleKeyPress}
          isSearching={isSearching}
        />

        {/* Show suggestions when not searching */}
        {!searchTerm && (
          <SuggestedProfilesSection onFollowStatusChange={handleFollowStatusChange} />
        )}

        {/* Show search results when searching */}
        <UnifiedSearchResults
          searchResults={searchResults}
          searchTerm={searchTerm}
          isSearching={isSearching}
          onFollowStatusChange={handleFollowStatusChange}
        />
      </div>
      
      <BottomNavigation />
    </div>
  );
};

export default FindParents;
