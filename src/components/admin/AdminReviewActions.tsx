
import React from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MoreVertical, Edit, Trash2, Flag } from 'lucide-react';
import { useAdmin } from '@/hooks/useAdmin';

interface AdminReviewActionsProps {
  reviewId: string;
  onEdit?: () => void;
  onDelete?: () => void;
  onFlag?: () => void;
}

export const AdminReviewActions = ({ 
  reviewId, 
  onEdit, 
  onDelete, 
  onFlag 
}: AdminReviewActionsProps) => {
  const { isAdmin } = useAdmin();

  if (!isAdmin) {
    return null;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
          <MoreVertical className="h-3 w-3" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-32">
        {onEdit && (
          <DropdownMenuItem onClick={onEdit}>
            <Edit className="h-3 w-3 mr-2" />
            Edit
          </DropdownMenuItem>
        )}
        {onDelete && (
          <DropdownMenuItem onClick={onDelete} className="text-red-600">
            <Trash2 className="h-3 w-3 mr-2" />
            Delete
          </DropdownMenuItem>
        )}
        {onFlag && (
          <DropdownMenuItem onClick={onFlag}>
            <Flag className="h-3 w-3 mr-2" />
            Flag
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
