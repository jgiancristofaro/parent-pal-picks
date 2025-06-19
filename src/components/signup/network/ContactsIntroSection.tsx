
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Shield } from 'lucide-react';

interface ContactsIntroSectionProps {
  onRequestContacts: () => void;
  onSkipToSuggestions: () => void;
  isLoading: boolean;
}

export const ContactsIntroSection = ({ 
  onRequestContacts, 
  onSkipToSuggestions, 
  isLoading 
}: ContactsIntroSectionProps) => {
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
          onClick={onRequestContacts}
          disabled={isLoading}
          className="w-full"
          size="lg"
        >
          {isLoading ? 'Accessing Contacts...' : 'Connect Your Contacts'}
        </Button>
        
        <Button
          onClick={onSkipToSuggestions}
          variant="outline"
          className="w-full"
          size="lg"
        >
          Skip to Suggestions
        </Button>
      </CardContent>
    </Card>
  );
};
