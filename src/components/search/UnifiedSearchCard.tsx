
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

interface UnifiedSearchCardProps {
  searchTerm: string;
  onSearchTermChange: (term: string) => void;
  onSearch: () => void;
  onKeyPress: (e: React.KeyboardEvent) => void;
  isSearching: boolean;
}

export const UnifiedSearchCard = ({
  searchTerm,
  onSearchTermChange,
  onSearch,
  onKeyPress,
  isSearching
}: UnifiedSearchCardProps) => {
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-gray-900">
          Search for Parents
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            Search by name, username, or phone number. Our intelligent search will find exact and similar matches.
          </p>
          <div className="flex gap-2">
            <Input
              type="text"
              placeholder="Enter name, username, or phone number..."
              value={searchTerm}
              onChange={(e) => onSearchTermChange(e.target.value)}
              onKeyPress={onKeyPress}
              className="flex-1"
            />
            <Button 
              onClick={onSearch}
              disabled={isSearching || !searchTerm.trim()}
              className="px-6"
            >
              <Search size={16} className="mr-2" />
              {isSearching ? 'Searching...' : 'Search'}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
