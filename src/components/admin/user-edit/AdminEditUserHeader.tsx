
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Save } from 'lucide-react';

interface AdminEditUserHeaderProps {
  onSave: () => void;
  isUpdating: boolean;
}

const AdminEditUserHeader = ({ onSave, isUpdating }: AdminEditUserHeaderProps) => {
  const navigate = useNavigate();

  return (
    <div className="mb-6 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          onClick={() => navigate('/admin/users')}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Users
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Edit User</h1>
          <p className="text-gray-600">Modify user account details</p>
        </div>
      </div>
      
      <Button onClick={onSave} disabled={isUpdating} className="flex items-center gap-2">
        <Save className="w-4 h-4" />
        {isUpdating ? 'Saving...' : 'Save Changes'}
      </Button>
    </div>
  );
};

export default AdminEditUserHeader;
