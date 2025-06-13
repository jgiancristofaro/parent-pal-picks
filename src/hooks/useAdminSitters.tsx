
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useDebouncedSearch } from "@/hooks/useDebouncedSearch";

interface AdminSitter {
  id: string;
  name: string;
  profile_image_url: string | null;
  bio: string | null;
  experience: string | null;
  hourly_rate: number | null;
  phone_number: string | null;
  email: string | null;
  certifications: string[] | null;
  rating: number | null;
  review_count: number;
  is_verified: boolean;
  created_at: string;
  updated_at: string;
}

interface AdminReview {
  id: string;
  user_id: string;
  user_full_name: string;
  rating: number;
  title: string;
  content: string;
  created_at: string;
  updated_at: string;
}

interface UseAdminSittersProps {
  searchTerm?: string;
  page?: number;
  pageSize?: number;
}

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
      const { data, error } = await supabase.rpc('admin_get_all_sitters', {
        search_term: effectiveSearchTerm,
        page_limit: pageSize,
        page_offset: page * pageSize,
      });

      if (error) {
        console.error('Error fetching admin sitters:', error);
        throw error;
      }

      return data || [];
    },
    enabled: shouldSearch, // Only run query when search criteria is met
    staleTime: 30000, // Cache for 30 seconds
    gcTime: 5 * 60 * 1000, // Keep in cache for 5 minutes
  });

  const updateSitterMutation = useMutation({
    mutationFn: async (params: {
      sitterId: string;
      name?: string;
      profileImageUrl?: string;
      bio?: string;
      experience?: string;
      hourlyRate?: number;
      phoneNumber?: string;
      email?: string;
      certifications?: string[];
    }) => {
      const { data, error } = await supabase.rpc('admin_update_sitter_details', {
        target_sitter_id: params.sitterId,
        new_name: params.name,
        new_profile_image_url: params.profileImageUrl,
        new_bio: params.bio,
        new_experience: params.experience,
        new_hourly_rate: params.hourlyRate,
        new_phone_number: params.phoneNumber,
        new_email: params.email,
        new_certifications: params.certifications,
      });

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-sitters'] });
      toast({
        title: "Success",
        description: "Sitter updated successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: `Failed to update sitter: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  const setVerifiedStatusMutation = useMutation({
    mutationFn: async ({ sitterId, verified }: { sitterId: string; verified: boolean }) => {
      const { data, error } = await supabase.rpc('admin_set_verified_status', {
        item_type: 'sitter',
        item_id: sitterId,
        verified_status: verified,
      });

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-sitters'] });
      toast({
        title: "Success",
        description: "Sitter verification status updated",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: `Failed to update verification: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  const mergeDuplicatesMutation = useMutation({
    mutationFn: async ({ sourceId, targetId, reason }: { sourceId: string; targetId: string; reason?: string }) => {
      const { data, error } = await supabase.rpc('admin_merge_duplicates', {
        item_type: 'sitter',
        source_id: sourceId,
        target_id: targetId,
        merge_reason: reason || 'Duplicate merge',
      });

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-sitters'] });
      toast({
        title: "Success",
        description: "Sitters merged successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: `Failed to merge sitters: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  return {
    sitters,
    isLoading,
    isFetching,
    error,
    isSearching: !shouldSearch || (searchTerm !== debouncedSearchTerm),
    hasSearchTerm: debouncedSearchTerm.length > 0,
    updateSitter: updateSitterMutation.mutate,
    setVerifiedStatus: setVerifiedStatusMutation.mutate,
    mergeDuplicates: mergeDuplicatesMutation.mutate,
    isUpdating: updateSitterMutation.isPending,
    isSettingVerification: setVerifiedStatusMutation.isPending,
    isMerging: mergeDuplicatesMutation.isPending,
  };
};

export const useAdminSitterReviews = (sitterId: string) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: reviews = [], isLoading } = useQuery({
    queryKey: ['admin-sitter-reviews', sitterId],
    queryFn: async (): Promise<AdminReview[]> => {
      const { data, error } = await supabase.rpc('admin_get_item_reviews', {
        item_type: 'sitter',
        item_id: sitterId,
      });

      if (error) throw error;
      return data || [];
    },
    enabled: !!sitterId,
  });

  const deleteReviewMutation = useMutation({
    mutationFn: async ({ reviewId, reason }: { reviewId: string; reason?: string }) => {
      const { data, error } = await supabase.rpc('admin_delete_review', {
        review_id: reviewId,
        deletion_reason: reason || 'Admin deletion',
      });

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-sitter-reviews'] });
      toast({
        title: "Success",
        description: "Review deleted successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: `Failed to delete review: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  return {
    reviews,
    isLoading,
    deleteReview: deleteReviewMutation.mutate,
    isDeleting: deleteReviewMutation.isPending,
  };
};
