import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useUserLocations } from "@/hooks/useUserLocations";
import { useSitterData } from "@/hooks/useSitterData";
import { useProductSearch } from "@/hooks/useProductSearch";
import { PageHeader } from "@/components/PageHeader";
import { SearchFilters } from "@/components/search/SearchFilters";
import { SitterCard } from "@/components/cards/SitterCard";
import { ProductCard } from "@/components/cards/ProductCard";
import { ModeToggle } from "@/components/ModeToggle";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";

interface UserLocation {
  id: string;
  location_nickname: string;
  dwelling_type: string;
  google_place_id: string | null;
}

interface UserLocationDetails {
  id: string;
  location_nickname: string;
  dwelling_type: string;
  building_identifier: string | null;
  zip_code: string;
  google_place_id: string | null;
}

interface Sitter {
  id: string;
  name: string;
  image: string;
  rating: number;
  experience?: string;
  friendRecommendationCount: number;
  workedInUserLocationNickname?: string;
}

interface Product {
  id: string;
  name: string;
  description: string;
  image: string;
  price: number;
  friendRecommendationCount: number;
}

interface SearchPageContentProps {
  type: 'sitter' | 'product';
  mode: 'discovery' | 'review';
}

interface SitterSearchContentProps {
  searchTerm: string;
  onSearchTermChange: (term: string) => void;
  friendRecommendedOnly: boolean;
  onFriendRecommendedOnlyChange: (value: boolean) => void;
  userLocations: UserLocation[];
  selectedUserHomeId: string | null;
  onSelectedUserHomeIdChange: (id: string | null) => void;
  selectedUserHomeDetails: UserLocationDetails | undefined;
  localSearchScope: string;
  onLocalSearchScopeChange: (scope: string) => void;
  displayedSitters: Sitter[];
  isLoading: boolean;
  mode: 'discovery' | 'review';
}

interface ProductSearchContentProps {
  searchTerm: string;
  onSearchTermChange: (term: string) => void;
  friendRecommendedOnly: boolean;
  onFriendRecommendedOnlyChange: (value: boolean) => void;
  displayedProducts: Product[];
  isLoading: boolean;
  mode: 'discovery' | 'review';
}

const SitterSearchContent = ({
  searchTerm,
  onSearchTermChange,
  friendRecommendedOnly,
  onFriendRecommendedOnlyChange,
  userLocations,
  selectedUserHomeId,
  onSelectedUserHomeIdChange,
  selectedUserHomeDetails,
  localSearchScope,
  onLocalSearchScopeChange,
  displayedSitters,
  isLoading,
  mode
}: SitterSearchContentProps) => {
  return (
    <>
      <SearchFilters
        searchTerm={searchTerm}
        onSearchTermChange={onSearchTermChange}
        friendRecommendedOnly={friendRecommendedOnly}
        onFriendRecommendedOnlyChange={onFriendRecommendedOnlyChange}
        userLocations={userLocations}
        selectedUserHomeId={selectedUserHomeId}
        onSelectedUserHomeIdChange={onSelectedUserHomeIdChange}
        selectedUserHomeDetails={selectedUserHomeDetails}
        localSearchScope={localSearchScope}
        onLocalSearchScopeChange={onLocalSearchScopeChange}
      />

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white rounded-lg shadow-sm p-4">
              <div className="flex space-x-4">
                <Skeleton className="h-12 w-12 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-4 w-48" />
                  <Skeleton className="h-4 w-24" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {displayedSitters.map((sitter) => (
            <SitterCard
              key={sitter.id}
              id={sitter.id}
              name={sitter.name}
              image={sitter.image}
              rating={sitter.rating}
              experience={sitter.experience}
              friendRecommendationCount={sitter.friendRecommendationCount}
              workedInUserLocationNickname={sitter.workedInUserLocationNickname}
              mode={mode}
            />
          ))}
        </div>
      )}
    </>
  );
};

const ProductSearchContent = ({
  searchTerm,
  onSearchTermChange,
  friendRecommendedOnly,
  onFriendRecommendedOnlyChange,
  displayedProducts,
  isLoading,
  mode
}: ProductSearchContentProps) => {
  return (
    <>
      <div className="mb-4 p-4 bg-white rounded-lg border border-gray-200">
        {/* Search Bar */}
        <input
          type="text"
          placeholder="Search for products..."
          value={searchTerm}
          onChange={(e) => onSearchTermChange(e.target.value)}
          className="w-full px-4 py-2 border rounded-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
        />

        {/* Friend Recommended Filter */}
        <div className="mt-4 flex items-center space-x-3">
          <input
            type="checkbox"
            id="friend-recommended"
            checked={friendRecommendedOnly}
            onChange={(e) => onFriendRecommendedOnlyChange(e.target.checked)}
            className="h-5 w-5 text-purple-600 rounded focus:ring-purple-500"
          />
          <label htmlFor="friend-recommended" className="text-sm font-medium text-gray-900">
            Friend-Recommended Only
          </label>
        </div>
        <p className="text-xs text-gray-500 mt-2">
          Show only products recommended by people you follow.
        </p>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white rounded-lg shadow-sm p-4">
              <div className="flex space-x-4">
                <Skeleton className="h-24 w-full rounded-md" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-4 w-48" />
                  <Skeleton className="h-4 w-24" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {displayedProducts.map((product) => (
            <ProductCard
              key={product.id}
              id={product.id}
              name={product.name}
              description={product.description}
              image={product.image}
              price={product.price}
              friendRecommendationCount={product.friendRecommendationCount}
              mode={mode}
            />
          ))}
        </div>
      )}
    </>
  );
};

export const SearchPageContent = ({ type, mode }: SearchPageContentProps) => {
  const [searchParams] = useSearchParams();
  const initialSearchTerm = searchParams.get('searchTerm') || '';
  const [searchTerm, setSearchTerm] = useState(initialSearchTerm);
  const [sitterFriendRecommendedOnly, setSitterFriendRecommendedOnly] = useState(false);
  const [productFriendRecommendedOnly, setProductFriendRecommendedOnly] = useState(false);
  const { user } = useAuth();
  const currentUserId = user?.id;
  const [selectedUserHomeId, setSelectedUserHomeId] = useState<string | null>(null);
  const [localSearchScope, setLocalSearchScope] = useState("ANY");

  // Fetch user's saved locations
  const { data: userLocations = [] } = useUserLocations();

  // Get selected home details
  const selectedUserHomeDetails = userLocations.find(loc => loc.id === selectedUserHomeId);

  // Sitter Data Hook
  const {
    displayedSitters,
    localSittersLoading: sittersLoading
  } = useSitterData({
    currentUserId: currentUserId || '',
    selectedUserHomeId,
    localSearchScope,
    searchTerm,
    friendRecommendedOnly: sitterFriendRecommendedOnly
  });

  // Product Data Hook
  const {
    displayedProducts,
    isLoading: productsLoading
  } = useProductSearch({
    searchTerm,
    friendRecommendedOnly: productFriendRecommendedOnly
  });

  const isLoading = type === 'sitter' ? sittersLoading : productsLoading;

  const getPageTitle = () => {
    switch (type) {
      case 'sitter':
        return mode === 'discovery' ? 'Find Sitters' : 'Rate Sitters';
      case 'product':
        return mode === 'discovery' ? 'Shop Products' : 'Review Products';
      default:
        return 'Search';
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <PageHeader 
        title={getPageTitle()} 
        showBackButton={true} 
        backButtonPath="/search" 
      />

      <div className="px-4 py-6">
        {type === 'sitter' && (
          <SitterSearchContent
            searchTerm={searchTerm}
            onSearchTermChange={setSearchTerm}
            friendRecommendedOnly={sitterFriendRecommendedOnly}
            onFriendRecommendedOnlyChange={setSitterFriendRecommendedOnly}
            userLocations={userLocations}
            selectedUserHomeId={selectedUserHomeId}
            onSelectedUserHomeIdChange={setSelectedUserHomeId}
            selectedUserHomeDetails={selectedUserHomeDetails}
            localSearchScope={localSearchScope}
            onLocalSearchScopeChange={setLocalSearchScope}
            displayedSitters={displayedSitters}
            isLoading={isLoading}
            mode={mode}
          />
        )}

        {type === 'product' && (
          <ProductSearchContent
            searchTerm={searchTerm}
            onSearchTermChange={setSearchTerm}
            friendRecommendedOnly={productFriendRecommendedOnly}
            onFriendRecommendedOnlyChange={setProductFriendRecommendedOnly}
            displayedProducts={displayedProducts}
            isLoading={isLoading}
            mode={mode}
          />
        )}
      </div>
    </div>
  );
};
