
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
import { ArrowLeft, Save, User, Trash2, GitMerge } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAdminSitters } from '@/hooks/useAdminSitters';
import { useAdminReviews } from '@/hooks/useAdminReviews';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';

const AdminSitterEdit = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { updateSitter, setVerifiedStatus, mergeDuplicates } = useAdminSitters();
  const { reviews, deleteReview } = useAdminReviews('sitter', id || '');
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [sitter, setSitter] = useState<any>(null);
  const [deleteDialog, setDeleteDialog] = useState({ open: false, reviewId: '', reason: '' });
  const [mergeDialog, setMergeDialog] = useState({ open: false, targetId: '', reason: '' });

  const [formData, setFormData] = useState({
    name: '',
    profile_image_url: '',
    bio: '',
    experience: '',
    hourly_rate: '',
    phone_number: '',
    email: '',
    certifications: '',
    is_verified: false
  });

  useEffect(() => {
    if (id) {
      fetchSitter();
    }
  }, [id]);

  const fetchSitter = async () => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase.rpc('admin_get_all_sitters', {
        search_term: '',
        page_limit: 1000,
        page_offset: 0
      });

      if (error) {
        console.error('Error fetching sitter:', error);
        toast({
          title: "Error",
          description: "Failed to load sitter",
          variant: "destructive",
        });
        return;
      }

      const sitterData = data?.find((s: any) => s.id === id);
      
      if (!sitterData) {
        toast({
          title: "Error",
          description: "Sitter not found",
          variant: "destructive",
        });
        navigate('/admin/sitters');
        return;
      }

      setSitter(sitterData);
      setFormData({
        name: sitterData.name || '',
        profile_image_url: sitterData.profile_image_url || '',
        bio: sitterData.bio || '',
        experience: sitterData.experience || '',
        hourly_rate: sitterData.hourly_rate?.toString() || '',
        phone_number: sitterData.phone_number || '',
        email: sitterData.email || '',
        certifications: sitterData.certifications?.join(', ') || '',
        is_verified: sitterData.is_verified || false
      });
      
    } catch (error) {
      console.error('Error in fetchSitter:', error);
      toast({
        title: "Error",
        description: "Failed to load sitter",
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
      if (formData.name !== sitter.name) updateData.name = formData.name;
      if (formData.profile_image_url !== sitter.profile_image_url) updateData.profile_image_url = formData.profile_image_url;
      if (formData.bio !== sitter.bio) updateData.bio = formData.bio;
      if (formData.experience !== sitter.experience) updateData.experience = formData.experience;
      if (formData.hourly_rate !== sitter.hourly_rate?.toString()) updateData.hourly_rate = parseFloat(formData.hourly_rate) || null;
      if (formData.phone_number !== sitter.phone_number) updateData.phone_number = formData.phone_number;
      if (formData.email !== sitter.email) updateData.email = formData.email;
      if (formData.certifications !== sitter.certifications?.join(', ')) {
        updateData.certifications = formData.certifications.split(',').map(c => c.trim()).filter(c => c);
      }

      if (Object.keys(updateData).length > 0) {
        const success = await updateSitter(id, updateData);
        if (!success) return;
      }

      if (formData.is_verified !== sitter.is_verified) {
        const success = await setVerifiedStatus(id, formData.is_verified);
        if (!success) return;
      }

      toast({
        title: "Success",
        description: "Sitter updated successfully",
      });

      navigate('/admin/sitters');
      
    } catch (error) {
      console.error('Error in handleSave:', error);
      toast({
        title: "Error",
        description: "Failed to update sitter",
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
      navigate('/admin/sitters');
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="text-lg">Loading sitter...</div>
          </div>
        </div>
      </AdminLayout>
    );
  }

  if (!sitter) {
    return (
      <AdminLayout>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="text-lg">Sitter not found</div>
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
                    onClick={() => navigate('/admin/sitters')}
                    className="mr-2"
                  >
                    <ArrowLeft className="h-4 w-4" />
                  </Button>
                  <User className="h-8 w-8 text-purple-600" />
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900">Edit Sitter</h1>
                    <p className="text-gray-600">Modify sitter details and manage reviews</p>
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
            {/* Sitter Details */}
            <Card>
              <CardHeader>
                <CardTitle>Sitter Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                  />
                </div>

                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                  />
                </div>

                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    value={formData.phone_number}
                    onChange={(e) => setFormData({...formData, phone_number: e.target.value})}
                  />
                </div>

                <div>
                  <Label htmlFor="hourly_rate">Hourly Rate</Label>
                  <Input
                    id="hourly_rate"
                    type="number"
                    step="0.01"
                    value={formData.hourly_rate}
                    onChange={(e) => setFormData({...formData, hourly_rate: e.target.value})}
                  />
                </div>

                <div>
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    value={formData.bio}
                    onChange={(e) => setFormData({...formData, bio: e.target.value})}
                    rows={3}
                  />
                </div>

                <div>
                  <Label htmlFor="experience">Experience</Label>
                  <Textarea
                    id="experience"
                    value={formData.experience}
                    onChange={(e) => setFormData({...formData, experience: e.target.value})}
                    rows={3}
                  />
                </div>

                <div>
                  <Label htmlFor="certifications">Certifications (comma-separated)</Label>
                  <Input
                    id="certifications"
                    value={formData.certifications}
                    onChange={(e) => setFormData({...formData, certifications: e.target.value})}
                    placeholder="First Aid, CPR, etc."
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Verified Status</Label>
                    <div className="text-sm text-gray-500">
                      Mark this sitter as verified
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
              <DialogTitle>Merge Duplicate Sitter</DialogTitle>
              <DialogDescription>
                This will merge this sitter into another sitter profile. All reviews will be transferred 
                to the target sitter and this profile will be deleted.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="target-id">Target Sitter ID</Label>
                <Input
                  id="target-id"
                  value={mergeDialog.targetId}
                  onChange={(e) => setMergeDialog({...mergeDialog, targetId: e.target.value})}
                  placeholder="Enter the ID of the sitter to merge into"
                />
              </div>
              <div>
                <Label htmlFor="merge-reason">Merge Reason (required)</Label>
                <Textarea
                  id="merge-reason"
                  value={mergeDialog.reason}
                  onChange={(e) => setMergeDialog({...mergeDialog, reason: e.target.value})}
                  placeholder="Reason for merging these sitters..."
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
                Merge Sitters
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
};

export default AdminSitterEdit;
