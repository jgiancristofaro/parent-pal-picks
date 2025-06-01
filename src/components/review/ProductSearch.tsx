
import React, { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useDebouncedSearch } from "@/hooks/useDebouncedSearch";
import { useToast } from "@/hooks/use-toast";
import { ProductSearchResultCard } from "./ProductSearchResultCard";

interface Product {
  id: string;
  name: string;
  category: string | null;
  image_url: string | null;
  brand_name: string;
}

interface ProductSearchProps {
  onProductSelect: (product: Product) => void;
  onBack: () => void;
}

export const ProductSearch = ({ onProductSelect, onBack }: ProductSearchProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const debouncedSearchTerm = useDebouncedSearch(searchTerm, 300);
  const { toast } = useToast();

  useEffect(() => {
    if (debouncedSearchTerm.trim()) {
      searchProducts(debouncedSearchTerm);
    } else {
      setSearchResults([]);
    }
  }, [debouncedSearchTerm]);

  const searchProducts = async (query: string) => {
    if (!query.trim()) return;

    setIsSearching(true);
    try {
      const { data, error } = await supabase.functions.invoke('search_products', {
        body: { query: query.trim() }
      });

      if (error) throw error;

      setSearchResults(data?.products || []);
    } catch (error) {
      console.error("Error searching products:", error);
      toast({
        title: "Error",
        description: "Failed to search products",
        variant: "destructive",
      });
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Find a Product to Review
        </h2>
        <p className="text-gray-600">
          Search for the product you'd like to review
        </p>
      </div>

      <div className="space-y-4">
        <Input
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search by Product Name, Brand..."
          className="w-full"
        />

        {isSearching && (
          <div className="text-center text-gray-500">
            Searching...
          </div>
        )}

        {searchResults.length > 0 && (
          <div className="space-y-3">
            {searchResults.map((product) => (
              <ProductSearchResultCard
                key={product.id}
                product={product}
                onSelect={() => onProductSelect(product)}
              />
            ))}
          </div>
        )}

        {debouncedSearchTerm.trim() && !isSearching && searchResults.length === 0 && (
          <div className="text-center text-gray-500 py-8">
            No products found. Try a different search term.
          </div>
        )}
      </div>

      <div className="flex justify-center">
        <Button
          onClick={onBack}
          variant="outline"
          className="px-6 py-2"
        >
          Back
        </Button>
      </div>
    </div>
  );
};
