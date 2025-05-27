
import { Input } from "@/components/ui/input";
import { Search as SearchIcon } from "lucide-react";

interface SearchFiltersProps {
  location: string;
  onLocationChange: (location: string) => void;
}

export const SearchFilters = ({ location, onLocationChange }: SearchFiltersProps) => {
  return (
    <div className="relative mb-6">
      <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
      <Input 
        className="pl-10 py-6 bg-white rounded-lg border-gray-200" 
        placeholder="Search by location"
        value={location}
        onChange={(e) => onLocationChange(e.target.value)}
      />
    </div>
  );
};
