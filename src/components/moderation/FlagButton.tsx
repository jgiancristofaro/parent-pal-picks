
import React, { useState } from 'react';
import { Flag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { useFlagContent } from '@/hooks/useFlaggedContent';

interface FlagButtonProps {
  contentType: 'review';
  contentId: string;
  size?: 'sm' | 'default' | 'lg';
  variant?: 'ghost' | 'outline' | 'secondary';
}

export const FlagButton = ({ 
  contentType, 
  contentId, 
  size = 'sm', 
  variant = 'ghost' 
}: FlagButtonProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [reason, setReason] = useState('');
  const { flagContent, isFlagging } = useFlagContent();

  const handleSubmit = () => {
    if (!reason.trim()) return;

    flagContent({
      contentType,
      contentId,
      reason: reason.trim(),
    });

    setIsOpen(false);
    setReason('');
  };

  return (
    <>
      <Button
        variant={variant}
        size={size}
        onClick={() => setIsOpen(true)}
        className="text-gray-500 hover:text-red-600"
      >
        <Flag className="w-4 h-4" />
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Flag Content</DialogTitle>
            <DialogDescription>
              Help us maintain a safe community by reporting inappropriate content.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Reason for flagging</label>
              <Textarea
                placeholder="Please describe why you're flagging this content..."
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="mt-1"
                rows={3}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleSubmit}
              disabled={!reason.trim() || isFlagging}
            >
              {isFlagging ? 'Flagging...' : 'Flag Content'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
