
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
import { useAdminSitters } from '@/hooks/useAdminSitters';
import { useAdminSitterReviews } from '@/hooks/useAdminSitters';
import { useToast } from '@/hooks/use-toast';

const AdminEditSitter = () => {
  const navigate = useNavigate();
  const { sitterId } = useParams<{ sitterId: string }>();
  const { toast } = useToast();
  
  const { sitters, updateSitter, setVerifiedStatus, isUpdating } = useAdminSitters();
  const { reviews, deleteReview, isDeleting } = useAdminSitterReviews(sitterId || '');
  
  const sitter = sitters.find(s => s.id === sitterId);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phoneNumber: '',
    bio: '',
    experience: '',
    hourlyRate: '',
    profileImageUrl: '',
    certifications: '',
    isVerified: false,
  });

  const [mergeData, setMergeData] = useState({
    targetSitterId: '',
    reason: '',
  });

  React.useEffect(() => {
    if (sitter) {
      setFormData({
        name: sitter.name || '',
        email: sitter.email || '',
        phoneNumber: sitter.phone_number || '',
        bio: sitter.bio || '',
        experience: sitter.experience || '',
        hourlyRate: sitter.hourly_rate?.toString() || '',
        profileImageUrl: sitter.profile_image_url || '',
        certifications: sitter.certifications?.join(', ') || '',
        isVerified: sitter.is_verified,
      });
    }
  }, [sitter]);

  const handleSave = async () => {
    if (!sitterId) return;

    const certificationArray = formData.certifications
      ? formData.certifications.split(',').map(cert => cert.trim()).filter(cert => cert)
      : [];

    updateSitter({
      sitterId,
      name: formData.name,
      email: formData.email || undefined,
      phoneNumber: formData.phoneNumber || undefined,
      bio: formData.bio || undefined,
      experience: formData.experience || undefined,
      hourlyRate: formData.hourlyRate ? parseFloat(formData.hourlyRate) : undefined,
      profileImageUrl: formData.profileImageUrl || undefined,
      certifications: certificationArray.length > 0 ? certificationArray : undefined,
    });
  };

  const handleVerificationToggle = () => {
    if (!sitterId) return;
    setVerifiedStatus({ sitterId, verified: !formData.isVerified });
    setFormData(prev => ({ ...prev, isVerified: !prev.isVerified }));
  };

  const handleDeleteReview = (reviewId: string) => {
    if (confirm('Are you sure you want to delete this review? This action cannot be undone.')) {
      deleteReview({ reviewId, reason: 'Admin deletion' });
    }
  };

  if (!sitter) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center py-8">
            <p className="text-gray-500">Sitter not found</p>
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
              onClick={() => navigate('/admin/sitters')}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Sitters
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Edit Sitter</h1>
              <p className="text-gray-600">Modify sitter profile details</p>
            </div>
          </div>
          
          <Button onClick={handleSave} disabled={isUpdating} className="flex items-center gap-2">
            <Save className="w-4 h-4" />
            {isUpdating ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Sitter Details */}
          <Card>
            <CardHeader>
              <CardTitle>Sitter Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phoneNumber">Phone Number</Label>
                <Input
                  id="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="hourlyRate">Hourly Rate ($)</Label>
                <Input
                  id="hourlyRate"
                  type="number"
                  step="0.01"
                  value={formData.hourlyRate}
                  onChange={(e) => setFormData({ ...formData, hourlyRate: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="profileImageUrl">Profile Image URL</Label>
                <Input
                  id="profileImageUrl"
                  value={formData.profileImageUrl}
                  onChange={(e) => setFormData({ ...formData, profileImageUrl: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="experience">Experience</Label>
                <Textarea
                  id="experience"
                  value={formData.experience}
                  onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="certifications">Certifications (comma-separated)</Label>
                <Input
                  id="certifications"
                  value={formData.certifications}
                  onChange={(e) => setFormData({ ...formData, certifications: e.target.value })}
                  placeholder="CPR, First Aid, etc."
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="isVerified">Verified Status</Label>
                  <p className="text-sm text-gray-500">Mark this sitter as verified</p>
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
                  <Label htmlFor="targetSitterId">Target Sitter ID</Label>
                  <Input
                    id="targetSitterId"
                    value={mergeData.targetSitterId}
                    onChange={(e) => setMergeData({ ...mergeData, targetSitterId: e.target.value })}
                    placeholder="Enter ID of sitter to merge into"
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
                  disabled={!mergeData.targetSitterId}
                  className="w-full flex items-center gap-2"
                  onClick={() => {
                    if (confirm('Are you sure you want to merge this sitter? This action cannot be undone.')) {
                      // mergeDuplicates logic would go here
                      toast({
                        title: "Feature Coming Soon",
                        description: "Merge functionality will be implemented",
                      });
                    }
                  }}
                >
                  <Merge className="w-4 h-4" />
                  Merge Sitter
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminEditSitter;
