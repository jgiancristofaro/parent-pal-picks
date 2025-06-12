
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

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

export const useAdminUsers = ({ searchTerm = '', page = 0, pageSize = 50 }: UseAdminUsersProps = {}) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: users = [], isLoading, error } = useQuery({
    queryKey: ['admin-users', searchTerm, page, pageSize],
    queryFn: async (): Promise<AdminUser[]> => {
      const { data, error } = await supabase.rpc('admin_get_users', {
        search_term: searchTerm,
        page_limit: pageSize,
        page_offset: page * pageSize,
      });

      if (error) {
        console.error('Error fetching admin users:', error);
        throw error;
      }

      return data || [];
    },
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

      return data;
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
    error,
    suspendUser: suspendUserMutation.mutate,
    deleteUser: deleteUserMutation.mutate,
    isSuspending: suspendUserMutation.isPending,
    isDeleting: deleteUserMutation.isPending,
  };
};
