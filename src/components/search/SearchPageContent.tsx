
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useUserLocations } from "@/hooks/useUserLocations";
import { useSitterData } from "@/hooks/useSitterData";
import { useProductSearch } from "@/hooks/useProductSearch";
import { PageHeader } from "@/components/search/PageHeader";
import { SitterSearchContent } from "@/components/search/SitterSearchContent";
import { ProductSearchContent } from "@/components/search/ProductSearchContent";

interface SearchPageContentProps {
  type: 'sitter' | 'product';
  mode: 'discovery' | 'review';
}

export const SearchPageContent = ({ type, mode }: SearchPageContentProps) => {
  const [searchParams] = useSearchParams();
  const initialSearchTerm = searchParams.get('searchTerm') || '';
  const [sitterSearchTerm, setSitterSearchTerm] = useState(initialSearchTerm);
  const [productSearchTerm, setProductSearchTerm] = useState(initialSearchTerm);
  const [sitterFriendRecommendedOnly, setSitterFriendRecommendedOnly] = useState(false);
  const [productFriendRecommendedOnly, setProductFriendRecommendedOnly] = useState(false);
  const { user } = useAuth();
  const currentUserId = user?.id || '';
  const [selectedUserHomeId, setSelectedUserHomeId] = useState<string | null>(null);
  const [localSearchScope, setLocalSearchScope] = useState("ANY");

  // Fetch user's saved locations
  const { data: userLocations = [] } = useUserLocations();

  // Get selected home details
  const selectedUserHomeDetails = userLocations.find(loc => loc.id === selectedUserHomeId);

  // Sitter Data Hook
  const {
    displayedSitters,
    localSittersLoading,
    shouldFetchLocalSitters
  } = useSitterData({
    currentUserId,
    selectedUserHomeId,
    localSearchScope,
    searchTerm: sitterSearchTerm,
    friendRecommendedOnly: sitterFriendRecommendedOnly
  });

  // Product Data Hook
  const {
    filteredProducts,
    categories,
    selectedCategory,
    handleCategoryClick,
    loading: productsLoading
  } = useProductSearch({
    searchTerm: productSearchTerm,
    friendRecommendedOnly: productFriendRecommendedOnly
  });

  const handleSelectForReview = (item: any) => {
    console.log('Selected for review:', item);
    // Implementation will depend on review flow
  };

  const handleCreateNewForReview = () => {
    console.log('Create new for review');
    // Implementation will depend on review flow
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <PageHeader type={type} mode={mode} />

      {/* Content */}
      {type === 'sitter' && (
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
          shouldFetchLocalSitters={shouldFetchLocalSitters}
          handleSelectForReview={handleSelectForReview}
          handleCreateNewForReview={handleCreateNewForReview}
        />
      )}

      {type === 'product' && (
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
          handleCreateNewForReview={handleCreateNewForReview}
        />
      )}
    </div>
  );
};
