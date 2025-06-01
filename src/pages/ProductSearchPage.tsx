
import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { BottomNavigation } from "@/components/BottomNavigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Search as SearchIcon } from "lucide-react";
import { ProductCard } from "@/components/ProductCard";
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

const ProductSearchPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [friendRecommendedOnly, setFriendRecommendedOnly] = useState(false);
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
        .order('average_rating', { ascending: false, nullsLast: true });

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
        {/* Search Bar */}
        <div className="relative mb-2">
          <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <Input 
            className="pl-10 py-3 bg-white rounded-lg border-gray-200" 
            placeholder="Search products by name, brand, category..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Friend Recommended Toggle */}
        <div className="flex items-center justify-between mb-1 p-3 bg-white rounded-lg border border-gray-200">
          <span className="text-sm font-medium text-gray-700">Recommended by People I Follow</span>
          <Switch
            checked={friendRecommendedOnly}
            onCheckedChange={setFriendRecommendedOnly}
          />
        </div>

        {/* Category Filter Pills */}
        <div className="mb-6">
          <div className="flex overflow-x-auto space-x-2 px-1 pt-0 no-scrollbar">
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={selectedCategory === category.name ? "default" : "outline"}
                size="sm"
                className={`whitespace-nowrap rounded-full px-2.5 py-0.5 text-xs ${
                  selectedCategory === category.name
                    ? "bg-purple-500 text-white hover:bg-purple-600"
                    : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
                }`}
                onClick={() => handleCategoryClick(category.name)}
              >
                {category.name}
              </Button>
            ))}
          </div>
        </div>

        {/* Product Results Grid */}
        <div className="grid grid-cols-2 gap-4">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              id={product.id}
              name={product.name}
              image={product.image_url || "https://images.unsplash.com/photo-1586685715203-7cfac24d9afa?q=80&w=2487&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"}
              category={product.category || "Uncategorized"}
              rating={product.average_rating || 0}
              friendRecommendationCount={product.review_count || 0}
            />
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500">No products found matching your filters</p>
            <p className="text-gray-400 text-sm mt-2">Try adjusting your search criteria or filters.</p>
          </div>
        )}
      </div>
      
      <BottomNavigation />
    </div>
  );
};

export default ProductSearchPage;
