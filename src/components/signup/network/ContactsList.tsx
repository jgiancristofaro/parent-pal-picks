
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { FollowButton } from '@/components/FollowButton';
import { useToast } from '@/components/ui/use-toast';
import { Users, ArrowRight } from 'lucide-react';

interface Contact {
  user_id: string;
  full_name: string;
  username: string | null;
  avatar_url: string | null;
  profile_privacy_setting: string;
  matched_identifier_count: number;
}

interface ContactsListProps {
  contacts: Contact[];
  onComplete: (followedCount: number) => void;
  onSkip: () => void;
}

export const ContactsList = ({ contacts, onComplete, onSkip }: ContactsListProps) => {
  const [followedCount, setFollowedCount] = useState(0);
  const { toast } = useToast();

  const handleFollowStatusChange = () => {
    // Increment followed count - this is a simple approach
    // In a real app, you might want to track individual follow states
    setFollowedCount(prev => prev + 1);
  };

  const handleFollowAll = () => {
    // This would trigger follow actions for all contacts
    // For now, we'll simulate it
    toast({
      title: 'Following all contacts',
      description: 'Sending follow requests to all matched contacts.',
    });
    setFollowedCount(contacts.length);
  };

  const handleContinue = () => {
    onComplete(followedCount);
  };

  return (
    <Card className="w-full">
      <CardHeader className="text-center">
        <div className="mx-auto mb-4 p-3 bg-green-100 rounded-full w-fit">
          <Users className="h-8 w-8 text-green-600" />
        </div>
        <CardTitle className="text-xl">Friends Found!</CardTitle>
        <p className="text-gray-600 text-sm">
          We found {contacts.length} people you may know on ParentPal.
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {contacts.length > 1 && (
          <Button
            onClick={handleFollowAll}
            className="w-full"
            variant="outline"
          >
            Follow All ({contacts.length})
          </Button>
        )}
        
        <div className="space-y-3 max-h-80 overflow-y-auto">
          {contacts.map((contact) => (
            <div
              key={contact.user_id}
              className="flex items-center justify-between p-3 border rounded-lg bg-white"
            >
              <div className="flex items-center space-x-3">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={contact.avatar_url || undefined} />
                  <AvatarFallback>
                    {contact.full_name.split(' ').map(n => n[0]).join('').toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-semibold text-gray-900">{contact.full_name}</h3>
                  {contact.username && (
                    <p className="text-sm text-gray-500">@{contact.username}</p>
                  )}
                  <p className="text-xs text-gray-400">
                    {contact.matched_identifier_count} contact{contact.matched_identifier_count > 1 ? 's' : ''} match
                  </p>
                </div>
              </div>
              
              <FollowButton
                targetProfile={{
                  id: contact.user_id,
                  full_name: contact.full_name,
                  profile_privacy_setting: contact.profile_privacy_setting,
                  follow_status: 'not_following' as const
                }}
                onStatusChange={handleFollowStatusChange}
                size="sm"
              />
            </div>
          ))}
        </div>
        
        <div className="flex gap-3 pt-4">
          <Button
            onClick={onSkip}
            variant="outline"
            className="flex-1"
          >
            Skip
          </Button>
          <Button
            onClick={handleContinue}
            className="flex-1 flex items-center gap-2"
          >
            Continue
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
