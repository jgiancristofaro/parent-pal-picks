
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

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
        <Input
          type="text"
          placeholder="Search by name, username, email, or phone..."
          value={searchTerm}
          onChange={(e) => onSearchTermChange(e.target.value)}
          onKeyPress={onKeyPress}
          className="pl-10 h-12 text-base"
          disabled={isLoading}
        />
      </div>
    </div>
  );
};
