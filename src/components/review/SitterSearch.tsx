
import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search as SearchIcon } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useDebouncedSearch } from "@/hooks/useDebouncedSearch";
import { SitterSearchResultCard } from "./SitterSearchResultCard";

interface DatabaseSitter {
  id: string;
  name: string;
  experience: string | null;
  profile_image_url: string | null;
  hourly_rate: number | null;
}

interface TransformedSitter {
  id: string;
  name: string;
  image: string;
  rating: number;
  experience?: string;
  friendRecommendationCount: number;
  workedInUserLocationNickname?: string;
}

interface SitterSearchProps {
  onSitterSelect: (sitter: TransformedSitter) => void;
  onCreateNew: () => void;
  onBack: () => void;
}

export const SitterSearch = ({ onSitterSelect, onCreateNew, onBack }: SitterSearchProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<DatabaseSitter[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const { toast } = useToast();
  
  const debouncedSearchTerm = useDebouncedSearch(searchTerm, 300);

  useEffect(() => {
    if (debouncedSearchTerm.trim()) {
      searchSitters(debouncedSearchTerm);
    } else {
      setSearchResults([]);
    }
  }, [debouncedSearchTerm]);

  const searchSitters = async (term: string) => {
    setIsSearching(true);
    
    try {
      const { data, error } = await supabase
        .from("sitters")
        .select("id, name, experience, profile_image_url, hourly_rate")
        .or(`name.ilike.%${term}%,phone_number.ilike.%${term}%`)
        .order("name");

      if (error) {
        console.error("Error searching sitters:", error);
        toast({
          title: "Search Error",
          description: "Failed to search for sitters",
          variant: "destructive",
        });
      } else {
        setSearchResults(data || []);
      }
    } catch (error) {
      console.error("Search error:", error);
      toast({
        title: "Search Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsSearching(false);
    }
  };

  const transformSitter = (sitter: DatabaseSitter): TransformedSitter => {
    return {
      id: sitter.id,
      name: sitter.name,
      image: sitter.profile_image_url || "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=2487&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      rating: 0, // Default rating since we don't have it in the database query
      experience: sitter.experience || undefined,
      friendRecommendationCount: 0, // Default value
    };
  };

  const showNoResults = debouncedSearchTerm.trim() && !isSearching && searchResults.length === 0;

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Find an Existing Sitter to Review
        </h2>
        <p className="text-gray-600">
          Search for a sitter by name, email, or phone number
        </p>
      </div>

      <div className="relative">
        <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
        <Input 
          className="pl-10 py-3 bg-white rounded-lg border-gray-200" 
          placeholder="Search by Sitter's Name, Email, or Phone"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {isSearching && (
        <div className="text-center py-8">
          <p className="text-gray-600">Searching...</p>
        </div>
      )}

      {searchResults.length > 0 && (
        <div className="space-y-3">
          <h3 className="font-semibold text-gray-800">Search Results</h3>
          {searchResults.map((sitter) => (
            <SitterSearchResultCard
              key={sitter.id}
              sitter={transformSitter(sitter)}
              onSelectSitter={onSitterSelect}
            />
          ))}
        </div>
      )}

      {showNoResults && (
        <div className="text-center py-8 space-y-4">
          <p className="text-gray-600">
            No sitters found matching your search. Would you like to{" "}
            <button
              onClick={onCreateNew}
              className="text-purple-600 hover:text-purple-700 underline font-medium"
            >
              Create a New Sitter Profile to Review
            </button>
            ?
          </p>
        </div>
      )}

      <div className="flex justify-center">
        <Button
          onClick={onBack}
          variant="outline"
          className="px-6 py-2"
        >
          Back
        </Button>
      </div>
    </div>
  );
};
