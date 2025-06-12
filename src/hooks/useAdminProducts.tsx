
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface AdminProduct {
  id: string;
  name: string;
  brand_name: string;
  category: string | null;
  description: string | null;
  image_url: string | null;
  price: number | null;
  external_purchase_link: string | null;
  average_rating: number | null;
  review_count: number | null;
  is_verified: boolean;
  created_at: string;
  updated_at: string;
}

interface UpdateProductData {
  name?: string;
  brand_name?: string;
  category?: string;
  description?: string;
  image_url?: string;
  price?: number;
  external_purchase_link?: string;
}

export const useAdminProducts = () => {
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(0);
  const [hasMorePages, setHasMorePages] = useState(true);
  const { toast } = useToast();

  const pageSize = 25;

  const fetchProducts = async (search = searchTerm, page = 0, reset = false) => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase.rpc('admin_get_all_products', {
        search_term: search,
        page_limit: pageSize,
        page_offset: page * pageSize
      });

      if (error) {
        console.error('Error fetching products:', error);
        toast({
          title: "Error",
          description: "Failed to load products",
          variant: "destructive",
        });
        return;
      }

      const newProducts = data || [];
      
      if (reset || page === 0) {
        setProducts(newProducts);
      } else {
        setProducts(prev => [...prev, ...newProducts]);
      }
      
      setHasMorePages(newProducts.length === pageSize);
      setCurrentPage(page);
      
    } catch (error) {
      console.error('Error in fetchProducts:', error);
      toast({
        title: "Error",
        description: "Failed to load products",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateProduct = async (productId: string, updateData: UpdateProductData) => {
    try {
      const { data, error } = await supabase.rpc('admin_update_product_details', {
        target_product_id: productId,
        new_name: updateData.name,
        new_brand_name: updateData.brand_name,
        new_category: updateData.category,
        new_description: updateData.description,
        new_image_url: updateData.image_url,
        new_price: updateData.price,
        new_external_purchase_link: updateData.external_purchase_link
      });

      if (error) {
        console.error('Error updating product:', error);
        toast({
          title: "Error",
          description: "Failed to update product",
          variant: "destructive",
        });
        return false;
      }

      toast({
        title: "Success",
        description: "Product updated successfully",
      });

      return true;
    } catch (error) {
      console.error('Error in updateProduct:', error);
      return false;
    }
  };

  const setVerifiedStatus = async (productId: string, verified: boolean) => {
    try {
      const { data, error } = await supabase.rpc('admin_set_verified_status', {
        item_type: 'product',
        item_id: productId,
        verified_status: verified
      });

      if (error) {
        console.error('Error setting verified status:', error);
        toast({
          title: "Error",
          description: "Failed to update verified status",
          variant: "destructive",
        });
        return false;
      }

      // Update local state
      setProducts(prev => prev.map(product => 
        product.id === productId 
          ? { ...product, is_verified: verified }
          : product
      ));

      toast({
        title: "Success",
        description: `Product ${verified ? 'verified' : 'unverified'} successfully`,
      });

      return true;
    } catch (error) {
      console.error('Error in setVerifiedStatus:', error);
      return false;
    }
  };

  const mergeDuplicates = async (sourceId: string, targetId: string, reason: string) => {
    try {
      const { data, error } = await supabase.rpc('admin_merge_duplicates', {
        item_type: 'product',
        source_id: sourceId,
        target_id: targetId,
        merge_reason: reason
      });

      if (error) {
        console.error('Error merging products:', error);
        toast({
          title: "Error",
          description: "Failed to merge products",
          variant: "destructive",
        });
        return false;
      }

      // Remove source product from local state
      setProducts(prev => prev.filter(product => product.id !== sourceId));

      toast({
        title: "Success",
        description: "Products merged successfully",
      });

      return true;
    } catch (error) {
      console.error('Error in mergeDuplicates:', error);
      return false;
    }
  };

  const searchProducts = (term: string) => {
    setSearchTerm(term);
    fetchProducts(term, 0, true);
  };

  const loadMoreProducts = () => {
    if (!loading && hasMorePages) {
      fetchProducts(searchTerm, currentPage + 1, false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return {
    products,
    loading,
    searchTerm,
    searchProducts,
    updateProduct,
    setVerifiedStatus,
    mergeDuplicates,
    loadMoreProducts,
    hasMorePages,
    refreshProducts: () => fetchProducts(searchTerm, 0, true)
  };
};
