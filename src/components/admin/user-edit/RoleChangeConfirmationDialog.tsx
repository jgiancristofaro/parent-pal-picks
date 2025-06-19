
import React from 'react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { AlertTriangle } from 'lucide-react';

interface RoleChangeConfirmationDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  onCancel: () => void;
}

const RoleChangeConfirmationDialog = ({ 
  isOpen, 
  onOpenChange, 
  onConfirm, 
  onCancel 
}: RoleChangeConfirmationDialogProps) => {
  return (
    <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-red-500" />
            Confirm Admin Role Removal
          </AlertDialogTitle>
          <AlertDialogDescription>
            You are about to remove admin privileges from this user. This action will:
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>Remove their access to the admin dashboard</li>
              <li>Prevent them from managing users, content, and system settings</li>
              <li>Change their role from Admin to User</li>
            </ul>
            <p className="mt-3 font-medium">Are you sure you want to proceed?</p>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onCancel}>Cancel</AlertDialogCancel>
          <AlertDialogAction 
            onClick={onConfirm}
            className="bg-red-600 hover:bg-red-700"
          >
            Yes, Remove Admin Role
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default RoleChangeConfirmationDialog;
