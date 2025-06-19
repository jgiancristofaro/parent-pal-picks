
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useProfile } from '@/hooks/useProfile';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import AdminEditUserHeader from '@/components/admin/user-edit/AdminEditUserHeader';
import UserBasicInfoForm from '@/components/admin/user-edit/UserBasicInfoForm';
import UserRoleSelector from '@/components/admin/user-edit/UserRoleSelector';
import UserPermissionSwitches from '@/components/admin/user-edit/UserPermissionSwitches';
import RoleChangeConfirmationDialog from '@/components/admin/user-edit/RoleChangeConfirmationDialog';

const AdminEditUser = () => {
  const { userId } = useParams<{ userId: string }>();
  const { toast } = useToast();
  const { data: profile, isLoading } = useProfile(userId);
  
  const [formData, setFormData] = useState({
    full_name: '',
    username: '',
    bio: '',
    phone_number: '',
    role: 'USER',
    is_suspended: false,
    phone_number_searchable: false,
    is_community_leader: false,
  });

  const [isUpdating, setIsUpdating] = useState(false);
  const [showRoleChangeDialog, setShowRoleChangeDialog] = useState(false);
  const [pendingRoleChange, setPendingRoleChange] = useState<string>('');
  const [originalRole, setOriginalRole] = useState<string>('');

  React.useEffect(() => {
    if (profile) {
      const profileRole = profile.role || 'USER';
      setFormData({
        full_name: profile.full_name || '',
        username: profile.username || '',
        bio: profile.bio || '',
        phone_number: profile.phone_number || '',
        role: profileRole,
        is_suspended: profile.is_suspended || false,
        phone_number_searchable: profile.phone_number_searchable || false,
        is_community_leader: profile.is_community_leader || false,
      });
      setOriginalRole(profileRole);
    }
  }, [profile]);

  const handleRoleChange = (newRole: string) => {
    // If changing from ADMIN to USER, show confirmation dialog
    if (originalRole === 'ADMIN' && newRole === 'USER') {
      setPendingRoleChange(newRole);
      setShowRoleChangeDialog(true);
    } else {
      setFormData({ ...formData, role: newRole });
    }
  };

  const confirmRoleChange = () => {
    setFormData({ ...formData, role: pendingRoleChange });
    setShowRoleChangeDialog(false);
    setPendingRoleChange('');
  };

  const cancelRoleChange = () => {
    setShowRoleChangeDialog(false);
    setPendingRoleChange('');
  };

  const handleSave = async () => {
    if (!userId) return;

    setIsUpdating(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: formData.full_name,
          username: formData.username || null,
          bio: formData.bio || null,
          phone_number: formData.phone_number || null,
          role: formData.role,
          is_suspended: formData.is_suspended,
          phone_number_searchable: formData.phone_number_searchable,
          is_community_leader: formData.is_community_leader,
          updated_at: new Date().toISOString(),
        })
        .eq('id', userId);

      if (error) {
        throw error;
      }

      toast({
        title: "Success",
        description: "User profile updated successfully",
      });
    } catch (error: any) {
      console.error('Error updating user:', error);
      toast({
        title: "Error",
        description: `Failed to update user: ${error.message}`,
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-3xl mx-auto">
          <div className="text-center py-8">
            <p className="text-gray-500">Loading user...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-3xl mx-auto">
          <div className="text-center py-8">
            <p className="text-gray-500">User not found</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-3xl mx-auto">
          <AdminEditUserHeader onSave={handleSave} isUpdating={isUpdating} />

          <Card>
            <CardHeader>
              <CardTitle>User Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <UserBasicInfoForm formData={formData} setFormData={setFormData} />
              
              <UserRoleSelector 
                currentRole={formData.role}
                originalRole={originalRole}
                onRoleChange={handleRoleChange}
              />

              <UserPermissionSwitches formData={formData} setFormData={setFormData} />
            </CardContent>
          </Card>
        </div>
      </div>

      <RoleChangeConfirmationDialog
        isOpen={showRoleChangeDialog}
        onOpenChange={setShowRoleChangeDialog}
        onConfirm={confirmRoleChange}
        onCancel={cancelRoleChange}
      />
    </>
  );
};

export default AdminEditUser;
