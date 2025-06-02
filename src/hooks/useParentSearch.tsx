
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

interface ProfileWithFollowStatus {
  id: string;
  full_name: string;
  username: string | null;
  avatar_url: string | null;
  profile_privacy_setting: string;
  follow_status: 'following' | 'request_pending' | 'not_following';
}

export const useParentSearch = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [searchResults, setSearchResults] = useState<ProfileWithFollowStatus[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const { toast } = useToast();

  const searchProfiles = async (term?: string, phone?: string) => {
    if (!term && !phone) return [];

    setIsSearching(true);
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase.functions.invoke('search_profiles_v2', {
        body: {
          search_term: term || undefined,
          search_phone: phone || undefined,
          current_user_id: user.id
        }
      });

      if (error) {
        // Check if it's a rate limiting error
        if (error.message?.includes('Rate limit exceeded')) {
          toast({
            title: 'Search limit reached',
            description: phone 
              ? 'You\'ve reached the phone search limit. Please wait before searching again.'
              : 'You\'ve reached the search limit. Please wait before searching again.',
            variant: 'destructive',
          });
          return [];
        }
        throw error;
      }
      return data || [];
    } catch (error) {
      console.error('Search error:', error);
      toast({
        title: 'Search error',
        description: 'There was an error searching for users.',
        variant: 'destructive',
      });
      return [];
    } finally {
      setIsSearching(false);
    }
  };

  const handleNameSearch = async () => {
    if (!searchTerm.trim()) return;
    const results = await searchProfiles(searchTerm);
    setSearchResults(results);
  };

  const handlePhoneSearch = async () => {
    if (!phoneNumber.trim()) return;
    const results = await searchProfiles(undefined, phoneNumber);
    setSearchResults(results);
  };

  const handleKeyPress = (e: React.KeyboardEvent, searchType: 'name' | 'phone') => {
    if (e.key === 'Enter') {
      if (searchType === 'name') {
        handleNameSearch();
      } else {
        handlePhoneSearch();
      }
    }
  };

  const refreshResults = () => {
    if (searchTerm) handleNameSearch();
    if (phoneNumber) handlePhoneSearch();
  };

  return {
    searchTerm,
    setSearchTerm,
    phoneNumber,
    setPhoneNumber,
    searchResults,
    isSearching,
    handleNameSearch,
    handlePhoneSearch,
    handleKeyPress,
    refreshResults
  };
};
