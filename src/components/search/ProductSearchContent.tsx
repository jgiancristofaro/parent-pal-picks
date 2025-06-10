
import { ProductSearchInput } from "@/components/search/ProductSearchInput";
import { FriendRecommendationToggle } from "@/components/search/FriendRecommendationToggle";
import { CategoryFilterPills } from "@/components/search/CategoryFilterPills";
import { ProductsGrid } from "@/components/search/ProductsGrid";
import { ProductSearchResultCard } from "@/components/review/ProductSearchResultCard";
import { NoResultsMessage } from "./NoResultsMessage";

interface ProductSearchContentProps {
  mode: 'discovery' | 'review';
  productSearchTerm: string;
  setProductSearchTerm: (term: string) => void;
  productFriendRecommendedOnly: boolean;
  setProductFriendRecommendedOnly: (value: boolean) => void;
  categories: any[];
  selectedCategory: string | null;
  handleCategoryClick: (category: string | null) => void;
  filteredProducts: any[];
  handleSelectForReview: (item: any) => void;
  handleCreateNewForReview: () => void;
}

export const ProductSearchContent = ({
  mode,
  productSearchTerm,
  setProductSearchTerm,
  productFriendRecommendedOnly,
  setProductFriendRecommendedOnly,
  categories,
  selectedCategory,
  handleCategoryClick,
  filteredProducts,
  handleSelectForReview,
  handleCreateNewForReview,
}: ProductSearchContentProps) => {
  return (
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
                onSelect={() => handleSelectForReview(product)}
              />
            ))}
          </div>
        ) : (
          <ProductsGrid products={filteredProducts} />
        )
      ) : (
        <NoResultsMessage 
          type="product" 
          mode={mode} 
          onCreateNew={handleCreateNewForReview} 
        />
      )}
    </div>
  );
};
