
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Search, Edit, UserX, Trash2, ArrowLeft, Loader2, AlertCircle } from 'lucide-react';
import { useAdminUsers } from '@/hooks/useAdminUsers';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { format } from 'date-fns';

const AdminUsers = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(0);
  const pageSize = 20;

  const { 
    users, 
    isLoading, 
    isFetching, 
    isSearching, 
    hasSearchTerm, 
    suspendUser, 
    deleteUser, 
    isSuspending, 
    isDeleting,
    error
  } = useAdminUsers({
    searchTerm,
    page,
    pageSize,
  });

  const handleSuspendUser = (userId: string, currentName: string) => {
    const reason = prompt(`Please provide a reason for suspending ${currentName}:`);
    if (reason !== null) {
      suspendUser({ userId, reason });
    }
  };

  const handleDeleteUser = (userId: string, reason?: string) => {
    deleteUser({ userId, reason: reason || 'Admin deletion' });
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'ADMIN':
        return 'destructive';
      case 'MODERATOR':
        return 'secondary';
      default:
        return 'default';
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setPage(0); // Reset to first page when searching
  };

  const renderSkeletonRows = () => (
    Array.from({ length: 5 }).map((_, index) => (
      <TableRow key={index}>
        <TableCell><Skeleton className="h-4 w-32" /></TableCell>
        <TableCell><Skeleton className="h-4 w-24" /></TableCell>
        <TableCell><Skeleton className="h-4 w-40" /></TableCell>
        <TableCell><Skeleton className="h-4 w-16" /></TableCell>
        <TableCell><Skeleton className="h-4 w-16" /></TableCell>
        <TableCell><Skeleton className="h-4 w-20" /></TableCell>
        <TableCell><Skeleton className="h-4 w-20" /></TableCell>
        <TableCell><Skeleton className="h-4 w-24" /></TableCell>
      </TableRow>
    ))
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              onClick={() => navigate('/admin')}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Dashboard
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
              <p className="text-gray-600">Manage user accounts, suspensions, and deletions</p>
            </div>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>All Users</CardTitle>
            
            {/* Search Bar */}
            <div className="flex items-center gap-4">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search users by name, username, or email..."
                  value={searchTerm}
                  onChange={handleSearchChange}
                  className="pl-10"
                />
                {isSearching && (
                  <Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 animate-spin" />
                )}
              </div>
            </div>

            {/* Search Status */}
            {hasSearchTerm && (
              <div className="text-sm text-gray-600">
                {isSearching ? (
                  "Searching..."
                ) : (
                  `Found ${users.length} user${users.length !== 1 ? 's' : ''} matching "${searchTerm}"`
                )}
              </div>
            )}

            {/* Error Display */}
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Error loading users: {error.message}
                </AlertDescription>
              </Alert>
            )}
          </CardHeader>

          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Username</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead>Last Login</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    renderSkeletonRows()
                  ) : users.length > 0 ? (
                    users.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell className="font-medium">{user.full_name}</TableCell>
                        <TableCell>{user.username || '-'}</TableCell>
                        <TableCell>{user.email || '-'}</TableCell>
                        <TableCell>
                          <Badge variant={getRoleBadgeColor(user.role)}>
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
                              onClick={() => navigate(`/admin/users/${user.id}/edit`)}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleSuspendUser(user.id, user.full_name)}
                              disabled={isSuspending}
                              className={user.is_suspended ? 'text-green-600' : 'text-orange-600'}
                            >
                              <UserX className="w-4 h-4" />
                            </Button>

                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="text-red-600 hover:text-red-700"
                                  disabled={isDeleting}
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Delete User</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Are you sure you want to delete "{user.full_name}"? This action cannot be undone and will permanently delete the user's account and all associated data.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => {
                                      const reason = prompt('Please provide a reason for deletion:');
                                      if (reason !== null) {
                                        handleDeleteUser(user.id, reason);
                                      }
                                    }}
                                    className="bg-red-600 hover:bg-red-700"
                                  >
                                    Delete User
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-8">
                        {hasSearchTerm ? (
                          <div>
                            <p className="text-gray-500">No users found matching "{searchTerm}"</p>
                            <p className="text-sm text-gray-400 mt-1">Try adjusting your search terms</p>
                          </div>
                        ) : (
                          <p className="text-gray-500">No users found</p>
                        )}
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>

            {/* Pagination */}
            {!hasSearchTerm && users.length === pageSize && (
              <div className="flex justify-between items-center mt-4">
                <Button
                  variant="outline"
                  onClick={() => setPage(Math.max(0, page - 1))}
                  disabled={page === 0 || isFetching}
                >
                  Previous
                </Button>
                <span className="text-sm text-gray-500">
                  Page {page + 1}
                </span>
                <Button
                  variant="outline"
                  onClick={() => setPage(page + 1)}
                  disabled={users.length < pageSize || isFetching}
                >
                  Next
                </Button>
              </div>
            )}

            {/* Loading overlay for search */}
            {isFetching && !isLoading && (
              <div className="absolute inset-0 bg-white/50 flex items-center justify-center">
                <Loader2 className="w-6 h-6 animate-spin" />
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminUsers;
