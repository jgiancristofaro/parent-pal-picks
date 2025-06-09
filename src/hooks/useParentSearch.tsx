
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { useDebouncedSearch } from "./useDebouncedSearch";

interface ProfileWithFollowStatus {
  id: string;
  full_name: string;
  username: string | null;
  avatar_url: string | null;
  profile_privacy_setting: string;
  follow_status: 'following' | 'request_pending' | 'not_following';
  similarity_score?: number;
  mutual_connections_count?: number;
}

export const useParentSearch = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState<ProfileWithFollowStatus[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  
  // Debounce the search term by 300ms
  const debouncedSearchTerm = useDebouncedSearch(searchTerm, 300);

  const fetchData = async (term: string) => {
    setIsLoading(true);
    
    try {
      if (!term.trim()) {
        // Fetch suggested profiles when search is empty
        const { data, error } = await supabase.rpc('get_suggested_profiles');

        if (error) {
          console.error('Suggested profiles error:', error);
          toast({
            title: 'Error loading suggestions',
            description: 'There was an error loading suggested profiles.',
            variant: 'destructive',
          });
          return;
        }

        // Type assertion for suggested profiles
        const typedResults: ProfileWithFollowStatus[] = (data || []).map((result: any) => ({
          ...result,
          follow_status: result.follow_status as 'following' | 'request_pending' | 'not_following'
        }));

        setResults(typedResults);
      } else {
        // Fetch search results when there's a search term
        const { data, error } = await supabase.rpc('search_all_profiles', {
          search_term: term.trim()
        });

        if (error) {
          console.error('Search error:', error);
          toast({
            title: 'Search error',
            description: 'There was an error searching for users.',
            variant: 'destructive',
          });
          return;
        }

        // Type assertion for search results
        const typedResults: ProfileWithFollowStatus[] = (data || []).map((result: any) => ({
          ...result,
          follow_status: result.follow_status as 'following' | 'request_pending' | 'not_following'
        }));

        setResults(typedResults);
      }
    } catch (error) {
      console.error('Data fetch error:', error);
      toast({
        title: 'Error',
        description: 'There was an error loading profiles.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Effect to fetch data when debounced search term changes
  useEffect(() => {
    fetchData(debouncedSearchTerm);
  }, [debouncedSearchTerm]);

  const refreshResults = () => {
    fetchData(debouncedSearchTerm);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      fetchData(searchTerm);
    }
  };

  return {
    searchTerm,
    setSearchTerm,
    results,
    isLoading,
    handleKeyPress,
    refreshResults,
    isSearchActive: !!searchTerm.trim()
  };
};
