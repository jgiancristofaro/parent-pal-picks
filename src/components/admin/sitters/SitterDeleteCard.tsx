
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Trash2 } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { AdminSitter } from '@/hooks/admin/types';

interface SitterDeleteCardProps {
  sitter: AdminSitter;
  onDeleteSitter: (reason: string) => void;
  isDeleting: boolean;
}

export const SitterDeleteCard = ({ sitter, onDeleteSitter, isDeleting }: SitterDeleteCardProps) => {
  const [deleteReason, setDeleteReason] = useState('');
  const [confirmationText, setConfirmationText] = useState('');

  const handleDelete = () => {
    if (confirmationText.toLowerCase() === 'delete') {
      onDeleteSitter(deleteReason || 'Admin deletion from edit form');
    }
  };

  const isConfirmationValid = confirmationText.toLowerCase() === 'delete';

  return (
    <Card className="border-red-200">
      <CardHeader>
        <CardTitle className="text-red-600">Delete Sitter</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="p-4 bg-red-50 border border-red-200 rounded-md">
          <p className="text-sm text-red-800">
            <strong>Warning:</strong> This action cannot be undone. Deleting this sitter will:
          </p>
          <ul className="mt-2 text-sm text-red-700 list-disc list-inside">
            <li>Permanently remove the sitter profile</li>
            <li>Delete all {sitter.review_count} associated reviews</li>
            <li>Remove all activity feed entries</li>
          </ul>
        </div>

        <div className="space-y-2">
          <Label htmlFor="deleteReason">Deletion Reason (Optional)</Label>
          <Input
            id="deleteReason"
            value={deleteReason}
            onChange={(e) => setDeleteReason(e.target.value)}
            placeholder="Enter reason for deletion..."
          />
        </div>

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              variant="destructive"
              className="w-full flex items-center gap-2"
              disabled={isDeleting}
            >
              <Trash2 className="w-4 h-4" />
              {isDeleting ? 'Deleting...' : 'Delete Sitter'}
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Confirm Sitter Deletion</AlertDialogTitle>
              <AlertDialogDescription className="space-y-3">
                <p>
                  You are about to permanently delete <strong>{sitter.name}</strong> and all associated data.
                </p>
                <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                  <p className="text-sm font-medium text-red-800">This will delete:</p>
                  <ul className="mt-1 text-sm text-red-700 list-disc list-inside">
                    <li>{sitter.review_count} reviews</li>
                    <li>Activity feed entries</li>
                    <li>All sitter profile data</li>
                  </ul>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmDelete">
                    Type <strong>DELETE</strong> to confirm:
                  </Label>
                  <Input
                    id="confirmDelete"
                    value={confirmationText}
                    onChange={(e) => setConfirmationText(e.target.value)}
                    placeholder="Type DELETE to confirm"
                  />
                </div>
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => setConfirmationText('')}>
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDelete}
                disabled={!isConfirmationValid || isDeleting}
                className="bg-red-600 hover:bg-red-700"
              >
                {isDeleting ? 'Deleting...' : 'Delete Sitter'}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardContent>
    </Card>
  );
};
