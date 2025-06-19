
import React from 'react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertTriangle } from 'lucide-react';

interface UserRoleSelectorProps {
  currentRole: string;
  originalRole: string;
  onRoleChange: (newRole: string) => void;
}

const UserRoleSelector = ({ currentRole, originalRole, onRoleChange }: UserRoleSelectorProps) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="role">Role</Label>
      {originalRole === 'ADMIN' && (
        <div className="flex items-center gap-2 p-2 bg-amber-50 border border-amber-200 rounded-md">
          <AlertTriangle className="w-4 h-4 text-amber-600" />
          <span className="text-sm text-amber-700">
            Warning: This user is currently an Admin. Changing their role will remove admin privileges.
          </span>
        </div>
      )}
      <Select value={currentRole} onValueChange={onRoleChange}>
        <SelectTrigger>
          <SelectValue placeholder="Select role" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="USER">User</SelectItem>
          <SelectItem value="ADMIN">Admin</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default UserRoleSelector;
