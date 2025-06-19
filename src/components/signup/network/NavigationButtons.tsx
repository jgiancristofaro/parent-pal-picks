
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

interface NavigationButtonsProps {
  onPrev: () => void;
  onNext: () => void;
  hasFollowedSomeone: boolean;
  currentSection: 'intro' | 'contacts' | 'suggestions';
}

export const NavigationButtons = ({ 
  onPrev, 
  onNext, 
  hasFollowedSomeone, 
  currentSection 
}: NavigationButtonsProps) => {
  return (
    <div className="flex justify-between pt-4">
      <Button 
        variant="outline" 
        onClick={onPrev}
        disabled={currentSection === 'contacts'}
      >
        Back
      </Button>
      
      {(currentSection === 'suggestions' || hasFollowedSomeone) && (
        <Button 
          onClick={onNext}
          disabled={!hasFollowedSomeone}
          className="flex items-center gap-2"
        >
          Continue
          <ArrowRight className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
};
