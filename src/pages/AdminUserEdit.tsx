
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Save, User } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

const AdminUserEdit = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [user, setUser] = useState<any>(null);

  const [formData, setFormData] = useState({
    full_name: '',
    username: '',
    bio: '',
    role: 'USER',
    is_suspended: false,
    phone_number_searchable: false
  });

  useEffect(() => {
    if (id) {
      fetchUser();
    }
  }, [id]);

  const fetchUser = async () => {
    try {
      setLoading(true);
      
      // Get user from admin function
      const { data: usersData, error: usersError } = await supabase.rpc('admin_get_users', {
        search_term: '',
        page_limit: 1000,
        page_offset: 0
      });

      if (usersError) {
        console.error('Error fetching users:', usersError);
        toast({
          title: "Error",
          description: "Failed to load user",
          variant: "destructive",
        });
        return;
      }

      const userData = usersData?.find((u: any) => u.id === id);
      
      if (!userData) {
        toast({
          title: "Error",
          description: "User not found",
          variant: "destructive",
        });
        navigate('/admin/users');
        return;
      }

      // Get additional profile data
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', id)
        .single();

      if (profileError) {
        console.error('Error fetching profile:', profileError);
        toast({
          title: "Error",
          description: "Failed to load user profile",
          variant: "destructive",
        });
        return;
      }

      setUser({ ...userData, ...profileData });
      setFormData({
        full_name: profileData.full_name || '',
        username: profileData.username || '',
        bio: profileData.bio || '',
        role: profileData.role || 'USER',
        is_suspended: profileData.is_suspended || false,
        phone_number_searchable: profileData.phone_number_searchable || false
      });
      
    } catch (error) {
      console.error('Error in fetchUser:', error);
      toast({
        title: "Error",
        description: "Failed to load user",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);

      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: formData.full_name,
          username: formData.username || null,
          bio: formData.bio || null,
          role: formData.role,
          is_suspended: formData.is_suspended,
          phone_number_searchable: formData.phone_number_searchable,
          updated_at: new Date().toISOString()
        })
        .eq('id', id);

      if (error) {
        console.error('Error updating user:', error);
        toast({
          title: "Error",
          description: "Failed to update user",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Success",
        description: "User updated successfully",
      });

      navigate('/admin/users');
      
    } catch (error) {
      console.error('Error in handleSave:', error);
      toast({
        title: "Error",
        description: "Failed to update user",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="text-lg">Loading user...</div>
          </div>
        </div>
      </AdminLayout>
    );
  }

  if (!user) {
    return (
      <AdminLayout>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="text-lg">User not found</div>
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
                    onClick={() => navigate('/admin/users')}
                    className="mr-2"
                  >
                    <ArrowLeft className="h-4 w-4" />
                  </Button>
                  <User className="h-8 w-8 text-purple-600" />
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900">Edit User</h1>
                    <p className="text-gray-600">Modify user account details and permissions</p>
                  </div>
                </div>
                <Button onClick={handleSave} disabled={saving}>
                  <Save className="h-4 w-4 mr-2" />
                  {saving ? 'Saving...' : 'Save Changes'}
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* User Info */}
            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle>User Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-500">User ID</Label>
                    <div className="text-sm font-mono">{user.id}</div>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Email</Label>
                    <div className="text-sm">{user.email || 'No email'}</div>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Phone</Label>
                    <div className="text-sm">{user.phone_number || 'No phone'}</div>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Joined</Label>
                    <div className="text-sm">{new Date(user.created_at).toLocaleDateString()}</div>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Current Status</Label>
                    <div className="mt-1">
                      <Badge variant={user.is_suspended ? 'destructive' : 'default'}>
                        {user.is_suspended ? 'Suspended' : 'Active'}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Edit Form */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Edit Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="full_name">Full Name</Label>
                      <Input
                        id="full_name"
                        value={formData.full_name}
                        onChange={(e) => setFormData({...formData, full_name: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label htmlFor="username">Username</Label>
                      <Input
                        id="username"
                        value={formData.username}
                        onChange={(e) => setFormData({...formData, username: e.target.value})}
                        placeholder="Optional"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea
                      id="bio"
                      value={formData.bio}
                      onChange={(e) => setFormData({...formData, bio: e.target.value})}
                      placeholder="User bio..."
                      rows={3}
                    />
                  </div>

                  <div>
                    <Label htmlFor="role">Role</Label>
                    <Select
                      value={formData.role}
                      onValueChange={(value) => setFormData({...formData, role: value})}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="USER">User</SelectItem>
                        <SelectItem value="ADMIN">Admin</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Account Suspended</Label>
                        <div className="text-sm text-gray-500">
                          Suspended users cannot access the platform
                        </div>
                      </div>
                      <Switch
                        checked={formData.is_suspended}
                        onCheckedChange={(checked) => setFormData({...formData, is_suspended: checked})}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Phone Number Searchable</Label>
                        <div className="text-sm text-gray-500">
                          Allow other users to find this user by phone number
                        </div>
                      </div>
                      <Switch
                        checked={formData.phone_number_searchable}
                        onCheckedChange={(checked) => setFormData({...formData, phone_number_searchable: checked})}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminUserEdit;
