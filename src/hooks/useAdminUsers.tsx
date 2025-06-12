
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

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

interface SuspendUserResponse {
  success: boolean;
  action: string;
  target_user_id: string;
  new_status: boolean;
}

interface DeleteUserResponse {
  success: boolean;
  action: string;
  target_user_id: string;
}

export const useAdminUsers = () => {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(0);
  const [hasMorePages, setHasMorePages] = useState(true);
  const { toast } = useToast();

  const pageSize = 25;

  const fetchUsers = async (search = searchTerm, page = 0, reset = false) => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase.rpc('admin_get_users', {
        search_term: search,
        page_limit: pageSize,
        page_offset: page * pageSize
      });

      if (error) {
        console.error('Error fetching users:', error);
        toast({
          title: "Error",
          description: "Failed to load users",
          variant: "destructive",
        });
        return;
      }

      const newUsers = data || [];
      
      if (reset || page === 0) {
        setUsers(newUsers);
      } else {
        setUsers(prev => [...prev, ...newUsers]);
      }
      
      setHasMorePages(newUsers.length === pageSize);
      setCurrentPage(page);
      
    } catch (error) {
      console.error('Error in fetchUsers:', error);
      toast({
        title: "Error",
        description: "Failed to load users",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const suspendUser = async (userId: string, reason: string) => {
    try {
      const { data, error } = await supabase.rpc('admin_suspend_user', {
        target_user_id: userId,
        suspend_reason: reason
      });

      if (error) {
        console.error('Error suspending user:', error);
        toast({
          title: "Error",
          description: "Failed to suspend user",
          variant: "destructive",
        });
        return false;
      }

      // Type assertion to handle the Json type from Supabase
      const response = data as unknown as SuspendUserResponse;

      // Update local state
      setUsers(prev => prev.map(user => 
        user.id === userId 
          ? { ...user, is_suspended: response.new_status }
          : user
      ));

      toast({
        title: "Success",
        description: `User ${response.new_status ? 'suspended' : 'unsuspended'} successfully`,
      });

      return true;
    } catch (error) {
      console.error('Error in suspendUser:', error);
      return false;
    }
  };

  const deleteUser = async (userId: string, reason: string) => {
    try {
      const { data, error } = await supabase.rpc('admin_delete_user', {
        target_user_id: userId,
        deletion_reason: reason
      });

      if (error) {
        console.error('Error deleting user:', error);
        toast({
          title: "Error",
          description: "Failed to delete user",
          variant: "destructive",
        });
        return false;
      }

      // Type assertion to handle the Json type from Supabase
      const response = data as unknown as DeleteUserResponse;

      // Remove user from local state
      setUsers(prev => prev.filter(user => user.id !== userId));

      toast({
        title: "Success",
        description: "User deleted successfully",
      });

      return true;
    } catch (error) {
      console.error('Error in deleteUser:', error);
      return false;
    }
  };

  const searchUsers = (term: string) => {
    setSearchTerm(term);
    fetchUsers(term, 0, true);
  };

  const loadMoreUsers = () => {
    if (!loading && hasMorePages) {
      fetchUsers(searchTerm, currentPage + 1, false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return {
    users,
    loading,
    searchTerm,
    searchUsers,
    suspendUser,
    deleteUser,
    loadMoreUsers,
    hasMorePages,
    refreshUsers: () => fetchUsers(searchTerm, 0, true)
  };
};
