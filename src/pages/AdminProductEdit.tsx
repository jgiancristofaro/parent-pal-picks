
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import { ArrowLeft, Save, Package, Trash2, GitMerge } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAdminProducts } from '@/hooks/useAdminProducts';
import { useAdminReviews } from '@/hooks/useAdminReviews';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';

const AdminProductEdit = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { updateProduct, setVerifiedStatus, mergeDuplicates } = useAdminProducts();
  const { reviews, deleteReview } = useAdminReviews('product', id || '');
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [product, setProduct] = useState<any>(null);
  const [deleteDialog, setDeleteDialog] = useState({ open: false, reviewId: '', reason: '' });
  const [mergeDialog, setMergeDialog] = useState({ open: false, targetId: '', reason: '' });

  const [formData, setFormData] = useState({
    name: '',
    brand_name: '',
    category: '',
    description: '',
    image_url: '',
    price: '',
    external_purchase_link: '',
    is_verified: false
  });

  useEffect(() => {
    if (id) {
      fetchProduct();
    }
  }, [id]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase.rpc('admin_get_all_products', {
        search_term: '',
        page_limit: 1000,
        page_offset: 0
      });

      if (error) {
        console.error('Error fetching product:', error);
        toast({
          title: "Error",
          description: "Failed to load product",
          variant: "destructive",
        });
        return;
      }

      const productData = data?.find((p: any) => p.id === id);
      
      if (!productData) {
        toast({
          title: "Error",
          description: "Product not found",
          variant: "destructive",
        });
        navigate('/admin/products');
        return;
      }

      setProduct(productData);
      setFormData({
        name: productData.name || '',
        brand_name: productData.brand_name || '',
        category: productData.category || '',
        description: productData.description || '',
        image_url: productData.image_url || '',
        price: productData.price?.toString() || '',
        external_purchase_link: productData.external_purchase_link || '',
        is_verified: productData.is_verified || false
      });
      
    } catch (error) {
      console.error('Error in fetchProduct:', error);
      toast({
        title: "Error",
        description: "Failed to load product",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!id) return;
    
    try {
      setSaving(true);

      const updateData: any = {};
      if (formData.name !== product.name) updateData.name = formData.name;
      if (formData.brand_name !== product.brand_name) updateData.brand_name = formData.brand_name;
      if (formData.category !== product.category) updateData.category = formData.category;
      if (formData.description !== product.description) updateData.description = formData.description;
      if (formData.image_url !== product.image_url) updateData.image_url = formData.image_url;
      if (formData.price !== product.price?.toString()) updateData.price = parseFloat(formData.price) || null;
      if (formData.external_purchase_link !== product.external_purchase_link) updateData.external_purchase_link = formData.external_purchase_link;

      if (Object.keys(updateData).length > 0) {
        const success = await updateProduct(id, updateData);
        if (!success) return;
      }

      if (formData.is_verified !== product.is_verified) {
        const success = await setVerifiedStatus(id, formData.is_verified);
        if (!success) return;
      }

      toast({
        title: "Success",
        description: "Product updated successfully",
      });

      navigate('/admin/products');
      
    } catch (error) {
      console.error('Error in handleSave:', error);
      toast({
        title: "Error",
        description: "Failed to update product",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteReview = async () => {
    if (!deleteDialog.reason.trim()) return;

    const success = await deleteReview(deleteDialog.reviewId, deleteDialog.reason);
    if (success) {
      setDeleteDialog({ open: false, reviewId: '', reason: '' });
    }
  };

  const handleMerge = async () => {
    if (!id || !mergeDialog.targetId || !mergeDialog.reason.trim()) return;

    const success = await mergeDuplicates(id, mergeDialog.targetId, mergeDialog.reason);
    if (success) {
      setMergeDialog({ open: false, targetId: '', reason: '' });
      navigate('/admin/products');
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="text-lg">Loading product...</div>
          </div>
        </div>
      </AdminLayout>
    );
  }

  if (!product) {
    return (
      <AdminLayout>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="text-lg">Product not found</div>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="min-h-screen bg-gray-50">
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="py-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Button
                    variant="ghost"
                    onClick={() => navigate('/admin/products')}
                    className="mr-2"
                  >
                    <ArrowLeft className="h-4 w-4" />
                  </Button>
                  <Package className="h-8 w-8 text-purple-600" />
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900">Edit Product</h1>
                    <p className="text-gray-600">Modify product details and manage reviews</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    onClick={() => setMergeDialog({ open: true, targetId: '', reason: '' })}
                  >
                    <GitMerge className="h-4 w-4 mr-2" />
                    Merge Duplicate
                  </Button>
                  <Button onClick={handleSave} disabled={saving}>
                    <Save className="h-4 w-4 mr-2" />
                    {saving ? 'Saving...' : 'Save Changes'}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Product Details */}
            <Card>
              <CardHeader>
                <CardTitle>Product Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="name">Product Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                  />
                </div>

                <div>
                  <Label htmlFor="brand_name">Brand Name</Label>
                  <Input
                    id="brand_name"
                    value={formData.brand_name}
                    onChange={(e) => setFormData({...formData, brand_name: e.target.value})}
                  />
                </div>

                <div>
                  <Label htmlFor="category">Category</Label>
                  <Input
                    id="category"
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                  />
                </div>

                <div>
                  <Label htmlFor="price">Price</Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData({...formData, price: e.target.value})}
                  />
                </div>

                <div>
                  <Label htmlFor="image_url">Image URL</Label>
                  <Input
                    id="image_url"
                    value={formData.image_url}
                    onChange={(e) => setFormData({...formData, image_url: e.target.value})}
                  />
                </div>

                <div>
                  <Label htmlFor="external_purchase_link">Purchase Link</Label>
                  <Input
                    id="external_purchase_link"
                    value={formData.external_purchase_link}
                    onChange={(e) => setFormData({...formData, external_purchase_link: e.target.value})}
                    placeholder="https://..."
                  />
                </div>

                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    rows={4}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Verified Status</Label>
                    <div className="text-sm text-gray-500">
                      Mark this product as verified
                    </div>
                  </div>
                  <Switch
                    checked={formData.is_verified}
                    onCheckedChange={(checked) => setFormData({...formData, is_verified: checked})}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Reviews */}
            <Card>
              <CardHeader>
                <CardTitle>Reviews ({reviews.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {reviews.map((review) => (
                    <div key={review.id} className="border rounded-lg p-3">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{review.user_full_name}</span>
                          <Badge variant="outline">{review.rating}/5</Badge>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setDeleteDialog({ 
                            open: true, 
                            reviewId: review.id, 
                            reason: '' 
                          })}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                      <h4 className="font-medium">{review.title}</h4>
                      <p className="text-sm text-gray-600 mt-1">{review.content}</p>
                      <p className="text-xs text-gray-400 mt-2">
                        {format(new Date(review.created_at), 'MMM dd, yyyy')}
                      </p>
                    </div>
                  ))}
                  {reviews.length === 0 && (
                    <p className="text-center text-gray-500 py-8">No reviews yet</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Delete Review Dialog */}
        <Dialog open={deleteDialog.open} onOpenChange={(open) => 
          setDeleteDialog({ open, reviewId: '', reason: '' })
        }>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete Review</DialogTitle>
              <DialogDescription>
                Are you sure you want to permanently delete this review? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <div>
              <Label htmlFor="delete-reason">Reason for deletion (required)</Label>
              <Textarea
                id="delete-reason"
                value={deleteDialog.reason}
                onChange={(e) => setDeleteDialog({...deleteDialog, reason: e.target.value})}
                placeholder="Reason for deleting this review..."
                rows={3}
              />
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setDeleteDialog({ open: false, reviewId: '', reason: '' })}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={handleDeleteReview}
                disabled={!deleteDialog.reason.trim()}
              >
                Delete Review
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Merge Dialog */}
        <Dialog open={mergeDialog.open} onOpenChange={(open) => 
          setMergeDialog({ open, targetId: '', reason: '' })
        }>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Merge Duplicate Product</DialogTitle>
              <DialogDescription>
                This will merge this product into another product. All reviews will be transferred 
                to the target product and this listing will be deleted.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="target-id">Target Product ID</Label>
                <Input
                  id="target-id"
                  value={mergeDialog.targetId}
                  onChange={(e) => setMergeDialog({...mergeDialog, targetId: e.target.value})}
                  placeholder="Enter the ID of the product to merge into"
                />
              </div>
              <div>
                <Label htmlFor="merge-reason">Merge Reason (required)</Label>
                <Textarea
                  id="merge-reason"
                  value={mergeDialog.reason}
                  onChange={(e) => setMergeDialog({...mergeDialog, reason: e.target.value})}
                  placeholder="Reason for merging these products..."
                  rows={3}
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setMergeDialog({ open: false, targetId: '', reason: '' })}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={handleMerge}
                disabled={!mergeDialog.targetId.trim() || !mergeDialog.reason.trim()}
              >
                Merge Products
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
};

export default AdminProductEdit;
