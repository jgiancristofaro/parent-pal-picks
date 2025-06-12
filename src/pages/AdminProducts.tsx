
import React from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, Package, Edit, CheckCircle, XCircle } from 'lucide-react';
import { useAdminProducts } from '@/hooks/useAdminProducts';
import { format } from 'date-fns';

const AdminProducts = () => {
  const navigate = useNavigate();
  const {
    products,
    loading,
    searchTerm,
    searchProducts,
    setVerifiedStatus,
    loadMoreProducts,
    hasMorePages
  } = useAdminProducts();

  const handleVerifyToggle = async (productId: string, currentStatus: boolean) => {
    await setVerifiedStatus(productId, !currentStatus);
  };

  return (
    <AdminLayout>
      <div className="min-h-screen bg-gray-50">
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="py-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Package className="h-8 w-8 text-purple-600" />
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900">Product Management</h1>
                    <p className="text-gray-600">Manage product listings, verification, and reviews</p>
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
                <Package className="h-5 w-5" />
                All Products
              </CardTitle>
              <div className="flex items-center space-x-2">
                <div className="relative flex-1 max-w-sm">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search products..."
                    value={searchTerm}
                    onChange={(e) => searchProducts(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {products.map((product) => (
                  <div key={product.id} className="border rounded-lg p-4 bg-white hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        {product.image_url && (
                          <img
                            src={product.image_url}
                            alt={product.name}
                            className="w-12 h-12 rounded object-cover"
                          />
                        )}
                        <div>
                          <h3 className="font-semibold text-lg">{product.name}</h3>
                          <div className="flex items-center gap-2">
                            <p className="text-gray-600">{product.brand_name}</p>
                            {product.category && (
                              <Badge variant="outline">{product.category}</Badge>
                            )}
                            {product.is_verified && (
                              <Badge variant="default" className="bg-green-100 text-green-800">
                                <CheckCircle className="h-3 w-3 mr-1" />
                                Verified
                              </Badge>
                            )}
                          </div>
                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            <span>Rating: {product.average_rating ? `${product.average_rating}/5` : 'No ratings'}</span>
                            <span>Reviews: {product.review_count || 0}</span>
                            {product.price && <span>Price: ${product.price}</span>}
                            <span>Added: {format(new Date(product.created_at), 'MMM dd, yyyy')}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant={product.is_verified ? "outline" : "default"}
                          size="sm"
                          onClick={() => handleVerifyToggle(product.id, product.is_verified)}
                        >
                          {product.is_verified ? (
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
                          onClick={() => navigate(`/admin/products/${product.id}`)}
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
                    <div className="text-gray-500">Loading products...</div>
                  </div>
                )}

                {!loading && products.length === 0 && (
                  <div className="text-center py-8">
                    <div className="text-gray-500">No products found</div>
                  </div>
                )}

                {hasMorePages && !loading && (
                  <div className="text-center py-4">
                    <Button variant="outline" onClick={loadMoreProducts}>
                      Load More Products
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

export default AdminProducts;
