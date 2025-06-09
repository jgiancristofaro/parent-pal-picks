
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

interface UnifiedSearchResult {
  id: string;
  full_name: string;
  username: string | null;
  avatar_url: string | null;
  profile_privacy_setting: string;
  follow_status: 'following' | 'request_pending' | 'not_following';
  similarity_score: number;
}

export const useUnifiedSearch = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<UnifiedSearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const { toast } = useToast();

  const performSearch = async (term?: string) => {
    const searchQuery = term || searchTerm;
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    
    try {
      const { data, error } = await supabase.rpc('search_all_profiles', {
        search_term: searchQuery.trim()
      });

      if (error) {
        console.error('Unified search error:', error);
        toast({
          title: 'Search error',
          description: 'There was an error searching for users.',
          variant: 'destructive',
        });
        return;
      }

      // Type assertion to ensure follow_status matches our expected union type
      const typedResults: UnifiedSearchResult[] = (data || []).map((result: any) => ({
        ...result,
        follow_status: result.follow_status as 'following' | 'request_pending' | 'not_following'
      }));

      setSearchResults(typedResults);
    } catch (error) {
      console.error('Search error:', error);
      toast({
        title: 'Search error',
        description: 'There was an error searching for users.',
        variant: 'destructive',
      });
    } finally {
      setIsSearching(false);
    }
  };

  const handleSearch = () => {
    performSearch();
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      performSearch();
    }
  };

  const refreshResults = () => {
    if (searchTerm) {
      performSearch();
    }
  };

  return {
    searchTerm,
    setSearchTerm,
    searchResults,
    isSearching,
    handleSearch,
    handleKeyPress,
    refreshResults
  };
};
