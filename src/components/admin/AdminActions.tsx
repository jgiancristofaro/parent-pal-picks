
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Settings, UserX, Edit } from 'lucide-react';

interface AdminActionsProps {
  userId: string;
  userType: 'user' | 'sitter';
  entityId?: string;
}

export const AdminActions = ({ userId, userType, entityId }: AdminActionsProps) => {
  const editUrl = userType === 'user' 
    ? `/admin/users/${userId}`
    : `/admin/sitters/${entityId || userId}`;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="bg-red-50 border-red-200 text-red-600 hover:bg-red-100">
          <Settings className="h-4 w-4 mr-2" />
          Admin Actions
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem asChild>
          <Link to={editUrl} className="flex items-center">
            <Edit className="h-4 w-4 mr-2" />
            Edit in Admin
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem className="text-red-600">
          <UserX className="h-4 w-4 mr-2" />
          Suspend User
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
