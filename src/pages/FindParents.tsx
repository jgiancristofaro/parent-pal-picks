
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Header } from "@/components/Header";
import { BottomNavigation } from "@/components/BottomNavigation";
import { SearchInput } from "@/components/search/SearchInput";
import { ParentSearchResultCard } from "@/components/search/ParentSearchResultCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Search, Phone } from "lucide-react";

interface ProfileWithFollowStatus {
  id: string;
  full_name: string;
  username: string | null;
  avatar_url: string | null;
  profile_privacy_setting: string;
  follow_status: 'following' | 'request_pending' | 'not_following';
}

const FindParents = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [searchResults, setSearchResults] = useState<ProfileWithFollowStatus[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const { toast } = useToast();

  const searchProfiles = async (term?: string, phone?: string) => {
    if (!term && !phone) return [];

    setIsSearching(true);
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase.functions.invoke('search_profiles_v2', {
        body: {
          search_term: term || undefined,
          search_phone: phone || undefined,
          current_user_id: user.id
        }
      });

      if (error) {
        // Check if it's a rate limiting error
        if (error.message?.includes('Rate limit exceeded')) {
          toast({
            title: 'Search limit reached',
            description: phone 
              ? 'You\'ve reached the phone search limit. Please wait before searching again.'
              : 'You\'ve reached the search limit. Please wait before searching again.',
            variant: 'destructive',
          });
          return [];
        }
        throw error;
      }
      return data || [];
    } catch (error) {
      console.error('Search error:', error);
      toast({
        title: 'Search error',
        description: 'There was an error searching for users.',
        variant: 'destructive',
      });
      return [];
    } finally {
      setIsSearching(false);
    }
  };

  const handleNameSearch = async () => {
    if (!searchTerm.trim()) return;
    const results = await searchProfiles(searchTerm);
    setSearchResults(results);
  };

  const handlePhoneSearch = async () => {
    if (!phoneNumber.trim()) return;
    const results = await searchProfiles(undefined, phoneNumber);
    setSearchResults(results);
  };

  const handleKeyPress = (e: React.KeyboardEvent, searchType: 'name' | 'phone') => {
    if (e.key === 'Enter') {
      if (searchType === 'name') {
        handleNameSearch();
      } else {
        handlePhoneSearch();
      }
    }
  };

  return (
    <div className="min-h-screen pb-20 bg-gray-50">
      <Header title="Find Parents" showBack={true} showSettings={false} backTo="/search" />
      
      <div className="px-4 py-6">
        {/* Name/Username Search */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
          <h3 className="text-lg font-semibold mb-3">Search by Name</h3>
          <div className="relative mb-3">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <Input 
              className="pl-10 py-3" 
              placeholder="Search by name or username..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={(e) => handleKeyPress(e, 'name')}
            />
          </div>
          <Button 
            onClick={handleNameSearch} 
            className="w-full"
            disabled={!searchTerm.trim() || isSearching}
          >
            {isSearching ? 'Searching...' : 'Search'}
          </Button>
        </div>

        {/* Phone Number Search */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <h3 className="text-lg font-semibold mb-3">Search by Phone Number</h3>
          <div className="relative mb-3">
            <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <Input 
              className="pl-10 py-3" 
              placeholder="Enter phone number..."
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              onKeyPress={(e) => handleKeyPress(e, 'phone')}
            />
          </div>
          <Button 
            onClick={handlePhoneSearch} 
            className="w-full"
            disabled={!phoneNumber.trim() || isSearching}
          >
            {isSearching ? 'Searching...' : 'Search'}
          </Button>
        </div>

        {/* Search Results */}
        {searchResults.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-lg font-semibold">Search Results</h3>
            {searchResults.map((profile) => (
              <ParentSearchResultCard 
                key={profile.id} 
                profile={profile} 
                onFollowStatusChange={() => {
                  // Refresh search results after follow status changes
                  if (searchTerm) handleNameSearch();
                  if (phoneNumber) handlePhoneSearch();
                }}
              />
            ))}
          </div>
        )}

        {searchResults.length === 0 && (searchTerm || phoneNumber) && !isSearching && (
          <div className="text-center py-8 text-gray-500">
            No users found. Try a different search term.
          </div>
        )}
      </div>
      
      <BottomNavigation />
    </div>
  );
};

export default FindParents;
