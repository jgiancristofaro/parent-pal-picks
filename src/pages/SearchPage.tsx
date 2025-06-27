import { useState } from "react";
import { Header } from "@/components/Header";
import { BottomNavigation } from "@/components/BottomNavigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Search, Plus } from "lucide-react";
import { Link } from "react-router-dom";
import EntitySearchPage from "./EntitySearchPage";
import { OmniSearchInput } from "@/components/search/OmniSearchInput";
import { OmniSearchResults } from "@/components/search/OmniSearchResults";
import { useOmniSearch } from "@/hooks/useOmniSearch";

const SearchPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [omniSearchTerm, setOmniSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState<'all' | 'sitters' | 'products' | 'parents'>('all');
  const [showResults, setShowResults] = useState(false);

  // Omni search hook for the "All" tab
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

  const handleSearch = () => {
    if (activeTab === 'all') {
      handleOmniSearch();
    } else if (searchQuery.trim()) {
      setShowResults(true);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const resetSearch = () => {
    setSearchQuery("");
    setOmniSearchTerm("");
    setShowResults(false);
  };

  // For specific tab searches (sitters, products, parents)
  if (showResults && activeTab !== 'all') {
    return (
      <EntitySearchPage 
        type={activeTab === 'parents' ? 'sitter' : activeTab === 'sitters' ? 'sitter' : 'product'}
        mode="discovery"
      />
    );
  }

  return (
    <div className="min-h-screen pb-20 bg-gray-50">
      <Header 
        title="Search Hub"
        showBack={false}
        showSettings={false}
      />
      
      <div className="px-4 py-6">
        {/* Tab Interface */}
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'all' | 'sitters' | 'products' | 'parents')} className="mb-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="sitters">Sitters</TabsTrigger>
            <TabsTrigger value="products">Products</TabsTrigger>
            <TabsTrigger value="parents">Parents</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all" className="mt-6">
            {!showResults ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-100 to-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Search Everything</h3>
                <p className="text-gray-600 mb-6">Find parents, sitters, and products all in one place.</p>
                <div className="max-w-md mx-auto">
                  <Input
                    type="text"
                    placeholder="Search parents, sitters, and products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyPress={handleOmniKeyPress}
                    className="h-12 text-base mb-4"
                  />
                  <Button onClick={handleOmniSearch} disabled={!searchQuery.trim()} className="w-full">
                    Search All
                  </Button>
                </div>
              </div>
            ) : (
              <div>
                <div className="mb-4">
                  <Input
                    type="text"
                    placeholder="Search parents, sitters, and products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyPress={handleOmniKeyPress}
                    className="h-12 text-base mb-4"
                  />
                  <Button onClick={resetSearch} variant="outline" className="mb-4">
                    Back to Search
                  </Button>
                </div>
                <OmniSearchResults results={omniResults} isLoading={isOmniSearching} />
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="sitters" className="mt-6">
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Find Babysitters</h3>
              <p className="text-gray-600 mb-6">Search for trusted babysitters recommended by your parent network.</p>
              <div className="max-w-md mx-auto space-y-4">
                <Input
                  type="text"
                  placeholder="Search for sitters..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="h-12 text-base"
                />
                <Button onClick={handleSearch} disabled={!searchQuery.trim()} className="w-full">
                  Search Sitters
                </Button>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="products" className="mt-6">
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Discover Products</h3>
              <p className="text-gray-600 mb-6">Find baby and parenting products recommended by other parents.</p>
              <div className="max-w-md mx-auto space-y-4">
                <Input
                  type="text"
                  placeholder="Search for products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="h-12 text-base"
                />
                <Button onClick={handleSearch} disabled={!searchQuery.trim()} className="w-full">
                  Search Products
                </Button>
                <Link to="/add-review" state={{ createNew: true, selectedType: 'product' }}>
                  <Button variant="outline" className="w-full">
                    <Plus className="w-4 h-4 mr-2" />
                    Can't find it? Add it now
                  </Button>
                </Link>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="parents" className="mt-6">
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Connect with Parents</h3>
              <p className="text-gray-600 mb-6">Find and connect with other parents in your community.</p>
              <div className="max-w-md mx-auto space-y-4">
                <Input
                  type="text"
                  placeholder="Search for parents..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="h-12 text-base"
                />
                <Button onClick={handleSearch} disabled={!searchQuery.trim()} className="w-full">
                  Search Parents
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {/* Quick Actions */}
        <div className="mt-8 space-y-3">
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
      </div>
      
      <BottomNavigation />
    </div>
  );
};

export default SearchPage;
