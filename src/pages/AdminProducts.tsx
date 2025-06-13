
import React, { useState } from 'react';
import { useAdminProducts } from '@/hooks/useAdminProducts';
import { useDebouncedSearch } from '@/hooks/useDebouncedSearch';
import { ProductsHeader } from '@/components/admin/products/ProductsHeader';
import { ProductsSearch } from '@/components/admin/products/ProductsSearch';
import { ProductsTable } from '@/components/admin/products/ProductsTable';
import { ProductsLoadingState } from '@/components/admin/products/ProductsLoadingState';
import { ProductsErrorState } from '@/components/admin/products/ProductsErrorState';

const AdminProducts = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebouncedSearch(searchTerm, 500);
  const { products, isLoading, error } = useAdminProducts(debouncedSearchTerm);

  if (error) {
    return <ProductsErrorState error={error} />;
  }

  if (isLoading) {
    return <ProductsLoadingState />;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <ProductsHeader productCount={products.length} />
        <ProductsSearch 
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          debouncedSearchTerm={debouncedSearchTerm}
        />
        <ProductsTable 
          products={products}
          debouncedSearchTerm={debouncedSearchTerm}
        />
      </div>
    </div>
  );
};

export default AdminProducts;
