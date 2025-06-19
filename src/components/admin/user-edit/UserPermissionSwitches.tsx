
import React from 'react';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';

interface UserFormData {
  full_name: string;
  username: string;
  bio: string;
  phone_number: string;
  role: string;
  is_suspended: boolean;
  phone_number_searchable: boolean;
  is_community_leader: boolean;
}

interface UserPermissionSwitchesProps {
  formData: UserFormData;
  setFormData: (data: UserFormData) => void;
}

const UserPermissionSwitches = ({ formData, setFormData }: UserPermissionSwitchesProps) => {
  const handleSuspendedChange = (checked: boolean) => {
    console.log('🔄 Suspension status changed:', {
      from: formData.is_suspended,
      to: checked,
      formData: formData
    });
    setFormData({ ...formData, is_suspended: checked });
  };

  const handlePhoneSearchableChange = (checked: boolean) => {
    console.log('🔄 Phone searchable changed:', {
      from: formData.phone_number_searchable,
      to: checked,
      formData: formData
    });
    setFormData({ ...formData, phone_number_searchable: checked });
  };

  const handleCommunityLeaderChange = (checked: boolean) => {
    console.log('🔄 Community leader status changed:', {
      from: formData.is_community_leader,
      to: checked,
      formData: formData
    });
    console.log('📝 Setting new form data with community leader:', checked);
    const newFormData = { ...formData, is_community_leader: checked };
    console.log('📋 New form data object:', newFormData);
    setFormData(newFormData);
  };

  // Debug logging for current state
  console.log('🎛️ UserPermissionSwitches render with formData:', {
    is_suspended: formData.is_suspended,
    phone_number_searchable: formData.phone_number_searchable,
    is_community_leader: formData.is_community_leader,
    fullFormData: formData
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <Label htmlFor="is_suspended">Account Suspended</Label>
          <p className="text-sm text-gray-500">Prevent user from accessing the application</p>
        </div>
        <Switch
          id="is_suspended"
          checked={formData.is_suspended}
          onCheckedChange={handleSuspendedChange}
        />
      </div>

      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <Label htmlFor="phone_number_searchable">Phone Number Searchable</Label>
          <p className="text-sm text-gray-500">Allow others to find this user by phone number</p>
        </div>
        <Switch
          id="phone_number_searchable"
          checked={formData.phone_number_searchable}
          onCheckedChange={handlePhoneSearchableChange}
        />
      </div>

      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <Label htmlFor="is_community_leader">Community Leader</Label>
          <p className="text-sm text-gray-500">Show this user as a suggested account to new users during onboarding</p>
        </div>
        <Switch
          id="is_community_leader"
          checked={formData.is_community_leader}
          onCheckedChange={handleCommunityLeaderChange}
        />
      </div>
    </div>
  );
};

export default UserPermissionSwitches;
