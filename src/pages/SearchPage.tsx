import { useState } from "react";
import { Header } from "@/components/Header";
import { BottomNavigation } from "@/components/BottomNavigation";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { Link } from "react-router-dom";
import { OmniSearchInput } from "@/components/search/OmniSearchInput";
import { OmniSearchResults } from "@/components/search/OmniSearchResults";
import { useOmniSearch } from "@/hooks/useOmniSearch";

const SearchPage = () => {
  const [searchQuery, setSearchQuery] = useState("");

  // Omni search hook - now directly using searchQuery for real-time search
  const { results: omniResults, isLoading: isOmniSearching } = useOmniSearch(searchQuery);

  const handleOmniKeyPress = (e: React.KeyboardEvent) => {
    // Keep the Enter key handling for accessibility, but it's not required for search anymore
    if (e.key === 'Enter') {
      // Search is already happening in real-time, no additional action needed
    }
  };

  // Show results when there are results or when actively loading with a search term
  const showResults = omniResults.length > 0 || (isOmniSearching && searchQuery.trim());

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
        </div>

        {/* Search Results - shown in real-time when available */}
        {showResults && (
          <div className="mb-8">
            <OmniSearchResults 
              results={omniResults} 
              isLoading={isOmniSearching} 
              searchTerm={searchQuery} 
            />
          </div>
        )}

        {/* Quick Actions - shown when no search term is entered */}
        {!searchQuery.trim() && (
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
          </div>
        )}
      </div>
      
      <BottomNavigation />
    </div>
  );
};

export default SearchPage;
