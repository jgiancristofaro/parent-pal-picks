
import React, { useState } from 'react';
import { format } from 'date-fns';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Search, UserMinus, UserX, Edit, Shield, User } from 'lucide-react';
import { useAdminUsers } from '@/hooks/useAdminUsers';

export const UserManagementTable = () => {
  const {
    users,
    loading,
    searchTerm,
    searchUsers,
    suspendUser,
    deleteUser,
    loadMoreUsers,
    hasMorePages
  } = useAdminUsers();

  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean;
    userId: string;
    userName: string;
  }>({ open: false, userId: '', userName: '' });

  const [suspendDialog, setSuspendDialog] = useState<{
    open: boolean;
    userId: string;
    userName: string;
    currentStatus: boolean;
  }>({ open: false, userId: '', userName: '', currentStatus: false });

  const [actionReason, setActionReason] = useState('');

  const handleSuspendClick = (userId: string, userName: string, currentStatus: boolean) => {
    setSuspendDialog({ open: true, userId, userName, currentStatus });
    setActionReason('');
  };

  const handleDeleteClick = (userId: string, userName: string) => {
    setDeleteDialog({ open: true, userId, userName });
    setActionReason('');
  };

  const handleSuspendConfirm = async () => {
    if (!actionReason.trim()) {
      return;
    }

    const success = await suspendUser(suspendDialog.userId, actionReason);
    if (success) {
      setSuspendDialog({ open: false, userId: '', userName: '', currentStatus: false });
      setActionReason('');
    }
  };

  const handleDeleteConfirm = async () => {
    if (!actionReason.trim()) {
      return;
    }

    const success = await deleteUser(deleteDialog.userId, actionReason);
    if (success) {
      setDeleteDialog({ open: false, userId: '', userName: '' });
      setActionReason('');
    }
  };

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case 'ADMIN':
        return 'destructive';
      case 'MODERATOR':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  const getRoleIcon = (role: string) => {
    return role === 'ADMIN' ? Shield : User;
  };

  return (
    <div className="space-y-6">
      {/* Search */}
      <div className="flex items-center space-x-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => searchUsers(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Users Table */}
      <div className="border rounded-lg bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Joined</TableHead>
              <TableHead>Last Login</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => {
              const RoleIcon = getRoleIcon(user.role);
              return (
                <TableRow key={user.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{user.full_name}</div>
                      {user.username && (
                        <div className="text-sm text-gray-500">@{user.username}</div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      {user.email && (
                        <div className="text-sm">{user.email}</div>
                      )}
                      {user.phone_number && (
                        <div className="text-sm text-gray-500">{user.phone_number}</div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getRoleBadgeVariant(user.role)} className="flex items-center gap-1 w-fit">
                      <RoleIcon className="h-3 w-3" />
                      {user.role}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={user.is_suspended ? 'destructive' : 'default'}>
                      {user.is_suspended ? 'Suspended' : 'Active'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {format(new Date(user.created_at), 'MMM dd, yyyy')}
                  </TableCell>
                  <TableCell>
                    {user.last_login_at 
                      ? format(new Date(user.last_login_at), 'MMM dd, yyyy')
                      : 'Never'
                    }
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleSuspendClick(user.id, user.full_name, user.is_suspended)}
                      >
                        <UserMinus className="h-4 w-4" />
                        {user.is_suspended ? 'Unsuspend' : 'Suspend'}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteClick(user.id, user.full_name)}
                      >
                        <UserX className="h-4 w-4" />
                        Delete
                      </Button>
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4" />
                        Edit
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
        
        {loading && (
          <div className="text-center py-8">
            <div className="text-gray-500">Loading users...</div>
          </div>
        )}

        {!loading && users.length === 0 && (
          <div className="text-center py-8">
            <div className="text-gray-500">No users found</div>
          </div>
        )}

        {hasMorePages && !loading && (
          <div className="text-center py-4 border-t">
            <Button variant="outline" onClick={loadMoreUsers}>
              Load More Users
            </Button>
          </div>
        )}
      </div>

      {/* Suspend Dialog */}
      <Dialog open={suspendDialog.open} onOpenChange={(open) => 
        setSuspendDialog({ open, userId: '', userName: '', currentStatus: false })
      }>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {suspendDialog.currentStatus ? 'Unsuspend' : 'Suspend'} User
            </DialogTitle>
            <DialogDescription>
              {suspendDialog.currentStatus 
                ? `Are you sure you want to unsuspend ${suspendDialog.userName}? This will restore their access to the platform.`
                : `Are you sure you want to suspend ${suspendDialog.userName}? This will prevent them from accessing the platform.`
              }
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Reason (required)</label>
              <Textarea
                value={actionReason}
                onChange={(e) => setActionReason(e.target.value)}
                placeholder={`Reason for ${suspendDialog.currentStatus ? 'unsuspending' : 'suspending'} this user...`}
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setSuspendDialog({ open: false, userId: '', userName: '', currentStatus: false })}
            >
              Cancel
            </Button>
            <Button
              variant={suspendDialog.currentStatus ? 'default' : 'destructive'}
              onClick={handleSuspendConfirm}
              disabled={!actionReason.trim()}
            >
              {suspendDialog.currentStatus ? 'Unsuspend' : 'Suspend'} User
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={deleteDialog.open} onOpenChange={(open) => 
        setDeleteDialog({ open, userId: '', userName: '' })
      }>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete User</DialogTitle>
            <DialogDescription>
              Are you sure you want to permanently delete {deleteDialog.userName}? 
              This action cannot be undone and will remove all their data from the platform.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Reason for deletion (required)</label>
              <Textarea
                value={actionReason}
                onChange={(e) => setActionReason(e.target.value)}
                placeholder="Reason for deleting this user..."
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialog({ open: false, userId: '', userName: '' })}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteConfirm}
              disabled={!actionReason.trim()}
            >
              Delete User
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
