
import { useState } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface MatchedContact {
  user_id: string;
  full_name: string;
  username: string | null;
  avatar_url: string | null;
  profile_privacy_setting: string;
  matched_identifier_count: number;
}

export const useContactsManager = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [matchedContacts, setMatchedContacts] = useState<MatchedContact[]>([]);
  const { toast } = useToast();

  const hashString = async (str: string): Promise<string> => {
    const encoder = new TextEncoder();
    const data = encoder.encode(str.toLowerCase().trim());
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  };

  const normalizePhoneNumber = (phone: string): string => {
    const cleaned = phone.replace(/\D/g, '');
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

          if (matches && matches.length > 0) {
            toast({
              title: 'Contacts matched!',
              description: `Found ${matches.length} people you may know on ParentPal.`,
            });
            return { success: true, matches: matches || [] };
          } else {
            toast({
              title: 'No matches found',
              description: 'No contacts found on ParentPal. You can still discover people in suggestions!',
            });
            return { success: true, matches: [] };
          }
        } else {
          toast({
            title: 'No contacts processed',
            description: 'No valid contacts found to match.',
          });
          return { success: true, matches: [] };
        }
      } else {
        // Fallback: Contact Picker API not supported
        toast({
          title: 'Feature not supported',
          description: 'Contact picker is not supported on this device. You can still discover people in suggestions!',
        });
        return { success: false, matches: [] };
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
      return { success: false, matches: [] };
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    matchedContacts,
    requestContacts
  };
};
