
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Category {
  id: string;
  name: string;
}

interface Product {
  id: string;
  name: string;
  brand_name: string;
  category: string;
  category_id: string;
  image_url: string | null;
  price: number | null;
  average_rating: number | null;
  review_count: number | null;
}

interface UseProductSearchProps {
  searchTerm: string;
  friendRecommendedOnly: boolean;
}

export const useProductSearch = ({ searchTerm, friendRecommendedOnly }: UseProductSearchProps) => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Fetch categories from database
  useEffect(() => {
    const fetchCategories = async () => {
      const { data, error } = await supabase
        .from('categories')
        .select('id, name')
        .order('name');

      if (error) {
        console.error('Error fetching categories:', error);
        toast({
          title: "Error",
          description: "Failed to load categories",
          variant: "destructive",
        });
      } else {
        setCategories(data || []);
      }
    };

    fetchCategories();
  }, [toast]);

  // Fetch products from database
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('products')
        .select(`
          id,
          name,
          brand_name,
          category,
          category_id,
          image_url,
          price,
          average_rating,
          review_count
        `)
        .order('average_rating', { ascending: false });

      if (error) {
        console.error('Error fetching products:', error);
        toast({
          title: "Error",
          description: "Failed to load products",
          variant: "destructive",
        });
      } else {
        setProducts(data || []);
      }
      setLoading(false);
    };

    fetchProducts();
  }, [toast]);

  // Handle category pill click
  const handleCategoryClick = (category: string) => {
    if (selectedCategory === category) {
      setSelectedCategory(null);
    } else {
      setSelectedCategory(category);
    }
  };

  // Filter and sort products based on search term, category, and friend recommendations
  const filteredProducts = products
    .filter(product => {
      // Filter by search term
      const matchesSearch = searchTerm === "" || 
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.brand_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (product.category && product.category.toLowerCase().includes(searchTerm.toLowerCase()));
      
      // Filter by selected category
      const matchesCategory = selectedCategory === null || product.category === selectedCategory;
      
      // Filter by friend recommendations (for now, showing products with ratings >= 4)
      const matchesFriendFilter = !friendRecommendedOnly || (product.average_rating && product.average_rating >= 4);
      
      return matchesSearch && matchesCategory && matchesFriendFilter;
    })
    .sort((a, b) => {
      // Sort by average rating if no search term
      if (searchTerm === "") {
        const ratingA = a.average_rating || 0;
        const ratingB = b.average_rating || 0;
        return ratingB - ratingA;
      }
      return 0;
    });

  return {
    selectedCategory,
    categories,
    loading,
    filteredProducts,
    handleCategoryClick,
  };
};
