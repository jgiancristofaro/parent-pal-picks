
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

interface OmniSearchResult {
  id: string;
  name: string;
  image_url: string | null;
  description: string | null;
  result_type: 'parent' | 'sitter' | 'product';
  relevance_score: number;
  category: string;
  rating: number | null;
  metadata: any;
}

export const useOmniSearch = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<OmniSearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const { toast } = useToast();

  const performOmniSearch = async (term?: string) => {
    const searchQuery = term || searchTerm;
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    
    try {
      const { data, error } = await supabase.rpc('omni_search', {
        p_search_term: searchQuery.trim()
      });

      if (error) {
        console.error('Omni search error:', error);
        toast({
          title: 'Search error',
          description: 'There was an error performing the search.',
          variant: 'destructive',
        });
        return;
      }

      setSearchResults(data || []);
    } catch (error) {
      console.error('Search error:', error);
      toast({
        title: 'Search error',
        description: 'There was an error performing the search.',
        variant: 'destructive',
      });
    } finally {
      setIsSearching(false);
    }
  };

  const handleSearch = () => {
    performOmniSearch();
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      performOmniSearch();
    }
  };

  return {
    searchTerm,
    setSearchTerm,
    searchResults,
    isSearching,
    handleSearch,
    handleKeyPress,
    performOmniSearch
  };
};
