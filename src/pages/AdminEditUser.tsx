
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useProfile } from '@/hooks/useProfile';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import AdminEditUserHeader from '@/components/admin/user-edit/AdminEditUserHeader';
import UserBasicInfoForm from '@/components/admin/user-edit/UserBasicInfoForm';
import UserRoleSelector from '@/components/admin/user-edit/UserRoleSelector';
import UserPermissionSwitches from '@/components/admin/user-edit/UserPermissionSwitches';
import RoleChangeConfirmationDialog from '@/components/admin/user-edit/RoleChangeConfirmationDialog';

const AdminEditUser = () => {
  const { userId } = useParams<{ userId: string }>();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // Use direct query instead of useProfile to get fresh data
  const { data: profile, isLoading, refetch } = useQuery({
    queryKey: ['admin-user-profile', userId],
    queryFn: async () => {
      if (!userId) return null;
      
      console.log('🔍 Fetching user profile for admin edit:', userId);
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('❌ Error fetching user profile:', error);
        throw error;
      }

      console.log('✅ Fetched profile data:', data);
      return data;
    },
    enabled: !!userId,
  });
  
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
      console.log('📊 Profile loaded, updating form data:', profile);
      const profileRole = profile.role || 'USER';
      const newFormData = {
        full_name: profile.full_name || '',
        username: profile.username || '',
        bio: profile.bio || '',
        phone_number: profile.phone_number || '',
        role: profileRole,
        is_suspended: profile.is_suspended || false,
        phone_number_searchable: profile.phone_number_searchable || false,
        is_community_leader: profile.is_community_leader || false,
      };
      
      console.log('📝 Setting form data with community leader status:', {
        from_profile: profile.is_community_leader,
        in_form_data: newFormData.is_community_leader
      });
      setFormData(newFormData);
      setOriginalRole(profileRole);
    }
  }, [profile]);

  const handleRoleChange = (newRole: string) => {
    console.log('🔄 Role change requested:', { from: originalRole, to: newRole });
    
    // If changing from ADMIN to USER, show confirmation dialog
    if (originalRole === 'ADMIN' && newRole === 'USER') {
      console.log('⚠️ Admin demotion detected, showing confirmation dialog');
      setPendingRoleChange(newRole);
      setShowRoleChangeDialog(true);
    } else {
      console.log('✅ Regular role change, updating directly');
      setFormData({ ...formData, role: newRole });
    }
  };

  const confirmRoleChange = () => {
    console.log('✅ Role change confirmed, applying:', pendingRoleChange);
    setFormData({ ...formData, role: pendingRoleChange });
    setShowRoleChangeDialog(false);
    setPendingRoleChange('');
  };

  const cancelRoleChange = () => {
    console.log('❌ Role change cancelled');
    setShowRoleChangeDialog(false);
    setPendingRoleChange('');
  };

  const verifyDatabaseUpdate = async (userId: string, expectedData: any) => {
    console.log('🔍 Verifying database update...');
    try {
      const { data: verificationData, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('❌ Verification query failed:', error);
        return false;
      }

      console.log('📊 Database verification data:', verificationData);
      console.log('🎯 Expected community leader status:', expectedData.is_community_leader);
      console.log('💾 Actual database community leader status:', verificationData.is_community_leader);

      // Check if the key fields match
      const matches = {
        is_community_leader: verificationData.is_community_leader === expectedData.is_community_leader,
        is_suspended: verificationData.is_suspended === expectedData.is_suspended,
        phone_number_searchable: verificationData.phone_number_searchable === expectedData.phone_number_searchable,
        role: verificationData.role === expectedData.role
      };

      console.log('🔍 Verification matches:', matches);
      
      return Object.values(matches).every(Boolean);
    } catch (error) {
      console.error('❌ Database verification error:', error);
      return false;
    }
  };

  const handleSave = async () => {
    if (!userId) return;

    console.log('💾 Saving user data:', formData);
    setIsUpdating(true);
    
    try {
      const updateData = {
        full_name: formData.full_name,
        username: formData.username || null,
        bio: formData.bio || null,
        phone_number: formData.phone_number || null,
        role: formData.role,
        is_suspended: formData.is_suspended,
        phone_number_searchable: formData.phone_number_searchable,
        is_community_leader: formData.is_community_leader,
        updated_at: new Date().toISOString(),
      };

      console.log('📤 Sending update to database:', updateData);
      console.log('🎯 Community leader value being saved:', updateData.is_community_leader);

      const { error } = await supabase
        .from('profiles')
        .update(updateData)
        .eq('id', userId);

      if (error) {
        console.error('❌ Database update error:', error);
        throw error;
      }

      console.log('✅ Database update successful');

      // Verify the update was actually saved
      const isVerified = await verifyDatabaseUpdate(userId, updateData);
      
      if (!isVerified) {
        throw new Error('Database update verification failed - data may not have been saved correctly');
      }

      console.log('✅ Database update verified successfully');
      
      // Invalidate and refetch the query cache
      await queryClient.invalidateQueries({ queryKey: ['admin-user-profile', userId] });
      await refetch();

      console.log('🔄 Query cache invalidated and refetched');

      // Create detailed success message
      const changedFields = [];
      if (formData.full_name !== (profile?.full_name || '')) changedFields.push('name');
      if (formData.username !== (profile?.username || '')) changedFields.push('username');
      if (formData.bio !== (profile?.bio || '')) changedFields.push('bio');
      if (formData.phone_number !== (profile?.phone_number || '')) changedFields.push('phone number');
      if (formData.role !== (profile?.role || 'USER')) changedFields.push('role');
      if (formData.is_suspended !== (profile?.is_suspended || false)) changedFields.push('suspension status');
      if (formData.phone_number_searchable !== (profile?.phone_number_searchable || false)) changedFields.push('phone searchability');
      if (formData.is_community_leader !== (profile?.is_community_leader || false)) changedFields.push('community leader status');

      const successMessage = changedFields.length > 0 
        ? `User profile updated successfully. Changed: ${changedFields.join(', ')}`
        : 'User profile updated successfully';

      console.log('🎉 Success:', successMessage);

      toast({
        title: "Success",
        description: successMessage,
      });
    } catch (error: any) {
      console.error('❌ Error updating user:', error);
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
