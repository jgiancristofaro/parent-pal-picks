
import { Input } from "@/components/ui/input";
import { Search as SearchIcon } from "lucide-react";

interface ProductSearchInputProps {
  searchTerm: string;
  onSearchTermChange: (term: string) => void;
}

export const ProductSearchInput = ({ searchTerm, onSearchTermChange }: ProductSearchInputProps) => {
  return (
    <div className="relative mb-2">
      <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
      <Input 
        className="pl-10 py-3 bg-white rounded-lg border-gray-200" 
        placeholder="Search products by name, brand, category..."
        value={searchTerm}
        onChange={(e) => onSearchTermChange(e.target.value)}
      />
    </div>
  );
};
