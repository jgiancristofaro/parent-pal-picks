
import { Input } from "@/components/ui/input";
import { Search as SearchIcon } from "lucide-react";

interface SearchInputProps {
  searchTerm: string;
  onSearchTermChange: (term: string) => void;
}

export const SearchInput = ({ searchTerm, onSearchTermChange }: SearchInputProps) => {
  return (
    <div className="relative mb-4">
      <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
      <Input 
        className="pl-10 py-3 bg-white rounded-lg border-gray-200" 
        placeholder="Search sitters by name..."
        value={searchTerm}
        onChange={(e) => onSearchTermChange(e.target.value)}
      />
    </div>
  );
};
