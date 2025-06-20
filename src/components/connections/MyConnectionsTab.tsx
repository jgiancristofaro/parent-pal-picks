
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Loader2, Users, Search } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useProfileFollowers } from '@/hooks/useProfileFollowers';
import { useProfileFollowing } from '@/hooks/useProfileFollowing';
import { useDebouncedSearch } from '@/hooks/useDebouncedSearch';

export const MyConnectionsTab = () => {
  const { user } = useAuth();
  const [followersSearch, setFollowersSearch] = useState('');
  const [followingSearch, setFollowingSearch] = useState('');
  
  const debouncedFollowersSearch = useDebouncedSearch(followersSearch, 300);
  const debouncedFollowingSearch = useDebouncedSearch(followingSearch, 300);
  
  const { data: followers = [], isLoading: followersLoading } = useProfileFollowers(user?.id);
  const { data: following = [], isLoading: followingLoading } = useProfileFollowing(user?.id);

  const filteredFollowers = followers.filter(follower =>
    follower.full_name.toLowerCase().includes(debouncedFollowersSearch.toLowerCase())
  );

  const filteredFollowing = following.filter(followedUser =>
    followedUser.full_name.toLowerCase().includes(debouncedFollowingSearch.toLowerCase())
  );

  const ConnectionsList = ({ connections, isLoading, searchTerm, onSearchChange, emptyMessage }) => (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <Input
          placeholder="Search connections..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10"
        />
      </div>
      
      {isLoading ? (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-purple-600" />
          <span className="ml-2 text-gray-600">Loading...</span>
        </div>
      ) : connections.length > 0 ? (
        <div className="space-y-3">
          {connections.map((connection) => (
            <div key={connection.id} className="flex items-center gap-3 p-3 bg-white rounded-lg border hover:shadow-sm transition-shadow">
              <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                {connection.avatar_url ? (
                  <img
                    src={connection.avatar_url}
                    alt={connection.full_name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                ) : (
                  <Users className="w-5 h-5 text-purple-600" />
                )}
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-gray-900">{connection.full_name}</h4>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">{emptyMessage}</p>
        </div>
      )}
    </div>
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="w-5 h-5" />
          My Connections
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="following" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="following">
              Following ({following.length})
            </TabsTrigger>
            <TabsTrigger value="followers">
              Followers ({followers.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="following">
            <ConnectionsList
              connections={filteredFollowing}
              isLoading={followingLoading}
              searchTerm={followingSearch}
              onSearchChange={setFollowingSearch}
              emptyMessage="You're not following anyone yet. Start by following some people from the suggestions tab!"
            />
          </TabsContent>

          <TabsContent value="followers">
            <ConnectionsList
              connections={filteredFollowers}
              isLoading={followersLoading}
              searchTerm={followersSearch}
              onSearchChange={setFollowersSearch}
              emptyMessage="No followers yet. Share your profile to start building your network!"
            />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
