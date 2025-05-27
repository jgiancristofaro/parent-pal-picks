
import { useState } from "react";
import { Header } from "@/components/Header";
import { BottomNavigation } from "@/components/BottomNavigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Search as SearchIcon } from "lucide-react";
import { ProductCard } from "@/components/ProductCard";

const ProductSearchPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [friendRecommendedOnly, setFriendRecommendedOnly] = useState(false);

  // Define product categories
  const categories = ['Diapers', 'Bottles', 'Clothing', 'Baby Monitors', 'Strollers', 'Car Seats', 'Baby Food', 'Toys', 'Baby Care', 'Bedding'];

  // Mock product data with diverse categories and recommendation counts
  const mockProducts = [
    {
      id: "1",
      name: "Organic Baby Food Pouches",
      image: "https://images.unsplash.com/photo-1586685715203-7cfac24d9afa?q=80&w=2487&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      category: "Baby Food",
      rating: 4.8,
      friendRecommendationCount: 5
    },
    {
      id: "2",
      name: "Premium Diapers Size 2",
      image: "https://images.unsplash.com/photo-1545012558-6e30e3e89949?q=80&w=2487&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      category: "Diapers",
      rating: 4.6,
      friendRecommendationCount: 3
    },
    {
      id: "3",
      name: "Glass Baby Bottles Set",
      image: "https://images.unsplash.com/photo-1615487483438-2b8484e7a0a7?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      category: "Bottles",
      rating: 4.9,
      friendRecommendationCount: 2
    },
    {
      id: "4",
      name: "Soft Cotton Baby Onesies",
      image: "https://images.unsplash.com/photo-1522771930-78848d9293e8?q=80&w=2671&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      category: "Clothing",
      rating: 4.7,
      friendRecommendationCount: 4
    },
    {
      id: "5",
      name: "Smart Baby Monitor with Camera",
      image: "https://images.unsplash.com/photo-1595586964577-71da3757f6eb?q=80&w=2667&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      category: "Baby Monitors",
      rating: 4.5,
      friendRecommendationCount: 1
    },
    {
      id: "6",
      name: "Lightweight Travel Stroller",
      image: "https://images.unsplash.com/photo-1602972576840-41a701c76504?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      category: "Strollers",
      rating: 4.4,
      friendRecommendationCount: 2
    },
    {
      id: "7",
      name: "Convertible Car Seat",
      image: "https://images.unsplash.com/photo-1591342073971-18a7976e4dc1?q=80&w=2532&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      category: "Car Seats",
      rating: 4.8,
      friendRecommendationCount: 3
    },
    {
      id: "8",
      name: "Wooden Baby Toys Set",
      image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80&w=2669&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      category: "Toys",
      rating: 4.6,
      friendRecommendationCount: 1
    },
    {
      id: "9",
      name: "Hypoallergenic Baby Lotion",
      image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      category: "Baby Care",
      rating: 4.3,
      friendRecommendationCount: 0
    },
    {
      id: "10",
      name: "Bamboo Baby Blanket",
      image: "https://images.unsplash.com/photo-1586685715203-7cfac24d9afa?q=80&w=2487&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      category: "Bedding",
      rating: 4.7,
      friendRecommendationCount: 2
    }
  ];

  // Handle category pill click
  const handleCategoryClick = (category: string) => {
    if (selectedCategory === category) {
      setSelectedCategory(null);
    } else {
      setSelectedCategory(category);
    }
  };

  // Filter and sort products based on search term, category, and friend recommendations
  const filteredProducts = mockProducts
    .filter(product => {
      // Filter by search term
      const matchesSearch = searchTerm === "" || 
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category.toLowerCase().includes(searchTerm.toLowerCase());
      
      // Filter by selected category
      const matchesCategory = selectedCategory === null || product.category === selectedCategory;
      
      // Filter by friend recommendations
      const matchesFriendFilter = !friendRecommendedOnly || product.friendRecommendationCount > 0;
      
      return matchesSearch && matchesCategory && matchesFriendFilter;
    })
    .sort((a, b) => {
      // Sort by friend recommendation count if no search term
      if (searchTerm === "") {
        return b.friendRecommendationCount - a.friendRecommendationCount;
      }
      return 0;
    });

  return (
    <div className="min-h-screen pb-20 bg-gray-50">
      <Header title="Shop Products" showBack={true} showSettings={false} />
      
      <div className="p-4">
        {/* Search Bar */}
        <div className="relative mb-2">
          <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <Input 
            className="pl-10 py-3 bg-white rounded-lg border-gray-200" 
            placeholder="Search products by name, category..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Friend Recommended Toggle */}
        <div className="flex items-center justify-between mb-3 p-3 bg-white rounded-lg border border-gray-200">
          <span className="text-sm font-medium text-gray-700">Recommended by People I Follow</span>
          <Switch
            checked={friendRecommendedOnly}
            onCheckedChange={setFriendRecommendedOnly}
          />
        </div>

        {/* Category Filter Pills */}
        <div className="mb-6">
          <div className="flex overflow-x-auto space-x-2 px-1 py-2">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
                className={`whitespace-nowrap rounded-full px-4 py-2 text-sm ${
                  selectedCategory === category
                    ? "bg-purple-500 text-white hover:bg-purple-600"
                    : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
                }`}
                onClick={() => handleCategoryClick(category)}
              >
                {category}
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
              image={product.image}
              category={product.category}
              rating={product.rating}
              friendRecommendationCount={product.friendRecommendationCount}
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
