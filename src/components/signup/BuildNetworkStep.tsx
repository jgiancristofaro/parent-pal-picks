
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { ContactMatchingSection } from './network/ContactMatchingSection';
import { SuggestionsSection } from './network/SuggestionsSection';
import { Users, ArrowRight } from 'lucide-react';

interface BuildNetworkStepProps {
  onNext: () => void;
  onPrev: () => void;
}

const BuildNetworkStep = ({ onNext, onPrev }: BuildNetworkStepProps) => {
  const [hasFollowedSomeone, setHasFollowedSomeone] = useState(false);
  const [currentSection, setCurrentSection] = useState<'intro' | 'contacts' | 'suggestions'>('intro');
  const { toast } = useToast();

  const handleContactsComplete = (followedCount: number) => {
    if (followedCount > 0) {
      setHasFollowedSomeone(true);
    }
    setCurrentSection('suggestions');
  };

  const handleSuggestionsComplete = (followedCount: number) => {
    if (followedCount > 0) {
      setHasFollowedSomeone(true);
    }
  };

  const handleSkipToSuggestions = () => {
    setCurrentSection('suggestions');
  };

  const handleNext = () => {
    if (!hasFollowedSomeone) {
      toast({
        title: 'Follow at least one person',
        description: 'To get started with ParentPal, please follow at least one person to build your network.',
        variant: 'destructive',
      });
      return;
    }
    onNext();
  };

  const renderContent = () => {
    switch (currentSection) {
      case 'intro':
        return (
          <Card className="w-full">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 p-3 bg-purple-100 rounded-full w-fit">
                <Users className="h-8 w-8 text-purple-600" />
              </div>
              <CardTitle className="text-xl">Build Your Network</CardTitle>
              <p className="text-gray-600 text-sm">
                Connect with other parents in your community to get personalized recommendations and stay updated.
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button
                onClick={() => setCurrentSection('contacts')}
                className="w-full"
                size="lg"
              >
                Connect Your Contacts
              </Button>
              <Button
                onClick={handleSkipToSuggestions}
                variant="outline"
                className="w-full"
                size="lg"
              >
                Skip to Suggestions
              </Button>
            </CardContent>
          </Card>
        );

      case 'contacts':
        return (
          <ContactMatchingSection
            onComplete={handleContactsComplete}
            onSkip={handleSkipToSuggestions}
          />
        );

      case 'suggestions':
        return (
          <SuggestionsSection
            onComplete={handleSuggestionsComplete}
          />
        );

      default:
        return null;
    }
  };

  return (
    <div className="w-full space-y-6">
      {renderContent()}
      
      {/* Navigation Buttons */}
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
            onClick={handleNext}
            disabled={!hasFollowedSomeone}
            className="flex items-center gap-2"
          >
            Continue
            <ArrowRight className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
};

export default BuildNetworkStep;
