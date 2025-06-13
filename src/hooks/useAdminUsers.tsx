
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useDebouncedSearch } from "@/hooks/useDebouncedSearch";

interface AdminUser {
  id: string;
  full_name: string;
  username: string | null;
  email: string | null;
  phone_number: string | null;
  role: string;
  is_suspended: boolean;
  created_at: string;
  last_login_at: string | null;
}

interface UseAdminUsersProps {
  searchTerm?: string;
  page?: number;
  pageSize?: number;
}

interface SuspendUserResponse {
  success: boolean;
  action: string;
  target_user_id: string;
  new_status: boolean;
}

export const useAdminUsers = ({ searchTerm = '', page = 0, pageSize = 50 }: UseAdminUsersProps = {}) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // Debounce search term with 500ms delay
  const debouncedSearchTerm = useDebouncedSearch(searchTerm, 500);
  
  // Only search if term is at least 2 characters or empty (for initial load)
  const shouldSearch = debouncedSearchTerm.length === 0 || debouncedSearchTerm.length >= 2;
  const effectiveSearchTerm = shouldSearch ? debouncedSearchTerm : '';

  const { data: users = [], isLoading, error, isFetching } = useQuery({
    queryKey: ['admin-users', effectiveSearchTerm, page, pageSize],
    queryFn: async (): Promise<AdminUser[]> => {
      console.log('Fetching admin users with search term:', effectiveSearchTerm);
      
      const { data, error } = await supabase.rpc('admin_get_users', {
        search_term: effectiveSearchTerm,
        page_limit: pageSize,
        page_offset: page * pageSize,
      });

      if (error) {
        console.error('Error fetching admin users:', error);
        toast({
          title: "Error",
          description: `Failed to fetch users: ${error.message}`,
          variant: "destructive",
        });
        throw error;
      }

      console.log('Successfully fetched admin users:', data?.length || 0, 'results');
      return data || [];
    },
    enabled: shouldSearch, // Only run query when search criteria is met
    staleTime: 30000, // Cache for 30 seconds
    gcTime: 5 * 60 * 1000, // Keep in cache for 5 minutes
  });

  const suspendUserMutation = useMutation({
    mutationFn: async ({ userId, reason }: { userId: string; reason?: string }) => {
      const { data, error } = await supabase.rpc('admin_suspend_user', {
        target_user_id: userId,
        suspend_reason: reason || 'No reason provided',
      });

      if (error) {
        console.error('Error suspending user:', error);
        throw error;
      }

      return data as unknown as SuspendUserResponse;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      toast({
        title: "Success",
        description: `User ${data.action === 'suspend_user' ? 'suspended' : 'unsuspended'} successfully`,
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to update user: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  const deleteUserMutation = useMutation({
    mutationFn: async ({ userId, reason }: { userId: string; reason?: string }) => {
      const { data, error } = await supabase.rpc('admin_delete_user', {
        target_user_id: userId,
        deletion_reason: reason || 'No reason provided',
      });

      if (error) {
        console.error('Error deleting user:', error);
        throw error;
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      toast({
        title: "Success",
        description: "User deleted successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to delete user: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  return {
    users,
    isLoading,
    isFetching,
    error,
    isSearching: !shouldSearch || (searchTerm !== debouncedSearchTerm),
    hasSearchTerm: debouncedSearchTerm.length > 0,
    suspendUser: suspendUserMutation.mutate,
    deleteUser: deleteUserMutation.mutate,
    isSuspending: suspendUserMutation.isPending,
    isDeleting: deleteUserMutation.isPending,
  };
};
