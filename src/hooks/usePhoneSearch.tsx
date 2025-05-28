
import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { ProfileSearchResult } from '@/types/profile';
import { useToast } from '@/components/ui/use-toast';

export const usePhoneSearch = () => {
  const [searchResults, setSearchResults] = useState<ProfileSearchResult[]>([]);
  const { toast } = useToast();

  const searchByPhoneMutation = useMutation({
    mutationFn: async (phoneNumber: string) => {
      console.log('Searching for profile with phone number:', phoneNumber);

      const { data, error } = await supabase
        .rpc('search_profile_by_phone', {
          search_phone: phoneNumber
        });

      if (error) {
        console.error('Phone search error:', error);
        throw error;
      }

      console.log('Phone search results:', data);
      return data as ProfileSearchResult[];
    },
    onSuccess: (data) => {
      setSearchResults(data);
      if (data.length === 0) {
        toast({
          title: 'No results found',
          description: 'No users found with that phone number or they have not made their number searchable.',
        });
      } else {
        toast({
          title: 'Search complete',
          description: `Found ${data.length} user(s) with that phone number.`,
        });
      }
    },
    onError: (error) => {
      console.error('Phone search mutation error:', error);
      setSearchResults([]);
      toast({
        title: 'Search error',
        description: 'There was an error searching for users by phone number.',
        variant: 'destructive',
      });
    },
  });

  const clearResults = () => {
    setSearchResults([]);
  };

  return {
    searchResults,
    searchByPhone: searchByPhoneMutation.mutate,
    isSearching: searchByPhoneMutation.isPending,
    clearResults,
  };
};
