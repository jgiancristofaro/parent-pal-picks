
import { Input } from "@/components/ui/input";
import { Search, Loader2 } from "lucide-react";

interface OmniSearchInputProps {
  searchTerm: string;
  onSearchTermChange: (term: string) => void;
  onKeyPress: (e: React.KeyboardEvent) => void;
  isLoading: boolean;
}

export const OmniSearchInput = ({
  searchTerm,
  onSearchTermChange,
  onKeyPress,
  isLoading
}: OmniSearchInputProps) => {
  return (
    <div className="relative mb-6">
      <div className="relative">
        <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        {isLoading && (
          <Loader2 size={16} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 animate-spin" />
        )}
        <Input
          type="text"
          placeholder="Search by name, username, email, or phone..."
          value={searchTerm}
          onChange={(e) => onSearchTermChange(e.target.value)}
          onKeyPress={onKeyPress}
          className="pl-10 pr-10 h-12 text-base"
        />
      </div>
    </div>
  );
};
