
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { ContactsList } from './network/ContactsList';
import { SuggestionsSection } from './network/SuggestionsSection';
import { Users, ArrowRight, Shield, Contact } from 'lucide-react';

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
  const [isLoading, setIsLoading] = useState(false);
  const [matchedContacts, setMatchedContacts] = useState<MatchedContact[]>([]);
  const [hasRequestedContacts, setHasRequestedContacts] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const hashString = async (str: string): Promise<string> => {
    const encoder = new TextEncoder();
    const data = encoder.encode(str.toLowerCase().trim());
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  };

  const normalizePhoneNumber = (phone: string): string => {
    // Remove all non-numeric characters
    const cleaned = phone.replace(/\D/g, '');
    // Add country code if missing (assuming US)
    if (cleaned.length === 10) {
      return `+1${cleaned}`;
    }
    if (cleaned.length === 11 && cleaned.startsWith('1')) {
      return `+${cleaned}`;
    }
    return `+${cleaned}`;
  };

  const normalizeEmail = (email: string): string => {
    return email.toLowerCase().trim();
  };

  const requestContacts = async () => {
    if (!user) {
      toast({
        title: 'Authentication required',
        description: 'Please sign in to access contacts.',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    
    try {
      // Check if Contact Picker API is supported
      if ('contacts' in navigator && 'ContactsManager' in window) {
        const props = ['name', 'email', 'tel'];
        const opts = { multiple: true };
        
        // @ts-ignore - Contact Picker API is experimental
        const contacts = await navigator.contacts.select(props, opts);
        
        console.log('Selected contacts:', contacts);
        
        // Process and hash contacts
        const hashedContacts: { hashed_identifier: string; identifier_type: string }[] = [];
        
        for (const contact of contacts) {
          // Process emails
          if (contact.email && contact.email.length > 0) {
            for (const email of contact.email) {
              const normalizedEmail = normalizeEmail(email);
              const hashedEmail = await hashString(normalizedEmail);
              hashedContacts.push({
                hashed_identifier: hashedEmail,
                identifier_type: 'email'
              });
            }
          }
          
          // Process phone numbers
          if (contact.tel && contact.tel.length > 0) {
            for (const phone of contact.tel) {
              const normalizedPhone = normalizePhoneNumber(phone);
              const hashedPhone = await hashString(normalizedPhone);
              hashedContacts.push({
                hashed_identifier: hashedPhone,
                identifier_type: 'phone'
              });
            }
          }
        }
        
        console.log('Hashed contacts:', hashedContacts);
        
        if (hashedContacts.length > 0) {
          // Store hashed contacts
          const { error: storeError } = await supabase.rpc('add_hashed_contacts', {
            p_contacts: hashedContacts
          });

          if (storeError) {
            console.error('Error storing contacts:', storeError);
            throw storeError;
          }

          // Find matches
          const hashedIdentifiers = hashedContacts.map(c => c.hashed_identifier);
          const { data: matches, error: matchError } = await supabase.rpc('match_contacts', {
            p_hashed_contacts: hashedIdentifiers
          });

          if (matchError) {
            console.error('Error matching contacts:', matchError);
            throw matchError;
          }

          console.log('Contact matches:', matches);
          setMatchedContacts(matches || []);
          setHasRequestedContacts(true);

          if (matches && matches.length > 0) {
            toast({
              title: 'Contacts matched!',
              description: `Found ${matches.length} people you may know on ParentPal.`,
            });
            setCurrentSection('contacts');
          } else {
            toast({
              title: 'No matches found',
              description: 'No contacts found on ParentPal. You can still discover people in suggestions!',
            });
            setCurrentSection('suggestions');
          }
        } else {
          toast({
            title: 'No contacts processed',
            description: 'No valid contacts found to match.',
          });
          setCurrentSection('suggestions');
        }
      } else {
        // Fallback: Contact Picker API not supported
        toast({
          title: 'Feature not supported',
          description: 'Contact picker is not supported on this device. You can still discover people in suggestions!',
        });
        setCurrentSection('suggestions');
      }
    } catch (error: any) {
      console.error('Error requesting contacts:', error);
      
      if (error.name === 'NotAllowedError') {
        toast({
          title: 'Permission denied',
          description: 'Contacts access was denied. You can still discover people in suggestions!',
        });
      } else {
        toast({
          title: 'Error accessing contacts',
          description: 'Unable to access contacts. You can still discover people in suggestions!',
          variant: 'destructive',
        });
      }
      setCurrentSection('suggestions');
    } finally {
      setIsLoading(false);
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
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Shield className="h-5 w-5 text-green-600" />
                  <span className="font-medium text-green-800">Privacy Protected</span>
                </div>
                <p className="text-green-700 text-sm">
                  Your contacts are hashed and never stored in plain text. We only use them to find matches, then delete the hashed data.
                </p>
              </div>
              
              <Button
                onClick={requestContacts}
                disabled={isLoading}
                className="w-full"
                size="lg"
              >
                {isLoading ? 'Accessing Contacts...' : 'Connect Your Contacts'}
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
