
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { ContactsList } from './ContactsList';
import { Contacts, Shield, ArrowRight } from 'lucide-react';

interface ContactMatchingSectionProps {
  onComplete: (followedCount: number) => void;
  onSkip: () => void;
}

interface MatchedContact {
  user_id: string;
  full_name: string;
  username: string | null;
  avatar_url: string | null;
  profile_privacy_setting: string;
  matched_identifier_count: number;
}

export const ContactMatchingSection = ({ onComplete, onSkip }: ContactMatchingSectionProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [matchedContacts, setMatchedContacts] = useState<MatchedContact[]>([]);
  const [hasRequested, setHasRequested] = useState(false);
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
          setHasRequested(true);

          if (matches && matches.length > 0) {
            toast({
              title: 'Contacts matched!',
              description: `Found ${matches.length} people you may know on ParentPal.`,
            });
          } else {
            toast({
              title: 'No matches found',
              description: 'No contacts found on ParentPal. You can still discover people in suggestions!',
            });
          }
        } else {
          toast({
            title: 'No contacts processed',
            description: 'No valid contacts found to match.',
          });
          setHasRequested(true);
        }
      } else {
        // Fallback: Contact Picker API not supported
        toast({
          title: 'Feature not supported',
          description: 'Contact picker is not supported on this device. You can still discover people in suggestions!',
        });
        setHasRequested(true);
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
      setHasRequested(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFollowComplete = (followedCount: number) => {
    onComplete(followedCount);
  };

  if (hasRequested) {
    if (matchedContacts.length > 0) {
      return (
        <ContactsList
          contacts={matchedContacts}
          onComplete={handleFollowComplete}
          onSkip={() => onComplete(0)}
        />
      );
    } else {
      return (
        <Card className="w-full">
          <CardContent className="pt-6 text-center space-y-4">
            <div className="mx-auto p-3 bg-gray-100 rounded-full w-fit">
              <Contacts className="h-8 w-8 text-gray-600" />
            </div>
            <div>
              <h3 className="font-semibold mb-2">No contacts found</h3>
              <p className="text-gray-600 text-sm">
                No contacts found on ParentPal. Let's find people you may know!
              </p>
            </div>
            <Button onClick={() => onComplete(0)} className="w-full">
              Continue to Suggestions
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </CardContent>
        </Card>
      );
    }
  }

  return (
    <Card className="w-full">
      <CardHeader className="text-center">
        <div className="mx-auto mb-4 p-3 bg-blue-100 rounded-full w-fit">
          <Contacts className="h-8 w-8 text-blue-600" />
        </div>
        <CardTitle className="text-xl">Find Friends from Your Contacts</CardTitle>
        <p className="text-gray-600 text-sm">
          We'll help you find people you know who are already on ParentPal.
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
          onClick={onSkip}
          variant="outline"
          className="w-full"
        >
          Skip This Step
        </Button>
      </CardContent>
    </Card>
  );
};
