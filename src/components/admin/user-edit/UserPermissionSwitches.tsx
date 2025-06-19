
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
          onCheckedChange={(checked) => setFormData({ ...formData, is_suspended: checked })}
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
          onCheckedChange={(checked) => setFormData({ ...formData, phone_number_searchable: checked })}
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
          onCheckedChange={(checked) => setFormData({ ...formData, is_community_leader: checked })}
        />
      </div>
    </div>
  );
};

export default UserPermissionSwitches;
