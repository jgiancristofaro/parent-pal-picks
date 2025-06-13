
import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ArrowLeft, Save, Trash2, Merge } from 'lucide-react';
import { useAdminProduct } from '@/hooks/useAdminProduct';
import { useAdminProductMutations } from '@/hooks/admin/useAdminProductMutations';
import { useAdminProductReviews } from '@/hooks/admin/useAdminProductReviews';
import { useToast } from '@/hooks/use-toast';

const AdminEditProduct = () => {
  const navigate = useNavigate();
  const { productId } = useParams<{ productId: string }>();
  const { toast } = useToast();
  
  const { product, isLoading: isLoadingProduct, error: productError } = useAdminProduct(productId || '');
  const { updateProduct, setVerifiedStatus, isUpdating } = useAdminProductMutations();
  const { reviews, deleteReview, isDeleting } = useAdminProductReviews(productId || '');
  
  const [formData, setFormData] = useState({
    name: '',
    brandName: '',
    category: '',
    description: '',
    imageUrl: '',
    price: '',
    externalPurchaseLink: '',
    isVerified: false,
  });

  const [mergeData, setMergeData] = useState({
    targetProductId: '',
    reason: '',
  });

  React.useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || '',
        brandName: product.brand_name || '',
        category: product.category || '',
        description: product.description || '',
        imageUrl: product.image_url || '',
        price: product.price?.toString() || '',
        externalPurchaseLink: product.external_purchase_link || '',
        isVerified: product.is_verified,
      });
    }
  }, [product]);

  const handleSave = async () => {
    if (!productId) return;

    updateProduct({
      productId,
      name: formData.name,
      brandName: formData.brandName,
      category: formData.category || undefined,
      description: formData.description || undefined,
      imageUrl: formData.imageUrl || undefined,
      price: formData.price ? parseFloat(formData.price) : undefined,
      externalPurchaseLink: formData.externalPurchaseLink || undefined,
    });
  };

  const handleVerificationToggle = () => {
    if (!productId) return;
    setVerifiedStatus({ productId, verified: !formData.isVerified });
    setFormData(prev => ({ ...prev, isVerified: !prev.isVerified }));
  };

  const handleDeleteReview = (reviewId: string) => {
    if (confirm('Are you sure you want to delete this review? This action cannot be undone.')) {
      deleteReview({ reviewId, reason: 'Admin deletion' });
    }
  };

  if (isLoadingProduct) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center py-8">
            <p className="text-gray-500">Loading product...</p>
          </div>
        </div>
      </div>
    );
  }

  if (productError || !product) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center py-8">
            <p className="text-gray-500">Product not found</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              onClick={() => navigate('/admin/products')}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Products
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Edit Product</h1>
              <p className="text-gray-600">Modify product details</p>
            </div>
          </div>
          
          <Button onClick={handleSave} disabled={isUpdating} className="flex items-center gap-2">
            <Save className="w-4 h-4" />
            {isUpdating ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Product Details */}
          <Card>
            <CardHeader>
              <CardTitle>Product Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Product Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="brandName">Brand Name</Label>
                <Input
                  id="brandName"
                  value={formData.brandName}
                  onChange={(e) => setFormData({ ...formData, brandName: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Input
                  id="category"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="price">Price ($)</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="imageUrl">Image URL</Label>
                <Input
                  id="imageUrl"
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="externalPurchaseLink">Purchase Link</Label>
                <Input
                  id="externalPurchaseLink"
                  value={formData.externalPurchaseLink}
                  onChange={(e) => setFormData({ ...formData, externalPurchaseLink: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={4}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="isVerified">Verified Status</Label>
                  <p className="text-sm text-gray-500">Mark this product as verified</p>
                </div>
                <Switch
                  id="isVerified"
                  checked={formData.isVerified}
                  onCheckedChange={handleVerificationToggle}
                />
              </div>
            </CardContent>
          </Card>

          {/* Reviews and Actions */}
          <div className="space-y-6">
            {/* Reviews */}
            <Card>
              <CardHeader>
                <CardTitle>Reviews ({reviews.length})</CardTitle>
              </CardHeader>
              <CardContent>
                {reviews.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>User</TableHead>
                        <TableHead>Rating</TableHead>
                        <TableHead>Title</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {reviews.map((review) => (
                        <TableRow key={review.id}>
                          <TableCell>{review.user_full_name}</TableCell>
                          <TableCell>
                            <Badge variant="secondary">{review.rating}/5</Badge>
                          </TableCell>
                          <TableCell className="max-w-xs truncate">{review.title}</TableCell>
                          <TableCell>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteReview(review.id)}
                              disabled={isDeleting}
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <p className="text-gray-500 text-center py-4">No reviews found</p>
                )}
              </CardContent>
            </Card>

            {/* Merge Duplicates */}
            <Card>
              <CardHeader>
                <CardTitle>Merge Duplicates</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="targetProductId">Target Product ID</Label>
                  <Input
                    id="targetProductId"
                    value={mergeData.targetProductId}
                    onChange={(e) => setMergeData({ ...mergeData, targetProductId: e.target.value })}
                    placeholder="Enter ID of product to merge into"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="mergeReason">Merge Reason</Label>
                  <Input
                    id="mergeReason"
                    value={mergeData.reason}
                    onChange={(e) => setMergeData({ ...mergeData, reason: e.target.value })}
                    placeholder="Reason for merging"
                  />
                </div>

                <Button
                  variant="destructive"
                  disabled={!mergeData.targetProductId}
                  className="w-full flex items-center gap-2"
                  onClick={() => {
                    if (confirm('Are you sure you want to merge this product? This action cannot be undone.')) {
                      // mergeDuplicates logic would go here
                      toast({
                        title: "Feature Coming Soon",
                        description: "Merge functionality will be implemented",
                      });
                    }
                  }}
                >
                  <Merge className="w-4 h-4" />
                  Merge Product
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminEditProduct;
