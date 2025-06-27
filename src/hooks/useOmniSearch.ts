
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { useDebouncedSearch } from '@/hooks/useDebouncedSearch';

interface OmniSearchResult {
  id: string;
  name: string;
  image_url: string | null;
  description: string | null;
  result_type: 'parent' | 'sitter' | 'product';
  relevance_score: number;
  category: string;
  rating: number | null;
  metadata: any; // Changed from jsonb to json, but both serialize to any in TypeScript
}

export const useOmniSearch = (searchTerm: string) => {
  const [results, setResults] = useState<OmniSearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const debouncedSearchTerm = useDebouncedSearch(searchTerm, 300);

  useEffect(() => {
    const performSearch = async () => {
      if (!debouncedSearchTerm.trim()) {
        setResults([]);
        return;
      }

      setIsLoading(true);
      
      try {
        const { data, error } = await supabase.rpc('omni_search', {
          p_search_term: debouncedSearchTerm.trim()
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

        // Type assertion to ensure proper typing
        const typedResults: OmniSearchResult[] = (data || []).map((item: any) => ({
          ...item,
          result_type: item.result_type as 'parent' | 'sitter' | 'product'
        }));

        setResults(typedResults);
      } catch (error) {
        console.error('Search error:', error);
        toast({
          title: 'Search error',
          description: 'There was an error performing the search.',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    performSearch();
  }, [debouncedSearchTerm, toast]);

  return {
    results,
    isLoading,
    searchTerm: debouncedSearchTerm
  };
};
