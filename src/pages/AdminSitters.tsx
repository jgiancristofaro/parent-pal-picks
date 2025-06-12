
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ArrowLeft, Search, Edit, Shield, ShieldCheck } from 'lucide-react';
import { useAdminSitters } from '@/hooks/useAdminSitters';

const AdminSitters = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const { sitters, isLoading } = useAdminSitters(searchTerm);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-8">
            <p className="text-gray-500">Loading sitters...</p>
          </div>
        </div>
      </div>
    );
  }

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

        {/* Search */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search sitters by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Sitters Table */}
        <Card>
          <CardHeader>
            <CardTitle>All Sitters ({sitters.length})</CardTitle>
          </CardHeader>
          <CardContent>
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
                {sitters.map((sitter) => (
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
                ))}
              </TableBody>
            </Table>

            {sitters.length === 0 && (
              <div className="text-center py-8">
                <p className="text-gray-500">No sitters found</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminSitters;
