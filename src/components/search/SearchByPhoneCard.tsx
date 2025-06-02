
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Phone } from "lucide-react";

interface SearchByPhoneCardProps {
  phoneNumber: string;
  onPhoneNumberChange: (value: string) => void;
  onSearch: () => void;
  onKeyPress: (e: React.KeyboardEvent) => void;
  isSearching: boolean;
}

export const SearchByPhoneCard = ({
  phoneNumber,
  onPhoneNumberChange,
  onSearch,
  onKeyPress,
  isSearching
}: SearchByPhoneCardProps) => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
      <h3 className="text-lg font-semibold mb-3">Search by Phone Number</h3>
      <div className="relative mb-3">
        <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
        <Input 
          className="pl-10 py-3" 
          placeholder="Enter phone number..."
          value={phoneNumber}
          onChange={(e) => onPhoneNumberChange(e.target.value)}
          onKeyPress={onKeyPress}
        />
      </div>
      <Button 
        onClick={onSearch} 
        className="w-full"
        disabled={!phoneNumber.trim() || isSearching}
      >
        {isSearching ? 'Searching...' : 'Search'}
      </Button>
    </div>
  );
};
