
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { useFlagContent } from '@/hooks/useFlagContent';

interface FlagContentModalProps {
  isOpen: boolean;
  onClose: () => void;
  contentType: 'review';
  contentId: string;
}

const FLAG_REASONS = [
  { value: 'spam', label: 'Spam or advertising' },
  { value: 'inappropriate', label: 'Inappropriate language' },
  { value: 'harassment', label: 'Harassment or bullying' },
  { value: 'false_info', label: 'False or misleading information' },
  { value: 'other', label: 'Other (please specify)' },
];

export const FlagContentModal = ({ isOpen, onClose, contentType, contentId }: FlagContentModalProps) => {
  const [selectedReason, setSelectedReason] = useState('');
  const [customReason, setCustomReason] = useState('');
  const { flagContent, isSubmitting } = useFlagContent();

  const handleSubmit = async () => {
    const reason = selectedReason === 'other' ? customReason : 
                  FLAG_REASONS.find(r => r.value === selectedReason)?.label || '';
    
    if (!reason.trim()) {
      return;
    }

    const success = await flagContent({
      contentType,
      contentId,
      reason: reason.trim()
    });

    if (success) {
      setSelectedReason('');
      setCustomReason('');
      onClose();
    }
  };

  const handleClose = () => {
    setSelectedReason('');
    setCustomReason('');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Flag Content</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            Please select a reason for flagging this content:
          </p>
          
          <RadioGroup value={selectedReason} onValueChange={setSelectedReason}>
            {FLAG_REASONS.map((reason) => (
              <div key={reason.value} className="flex items-center space-x-2">
                <RadioGroupItem value={reason.value} id={reason.value} />
                <Label htmlFor={reason.value} className="text-sm">
                  {reason.label}
                </Label>
              </div>
            ))}
          </RadioGroup>
          
          {selectedReason === 'other' && (
            <Textarea
              placeholder="Please describe the issue..."
              value={customReason}
              onChange={(e) => setCustomReason(e.target.value)}
              className="min-h-[80px]"
            />
          )}
          
          <div className="flex justify-end space-x-2 pt-4">
            <Button variant="outline" onClick={handleClose} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button 
              onClick={handleSubmit} 
              disabled={!selectedReason || (selectedReason === 'other' && !customReason.trim()) || isSubmitting}
              className="bg-red-600 hover:bg-red-700"
            >
              {isSubmitting ? 'Submitting...' : 'Flag Content'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
