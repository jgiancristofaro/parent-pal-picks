
import { BottomNavigation } from "@/components/BottomNavigation";
import { PageHeader } from "./PageHeader";
import { SitterSearchContent } from "./SitterSearchContent";
import { ProductSearchContent } from "./ProductSearchContent";
import { useSearchFilters } from "@/hooks/useSearchFilters";
import { useSitterData } from "@/hooks/useSitterData";
import { useProductSearch } from "@/hooks/useProductSearch";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";

interface SearchPageContentProps {
  type: 'sitter' | 'product';
  mode: 'discovery' | 'review';
  onSitterSelect?: (sitter: any) => void;
  onProductSelect?: (product: any) => void;
  onCreateNew?: () => void;
}

export const SearchPageContent = ({ 
  type, 
  mode, 
  onSitterSelect, 
  onProductSelect, 
  onCreateNew 
}: SearchPageContentProps) => {
  const { user } = useAuth();
  const navigate = useNavigate();
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

  const getBackgroundColor = () => {
    return type === 'sitter' ? 'bg-purple-50' : 'bg-gray-50';
  };

  const handleSelectForReview = (item: any) => {
    if (mode === 'review') {
      navigate('/add-review', { 
        state: { 
          selectedId: item.id,
          selectedType: type,
          selectedData: item
        }
      });
    }
  };

  const handleEditExistingReview = (reviewData: any) => {
    if (mode === 'review') {
      navigate('/add-review', { 
        state: { 
          editMode: true,
          ...reviewData
        }
      });
    }
  };

  const handleCreateNewForReview = () => {
    if (mode === 'review') {
      navigate('/add-review', { 
        state: { 
          createNew: true,
          selectedType: type
        }
      });
    } else if (onCreateNew) {
      onCreateNew();
    }
  };

  if (type === 'product') {
    if (productLoading) {
      return (
        <div className={`min-h-screen pb-20 ${getBackgroundColor()}`}>
          <PageHeader type={type} mode={mode} />
          <div className="p-4 text-center">
            <p className="text-gray-500">Loading products...</p>
          </div>
          {mode === 'discovery' && <BottomNavigation />}
        </div>
      );
    }

    return (
      <div className={`min-h-screen pb-20 ${getBackgroundColor()}`}>
        <PageHeader type={type} mode={mode} />
        
        <ProductSearchContent
          mode={mode}
          productSearchTerm={productSearchTerm}
          setProductSearchTerm={setProductSearchTerm}
          productFriendRecommendedOnly={productFriendRecommendedOnly}
          setProductFriendRecommendedOnly={setProductFriendRecommendedOnly}
          categories={categories}
          selectedCategory={selectedCategory}
          handleCategoryClick={handleCategoryClick}
          filteredProducts={filteredProducts}
          handleSelectForReview={handleSelectForReview}
          handleEditExistingReview={handleEditExistingReview}
          handleCreateNewForReview={handleCreateNewForReview}
        />
        
        {mode === 'discovery' && <BottomNavigation />}
      </div>
    );
  }

  // Sitter search rendering
  return (
    <div className={`min-h-screen pb-20 ${getBackgroundColor()}`}>
      <PageHeader type={type} mode={mode} />
      
      <SitterSearchContent
        mode={mode}
        currentUserId={currentUserId}
        sitterSearchTerm={sitterSearchTerm}
        setSitterSearchTerm={setSitterSearchTerm}
        sitterFriendRecommendedOnly={sitterFriendRecommendedOnly}
        setSitterFriendRecommendedOnly={setSitterFriendRecommendedOnly}
        userLocations={userLocations}
        selectedUserHomeId={selectedUserHomeId}
        setSelectedUserHomeId={setSelectedUserHomeId}
        selectedUserHomeDetails={selectedUserHomeDetails}
        localSearchScope={localSearchScope}
        setLocalSearchScope={setLocalSearchScope}
        displayedSitters={displayedSitters}
        localSittersLoading={localSittersLoading}
        shouldFetchLocalSitters={Boolean(shouldFetchLocalSitters)}
        handleSelectForReview={handleSelectForReview}
        handleEditExistingReview={handleEditExistingReview}
        handleCreateNewForReview={handleCreateNewForReview}
      />
      
      {mode === 'discovery' && <BottomNavigation />}
    </div>
  );
};
