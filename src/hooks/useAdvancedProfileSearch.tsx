
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface AdvancedSearchProfile {
  user_id: string;
  full_name: string;
  username: string | null;
  avatar_url: string | null;
  profile_privacy_setting: string;
  follow_status: 'following' | 'not_following' | 'request_pending';
  similarity_score: number;
  city: string | null;
  workplace: string | null;
}

interface UseAdvancedProfileSearchParams {
  searchTerm: string;
  city?: string;
  workplace?: string;
  pageNumber?: number;
  pageSize?: number;
}

export const useAdvancedProfileSearch = ({
  searchTerm,
  city,
  workplace,
  pageNumber = 1,
  pageSize = 20
}: UseAdvancedProfileSearchParams) => {
  return useQuery({
    queryKey: ['advanced-profile-search', searchTerm, city, workplace, pageNumber, pageSize],
    queryFn: async (): Promise<AdvancedSearchProfile[]> => {
      if (!searchTerm.trim()) return [];
      
      console.log('Performing advanced profile search:', {
        searchTerm,
        city,
        workplace,
        pageNumber
      });
      
      const { data, error } = await supabase
        .rpc('search_profiles_advanced', {
          p_search_term: searchTerm.trim(),
          p_city: city || null,
          p_workplace: workplace || null,
          p_page_number: pageNumber,
          p_page_size: pageSize
        });

      if (error) {
        console.error('Error performing advanced profile search:', error);
        throw error;
      }

      console.log('Advanced search results found:', data?.length || 0);
      return data || [];
    },
    enabled: !!searchTerm.trim(),
  });
};
