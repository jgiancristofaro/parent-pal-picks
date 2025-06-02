
import { Header } from "@/components/Header";
import { BottomNavigation } from "@/components/BottomNavigation";
import { SearchByNameCard } from "@/components/search/SearchByNameCard";
import { SearchByPhoneCard } from "@/components/search/SearchByPhoneCard";
import { SearchResultsList } from "@/components/search/SearchResultsList";
import { useParentSearch } from "@/hooks/useParentSearch";

const FindParents = () => {
  const {
    searchTerm,
    setSearchTerm,
    phoneNumber,
    setPhoneNumber,
    searchResults,
    isSearching,
    handleNameSearch,
    handlePhoneSearch,
    handleKeyPress,
    refreshResults
  } = useParentSearch();

  return (
    <div className="min-h-screen pb-20 bg-gray-50">
      <Header title="Find Parents" showBack={true} showSettings={false} backTo="/search" />
      
      <div className="px-4 py-6">
        <SearchByNameCard
          searchTerm={searchTerm}
          onSearchTermChange={setSearchTerm}
          onSearch={handleNameSearch}
          onKeyPress={(e) => handleKeyPress(e, 'name')}
          isSearching={isSearching}
        />

        <SearchByPhoneCard
          phoneNumber={phoneNumber}
          onPhoneNumberChange={setPhoneNumber}
          onSearch={handlePhoneSearch}
          onKeyPress={(e) => handleKeyPress(e, 'phone')}
          isSearching={isSearching}
        />

        <SearchResultsList
          searchResults={searchResults}
          searchTerm={searchTerm}
          phoneNumber={phoneNumber}
          isSearching={isSearching}
          onFollowStatusChange={refreshResults}
        />
      </div>
      
      <BottomNavigation />
    </div>
  );
};

export default FindParents;
