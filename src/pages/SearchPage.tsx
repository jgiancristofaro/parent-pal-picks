
import { useState } from "react";
import { Header } from "@/components/Header";
import { BottomNavigation } from "@/components/BottomNavigation";
import { Button } from "@/components/ui/button";
import { Search, Plus } from "lucide-react";
import { Link } from "react-router-dom";
import { OmniSearchInput } from "@/components/search/OmniSearchInput";
import { OmniSearchResults } from "@/components/search/OmniSearchResults";
import { useOmniSearch } from "@/hooks/useOmniSearch";

const SearchPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [omniSearchTerm, setOmniSearchTerm] = useState("");
  const [showResults, setShowResults] = useState(false);

  // Omni search hook
  const { results: omniResults, isLoading: isOmniSearching } = useOmniSearch(omniSearchTerm);

  const handleOmniSearch = () => {
    setOmniSearchTerm(searchQuery);
    setShowResults(true);
  };

  const handleOmniKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleOmniSearch();
    }
  };

  const resetSearch = () => {
    setSearchQuery("");
    setOmniSearchTerm("");
    setShowResults(false);
  };

  return (
    <div className="min-h-screen pb-20 bg-gray-50">
      <Header 
        title="Search Hub"
        showBack={false}
      />
      
      <div className="px-4 py-6">
        {/* Omni Search Input */}
        <div className="mb-6">
          <OmniSearchInput
            searchTerm={searchQuery}
            onSearchTermChange={setSearchQuery}
            onKeyPress={handleOmniKeyPress}
            isLoading={isOmniSearching}
            placeholder="Search parents, sitters, and products..."
          />
          {!showResults && (
            <Button 
              onClick={handleOmniSearch} 
              disabled={!searchQuery.trim()} 
              className="w-full mt-4"
            >
              <Search className="w-4 h-4 mr-2" />
              Search All
            </Button>
          )}
        </div>

        {/* Search Results */}
        {showResults && (
          <div className="mb-8">
            <Button onClick={resetSearch} variant="outline" className="mb-4">
              Back to Search
            </Button>
            <OmniSearchResults 
              results={omniResults} 
              isLoading={isOmniSearching} 
              searchTerm={omniSearchTerm} 
            />
          </div>
        )}

        {/* Quick Actions */}
        {!showResults && (
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-gray-700 mb-3">Quick Actions</h4>
            <Link to="/find-sitter" className="block">
              <Button variant="outline" className="w-full justify-start">
                <Search className="w-4 h-4 mr-2" />
                Browse All Sitters
              </Button>
            </Link>
            <Link to="/shop" className="block">
              <Button variant="outline" className="w-full justify-start">
                <Search className="w-4 h-4 mr-2" />
                Browse All Products
              </Button>
            </Link>
            <Link to="/find-parents" className="block">
              <Button variant="outline" className="w-full justify-start">
                <Search className="w-4 h-4 mr-2" />
                Find Parents Near Me
              </Button>
            </Link>
            <Link to="/add-review" state={{ createNew: true, selectedType: 'product' }}>
              <Button variant="outline" className="w-full justify-start">
                <Plus className="w-4 h-4 mr-2" />
                Add a Product Review
              </Button>
            </Link>
          </div>
        )}
      </div>
      
      <BottomNavigation />
    </div>
  );
};

export default SearchPage;
