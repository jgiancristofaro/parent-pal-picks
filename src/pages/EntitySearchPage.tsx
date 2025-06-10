
import { Header } from "@/components/Header";
import { BottomNavigation } from "@/components/BottomNavigation";
import { HyperLocalSitters } from "@/components/search/HyperLocalSitters";
import { SearchFilters } from "@/components/search/SearchFilters";
import { SearchResultsGrid } from "@/components/search/SearchResultsGrid";
import { ProductSearchInput } from "@/components/search/ProductSearchInput";
import { FriendRecommendationToggle } from "@/components/search/FriendRecommendationToggle";
import { CategoryFilterPills } from "@/components/search/CategoryFilterPills";
import { ProductsGrid } from "@/components/search/ProductsGrid";
import { SitterSearchResultCard } from "@/components/review/SitterSearchResultCard";
import { ProductSearchResultCard } from "@/components/review/ProductSearchResultCard";
import { useSearchFilters } from "@/hooks/useSearchFilters";
import { useSitterData } from "@/hooks/useSitterData";
import { useProductSearch } from "@/hooks/useProductSearch";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";

interface EntitySearchPageProps {
  type: 'sitter' | 'product';
  mode: 'discovery' | 'review';
  onSitterSelect?: (sitter: any) => void;
  onProductSelect?: (product: any) => void;
  onCreateNew?: () => void;
}

const EntitySearchPage = ({ 
  type, 
  mode, 
  onSitterSelect, 
  onProductSelect, 
  onCreateNew 
}: EntitySearchPageProps) => {
  const { user } = useAuth();
  const currentUserId = user?.id || "";

  // Sitter search logic
  const {
    searchTerm: sitterSearchTerm,
    setSearchTerm: setSitterSearchTerm,
    friendRecommendedOnly: sitterFriendRecommendedOnly,
    setFriendRecommendedOnly: setSitterFriendRecommendedOnly,
    selectedUserHomeId,
    setSelectedUserHomeId,
    localSearchScope,
    setLocalSearchScope,
  } = useSearchFilters();

  const {
    userLocations,
    selectedUserHomeDetails,
    localSittersLoading,
    shouldFetchLocalSitters,
    displayedSitters
  } = useSitterData({
    currentUserId,
    selectedUserHomeId,
    localSearchScope,
    searchTerm: sitterSearchTerm,
    friendRecommendedOnly: sitterFriendRecommendedOnly
  });

  // Product search logic
  const {
    searchTerm: productSearchTerm,
    setSearchTerm: setProductSearchTerm,
    selectedCategory,
    friendRecommendedOnly: productFriendRecommendedOnly,
    setFriendRecommendedOnly: setProductFriendRecommendedOnly,
    categories,
    loading: productLoading,
    filteredProducts,
    handleCategoryClick,
  } = useProductSearch();

  const getPageTitle = () => {
    if (type === 'sitter') {
      return mode === 'review' ? 'Select a Sitter to Review' : 'Find a sitter';
    }
    return mode === 'review' ? 'Select a Product to Review' : 'Shop Products';
  };

  const getBackgroundColor = () => {
    return type === 'sitter' ? 'bg-purple-50' : 'bg-gray-50';
  };

  const renderNoResultsMessage = () => {
    if (mode === 'review' && onCreateNew) {
      return (
        <div className="text-center py-8">
          <p className="text-gray-600 mb-4">
            Can't find what you're looking for?
          </p>
          <Button
            onClick={onCreateNew}
            className="bg-purple-500 hover:bg-purple-600 text-white"
          >
            Create a new {type} profile
          </Button>
        </div>
      );
    }
    
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">No results found</p>
      </div>
    );
  };

  if (type === 'product') {
    if (productLoading) {
      return (
        <div className={`min-h-screen pb-20 ${getBackgroundColor()}`}>
          <Header title={getPageTitle()} showBack={true} showSettings={false} />
          <div className="p-4 text-center">
            <p className="text-gray-500">Loading products...</p>
          </div>
          {mode === 'discovery' && <BottomNavigation />}
        </div>
      );
    }

    return (
      <div className={`min-h-screen pb-20 ${getBackgroundColor()}`}>
        <Header title={getPageTitle()} showBack={true} showSettings={false} />
        
        <div className="p-4">
          <ProductSearchInput 
            searchTerm={productSearchTerm}
            onSearchTermChange={setProductSearchTerm}
          />

          <FriendRecommendationToggle
            friendRecommendedOnly={productFriendRecommendedOnly}
            onToggle={setProductFriendRecommendedOnly}
          />

          <CategoryFilterPills
            categories={categories}
            selectedCategory={selectedCategory}
            onCategoryClick={handleCategoryClick}
          />

          {filteredProducts.length > 0 ? (
            mode === 'review' ? (
              <div className="space-y-3">
                {filteredProducts.map((product) => (
                  <ProductSearchResultCard
                    key={product.id}
                    product={product}
                    onSelect={() => onProductSelect?.(product)}
                  />
                ))}
              </div>
            ) : (
              <ProductsGrid products={filteredProducts} />
            )
          ) : (
            renderNoResultsMessage()
          )}
        </div>
        
        {mode === 'discovery' && <BottomNavigation />}
      </div>
    );
  }

  // Sitter search rendering
  return (
    <div className={`min-h-screen pb-20 ${getBackgroundColor()}`}>
      <Header title={getPageTitle()} showBack={true} showSettings={false} />
      
      <div className="p-4">
        {/* Search Filters */}
        <SearchFilters
          searchTerm={sitterSearchTerm}
          onSearchTermChange={setSitterSearchTerm}
          friendRecommendedOnly={sitterFriendRecommendedOnly}
          onFriendRecommendedOnlyChange={setSitterFriendRecommendedOnly}
          userLocations={userLocations}
          selectedUserHomeId={selectedUserHomeId}
          onSelectedUserHomeIdChange={setSelectedUserHomeId}
          selectedUserHomeDetails={selectedUserHomeDetails}
          localSearchScope={localSearchScope}
          onLocalSearchScopeChange={setLocalSearchScope}
        />

        {/* Original Hyper-Local Component - Only show in discovery mode when no filters are active */}
        {mode === 'discovery' && !sitterSearchTerm && !sitterFriendRecommendedOnly && localSearchScope === "ANY" && userLocations.length > 0 && (
          <HyperLocalSitters 
            currentUserId={currentUserId}
            selectedLocationId={userLocations[0]?.id}
            locationNickname={userLocations[0]?.location_nickname}
            searchScope="BUILDING"
          />
        )}

        {/* Results Section */}
        {displayedSitters.length > 0 ? (
          mode === 'review' ? (
            <div className="space-y-3">
              {displayedSitters.map((sitter) => (
                <SitterSearchResultCard
                  key={sitter.id}
                  sitter={sitter}
                  onSelectSitter={() => onSitterSelect?.(sitter)}
                />
              ))}
            </div>
          ) : (
            <SearchResultsGrid 
              displayedSitters={displayedSitters}
              searchTerm={sitterSearchTerm}
              friendRecommendedOnly={sitterFriendRecommendedOnly}
              localSearchScope={localSearchScope}
              selectedUserHomeDetails={selectedUserHomeDetails}
              localSittersLoading={localSittersLoading}
              shouldFetchLocalSitters={shouldFetchLocalSitters}
            />
          )
        ) : (
          renderNoResultsMessage()
        )}
      </div>
      
      {mode === 'discovery' && <BottomNavigation />}
    </div>
  );
};

export default EntitySearchPage;
