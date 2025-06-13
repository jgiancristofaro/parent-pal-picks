
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useDebouncedSearch } from "@/hooks/useDebouncedSearch";
import type { AdminSitter, UseAdminSittersProps } from "./types";

export const useAdminSitters = ({ searchTerm = '', page = 0, pageSize = 50 }: UseAdminSittersProps = {}) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // Debounce search term with 500ms delay
  const debouncedSearchTerm = useDebouncedSearch(searchTerm, 500);
  
  // Only search if term is at least 2 characters or empty (for initial load)
  const shouldSearch = debouncedSearchTerm.length === 0 || debouncedSearchTerm.length >= 2;
  const effectiveSearchTerm = shouldSearch ? debouncedSearchTerm : '';

  const { data: sitters = [], isLoading, error, isFetching } = useQuery({
    queryKey: ['admin-sitters', effectiveSearchTerm, page, pageSize],
    queryFn: async (): Promise<AdminSitter[]> => {
      console.log('Fetching admin sitters with search term:', effectiveSearchTerm);
      
      const { data, error } = await supabase.rpc('admin_get_all_sitters', {
        search_term: effectiveSearchTerm,
        page_limit: pageSize,
        page_offset: page * pageSize,
      });

      if (error) {
        console.error('Error fetching admin sitters:', error);
        toast({
          title: "Error",
          description: `Failed to fetch sitters: ${error.message}`,
          variant: "destructive",
        });
        throw error;
      }

      console.log('Successfully fetched admin sitters:', data?.length || 0, 'results');
      return data || [];
    },
    enabled: shouldSearch, // Only run query when search criteria is met
    staleTime: 30000, // Cache for 30 seconds
    gcTime: 5 * 60 * 1000, // Keep in cache for 5 minutes
  });

  return {
    sitters,
    isLoading,
    isFetching,
    error,
    isSearching: !shouldSearch || (searchTerm !== debouncedSearchTerm),
    hasSearchTerm: debouncedSearchTerm.length > 0,
  };
};
