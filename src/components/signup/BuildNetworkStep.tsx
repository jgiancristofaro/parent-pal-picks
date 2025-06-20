
import React, { useState, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { ContactsList } from './network/ContactsList';
import { SuggestionsSection } from './network/SuggestionsSection';
import { ContactsIntroSection } from './network/ContactsIntroSection';
import { NavigationButtons } from './network/NavigationButtons';
import { useContactsManager } from './network/ContactsManager';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

interface BuildNetworkStepProps {
  onNext: () => void;
  onPrev: () => void;
}

interface MatchedContact {
  user_id: string;
  full_name: string;
  username: string | null;
  avatar_url: string | null;
  profile_privacy_setting: string;
  matched_identifier_count: number;
}

const BuildNetworkStep = ({ onNext, onPrev }: BuildNetworkStepProps) => {
  const [hasFollowedSomeone, setHasFollowedSomeone] = useState(false);
  const [currentSection, setCurrentSection] = useState<'intro' | 'contacts' | 'suggestions'>('intro');
  const [matchedContacts, setMatchedContacts] = useState<MatchedContact[]>([]);
  const [authReady, setAuthReady] = useState(false);
  const { toast } = useToast();
  const { isLoading, requestContacts } = useContactsManager();
  const { user, session, isLoading: authLoading } = useAuth();

  // Wait for authentication to be fully ready before showing suggestions
  useEffect(() => {
    const checkAuthReady = () => {
      if (user && session && user.email_confirmed_at && !authLoading) {
        console.log('🔑 Authentication fully ready for BuildNetworkStep:', {
          userId: user.id,
          hasSession: !!session,
          emailConfirmed: !!user.email_confirmed_at,
          authLoading
        });
        setAuthReady(true);
      } else {
        console.log('⏳ Authentication not ready yet:', {
          hasUser: !!user,
          hasSession: !!session,
          emailConfirmed: !!user?.email_confirmed_at,
          authLoading
        });
        setAuthReady(false);
      }
    };

    checkAuthReady();
  }, [user, session, authLoading]);

  const handleRequestContacts = async () => {
    const result = await requestContacts();
    
    if (result.success) {
      setMatchedContacts(result.matches);
      if (result.matches.length > 0) {
        setCurrentSection('contacts');
      } else {
        setCurrentSection('suggestions');
      }
    } else {
      setCurrentSection('suggestions');
    }
  };

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

  // Show loading state while authentication is getting ready
  if (!authReady && currentSection === 'suggestions') {
    return (
      <div className="w-full space-y-6">
        <Card>
          <CardContent className="pt-6 text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-purple-600" />
            <p className="text-gray-600">Setting up your account...</p>
            <p className="text-sm text-gray-500 mt-2">This should only take a moment</p>
          </CardContent>
        </Card>
        
        <NavigationButtons
          onPrev={onPrev}
          onNext={handleNext}
          hasFollowedSomeone={hasFollowedSomeone}
          currentSection={currentSection}
        />
      </div>
    );
  }

  const renderContent = () => {
    switch (currentSection) {
      case 'intro':
        return (
          <ContactsIntroSection
            onRequestContacts={handleRequestContacts}
            onSkipToSuggestions={handleSkipToSuggestions}
            isLoading={isLoading}
          />
        );

      case 'contacts':
        return (
          <ContactsList
            contacts={matchedContacts}
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
      
      <NavigationButtons
        onPrev={onPrev}
        onNext={handleNext}
        hasFollowedSomeone={hasFollowedSomeone}
        currentSection={currentSection}
      />
    </div>
  );
};

export default BuildNetworkStep;
