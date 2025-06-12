
import React from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, User, Edit, CheckCircle, XCircle } from 'lucide-react';
import { useAdminSitters } from '@/hooks/useAdminSitters';
import { format } from 'date-fns';

const AdminSitters = () => {
  const navigate = useNavigate();
  const {
    sitters,
    loading,
    searchTerm,
    searchSitters,
    setVerifiedStatus,
    loadMoreSitters,
    hasMorePages
  } = useAdminSitters();

  const handleVerifyToggle = async (sitterId: string, currentStatus: boolean) => {
    await setVerifiedStatus(sitterId, !currentStatus);
  };

  return (
    <AdminLayout>
      <div className="min-h-screen bg-gray-50">
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="py-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <User className="h-8 w-8 text-purple-600" />
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900">Sitter Management</h1>
                    <p className="text-gray-600">Manage sitter profiles, verification, and reviews</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                All Sitters
              </CardTitle>
              <div className="flex items-center space-x-2">
                <div className="relative flex-1 max-w-sm">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search sitters..."
                    value={searchTerm}
                    onChange={(e) => searchSitters(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {sitters.map((sitter) => (
                  <div key={sitter.id} className="border rounded-lg p-4 bg-white hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        {sitter.profile_image_url && (
                          <img
                            src={sitter.profile_image_url}
                            alt={sitter.name}
                            className="w-12 h-12 rounded-full object-cover"
                          />
                        )}
                        <div>
                          <h3 className="font-semibold text-lg">{sitter.name}</h3>
                          <div className="flex items-center gap-2">
                            <p className="text-gray-600">{sitter.email}</p>
                            {sitter.is_verified && (
                              <Badge variant="default" className="bg-green-100 text-green-800">
                                <CheckCircle className="h-3 w-3 mr-1" />
                                Verified
                              </Badge>
                            )}
                          </div>
                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            <span>Rating: {sitter.rating ? `${sitter.rating}/5` : 'No ratings'}</span>
                            <span>Reviews: {sitter.review_count || 0}</span>
                            <span>Joined: {format(new Date(sitter.created_at), 'MMM dd, yyyy')}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant={sitter.is_verified ? "outline" : "default"}
                          size="sm"
                          onClick={() => handleVerifyToggle(sitter.id, sitter.is_verified)}
                        >
                          {sitter.is_verified ? (
                            <>
                              <XCircle className="h-4 w-4 mr-1" />
                              Unverify
                            </>
                          ) : (
                            <>
                              <CheckCircle className="h-4 w-4 mr-1" />
                              Verify
                            </>
                          )}
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => navigate(`/admin/sitters/${sitter.id}`)}
                        >
                          <Edit className="h-4 w-4 mr-1" />
                          Edit
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}

                {loading && (
                  <div className="text-center py-8">
                    <div className="text-gray-500">Loading sitters...</div>
                  </div>
                )}

                {!loading && sitters.length === 0 && (
                  <div className="text-center py-8">
                    <div className="text-gray-500">No sitters found</div>
                  </div>
                )}

                {hasMorePages && !loading && (
                  <div className="text-center py-4">
                    <Button variant="outline" onClick={loadMoreSitters}>
                      Load More Sitters
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminSitters;
