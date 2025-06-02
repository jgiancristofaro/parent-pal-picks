
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

interface SearchByNameCardProps {
  searchTerm: string;
  onSearchTermChange: (value: string) => void;
  onSearch: () => void;
  onKeyPress: (e: React.KeyboardEvent) => void;
  isSearching: boolean;
}

export const SearchByNameCard = ({
  searchTerm,
  onSearchTermChange,
  onSearch,
  onKeyPress,
  isSearching
}: SearchByNameCardProps) => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
      <h3 className="text-lg font-semibold mb-3">Search by Name</h3>
      <div className="relative mb-3">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
        <Input 
          className="pl-10 py-3" 
          placeholder="Search by name or username..."
          value={searchTerm}
          onChange={(e) => onSearchTermChange(e.target.value)}
          onKeyPress={onKeyPress}
        />
      </div>
      <Button 
        onClick={onSearch} 
        className="w-full"
        disabled={!searchTerm.trim() || isSearching}
      >
        {isSearching ? 'Searching...' : 'Search'}
      </Button>
    </div>
  );
};
