
import { ProductCard } from "@/components/ProductCard";

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

interface ProductsGridProps {
  products: Product[];
}

export const ProductsGrid = ({ products }: ProductsGridProps) => {
  if (products.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No products found matching your filters</p>
        <p className="text-gray-400 text-sm mt-2">Try adjusting your search criteria or filters.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4">
      {products.map((product) => (
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
  );
};
