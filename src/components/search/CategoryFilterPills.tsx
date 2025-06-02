
import { Button } from "@/components/ui/button";

interface Category {
  id: string;
  name: string;
}

interface CategoryFilterPillsProps {
  categories: Category[];
  selectedCategory: string | null;
  onCategoryClick: (category: string) => void;
}

export const CategoryFilterPills = ({ categories, selectedCategory, onCategoryClick }: CategoryFilterPillsProps) => {
  return (
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
            onClick={() => onCategoryClick(category.name)}
          >
            {category.name}
          </Button>
        ))}
      </div>
    </div>
  );
};
