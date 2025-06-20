
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, UserPlus, Mail, Send } from 'lucide-react';
import { Header } from '@/components/Header';
import { BottomNavigation } from '@/components/BottomNavigation';
import { MyConnectionsTab } from '@/components/connections/MyConnectionsTab';
import { SuggestionsTab } from '@/components/connections/SuggestionsTab';
import { InvitationsTab } from '@/components/connections/InvitationsTab';
import { InviteFriendsButton } from '@/components/connections/InviteFriendsButton';

const ConnectionsPage = () => {
  const [activeTab, setActiveTab] = useState('suggestions');

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <Header title="Connections" showBack={true} showSettings={false} />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Connections Hub</h1>
          <p className="text-gray-600">Discover, connect, and grow your network</p>
        </div>

        {/* Prominent Invite Friends Button */}
        <div className="mb-6">
          <InviteFriendsButton />
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="suggestions" className="flex items-center gap-2">
              <UserPlus className="w-4 h-4" />
              Suggestions
            </TabsTrigger>
            <TabsTrigger value="connections" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              My Connections
            </TabsTrigger>
            <TabsTrigger value="invitations" className="flex items-center gap-2">
              <Mail className="w-4 h-4" />
              Invitations
            </TabsTrigger>
          </TabsList>

          <TabsContent value="suggestions">
            <SuggestionsTab />
          </TabsContent>

          <TabsContent value="connections">
            <MyConnectionsTab />
          </TabsContent>

          <TabsContent value="invitations">
            <InvitationsTab />
          </TabsContent>
        </Tabs>
      </div>
      
      <BottomNavigation />
    </div>
  );
};

export default ConnectionsPage;
