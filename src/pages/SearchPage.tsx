
import { useState } from "react";
import { Header } from "@/components/Header";
import { BottomNavigation } from "@/components/BottomNavigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Search, Plus } from "lucide-react";
import { Link } from "react-router-dom";
import EntitySearchPage from "./EntitySearchPage";

const SearchPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<'sitters' | 'products' | 'parents'>('sitters');
  const [showResults, setShowResults] = useState(false);

  const handleSearch = () => {
    if (searchQuery.trim()) {
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
    setShowResults(false);
  };

  if (showResults) {
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
        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              type="text"
              placeholder="What are you looking for?"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={handleKeyPress}
              className="pl-10 pr-4 h-12 text-base"
            />
          </div>
        </div>

        {/* Tab Interface */}
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'sitters' | 'products' | 'parents')} className="mb-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="sitters">Sitters</TabsTrigger>
            <TabsTrigger value="products">Products</TabsTrigger>
            <TabsTrigger value="parents">Parents</TabsTrigger>
          </TabsList>
          
          <TabsContent value="sitters" className="mt-6">
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Find Babysitters</h3>
              <p className="text-gray-600 mb-6">Search for trusted babysitters recommended by your parent network.</p>
              <Button onClick={handleSearch} disabled={!searchQuery.trim()} className="w-full max-w-xs">
                Search Sitters
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="products" className="mt-6">
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Discover Products</h3>
              <p className="text-gray-600 mb-6">Find baby and parenting products recommended by other parents.</p>
              <div className="space-y-3">
                <Button onClick={handleSearch} disabled={!searchQuery.trim()} className="w-full max-w-xs">
                  Search Products
                </Button>
                <Link to="/add-review" state={{ createNew: true, selectedType: 'product' }}>
                  <Button variant="outline" className="w-full max-w-xs">
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
              <Button onClick={handleSearch} disabled={!searchQuery.trim()} className="w-full max-w-xs">
                Search Parents
              </Button>
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
