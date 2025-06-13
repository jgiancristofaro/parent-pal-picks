
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ArrowLeft, Search, Edit, Shield, ShieldCheck, Loader2 } from 'lucide-react';
import { useAdminSitters } from '@/hooks/useAdminSitters';

const AdminSitters = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(0);
  const pageSize = 20;

  const { 
    sitters, 
    isLoading, 
    isFetching, 
    isSearching, 
    hasSearchTerm 
  } = useAdminSitters({
    searchTerm,
    page,
    pageSize,
  });

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setPage(0); // Reset to first page when searching
  };

  const renderSkeletonRows = () => (
    Array.from({ length: 5 }).map((_, index) => (
      <TableRow key={index}>
        <TableCell><Skeleton className="h-8 w-32" /></TableCell>
        <TableCell><Skeleton className="h-4 w-40" /></TableCell>
        <TableCell><Skeleton className="h-4 w-16" /></TableCell>
        <TableCell><Skeleton className="h-4 w-12" /></TableCell>
        <TableCell><Skeleton className="h-4 w-16" /></TableCell>
        <TableCell><Skeleton className="h-4 w-20" /></TableCell>
        <TableCell><Skeleton className="h-4 w-16" /></TableCell>
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
              <h1 className="text-3xl font-bold text-gray-900">Sitter Management</h1>
              <p className="text-gray-600">Manage and edit sitter profiles</p>
            </div>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>All Sitters</CardTitle>
            
            {/* Search Bar */}
            <div className="flex items-center gap-4">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search sitters by name or email..."
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
                  `Found ${sitters.length} sitter${sitters.length !== 1 ? 's' : ''} matching "${searchTerm}"`
                )}
              </div>
            )}
          </CardHeader>

          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Rating</TableHead>
                    <TableHead>Reviews</TableHead>
                    <TableHead>Verified</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    renderSkeletonRows()
                  ) : sitters.length > 0 ? (
                    sitters.map((sitter) => (
                      <TableRow key={sitter.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            {sitter.profile_image_url ? (
                              <img
                                src={sitter.profile_image_url}
                                alt={sitter.name}
                                className="w-8 h-8 rounded-full object-cover"
                              />
                            ) : (
                              <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                                <span className="text-xs font-medium text-gray-600">
                                  {sitter.name.charAt(0)}
                                </span>
                              </div>
                            )}
                            <span className="font-medium">{sitter.name}</span>
                          </div>
                        </TableCell>
                        <TableCell>{sitter.email || 'No email'}</TableCell>
                        <TableCell>
                          {sitter.rating ? `${sitter.rating}/5` : 'No rating'}
                        </TableCell>
                        <TableCell>{sitter.review_count}</TableCell>
                        <TableCell>
                          {sitter.is_verified ? (
                            <Badge variant="default" className="flex items-center gap-1">
                              <ShieldCheck className="w-3 h-3" />
                              Verified
                            </Badge>
                          ) : (
                            <Badge variant="secondary" className="flex items-center gap-1">
                              <Shield className="w-3 h-3" />
                              Unverified
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          {new Date(sitter.created_at).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => navigate(`/admin/sitters/${sitter.id}`)}
                            className="flex items-center gap-2"
                          >
                            <Edit className="w-4 h-4" />
                            Edit
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8">
                        {hasSearchTerm ? (
                          <div>
                            <p className="text-gray-500">No sitters found matching "{searchTerm}"</p>
                            <p className="text-sm text-gray-400 mt-1">Try adjusting your search terms</p>
                          </div>
                        ) : (
                          <p className="text-gray-500">No sitters found</p>
                        )}
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>

            {/* Pagination */}
            {!hasSearchTerm && sitters.length === pageSize && (
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
                  disabled={sitters.length < pageSize || isFetching}
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

export default AdminSitters;
