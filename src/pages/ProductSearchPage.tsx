
import { Header } from "@/components/Header";
import { BottomNavigation } from "@/components/BottomNavigation";
import { ProductSearchInput } from "@/components/search/ProductSearchInput";
import { FriendRecommendationToggle } from "@/components/search/FriendRecommendationToggle";
import { CategoryFilterPills } from "@/components/search/CategoryFilterPills";
import { ProductsGrid } from "@/components/search/ProductsGrid";
import { useProductSearch } from "@/hooks/useProductSearch";

const ProductSearchPage = () => {
  const {
    searchTerm,
    setSearchTerm,
    selectedCategory,
    friendRecommendedOnly,
    setFriendRecommendedOnly,
    categories,
    loading,
    filteredProducts,
    handleCategoryClick,
  } = useProductSearch();

  if (loading) {
    return (
      <div className="min-h-screen pb-20 bg-gray-50">
        <Header title="Shop Products" showBack={true} showSettings={false} />
        <div className="p-4 text-center">
          <p className="text-gray-500">Loading products...</p>
        </div>
        <BottomNavigation />
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-20 bg-gray-50">
      <Header title="Shop Products" showBack={true} showSettings={false} />
      
      <div className="p-4">
        <ProductSearchInput 
          searchTerm={searchTerm}
          onSearchTermChange={setSearchTerm}
        />

        <FriendRecommendationToggle
          friendRecommendedOnly={friendRecommendedOnly}
          onToggle={setFriendRecommendedOnly}
        />

        <CategoryFilterPills
          categories={categories}
          selectedCategory={selectedCategory}
          onCategoryClick={handleCategoryClick}
        />

        <ProductsGrid products={filteredProducts} />
      </div>
      
      <BottomNavigation />
    </div>
  );
};

export default ProductSearchPage;
