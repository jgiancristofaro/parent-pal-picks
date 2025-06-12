
import React, { useState } from 'react';
import { Flag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { FlagContentModal } from './FlagContentModal';

interface FlagContentButtonProps {
  contentType: 'review';
  contentId: string;
  className?: string;
}

export const FlagContentButton = ({ contentType, contentId, className }: FlagContentButtonProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsModalOpen(true)}
        className={`text-gray-500 hover:text-red-600 ${className}`}
        title="Flag inappropriate content"
      >
        <Flag className="w-4 h-4" />
      </Button>
      
      <FlagContentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        contentType={contentType}
        contentId={contentId}
      />
    </>
  );
};
