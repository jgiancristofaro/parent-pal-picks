
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { UserPlus, UserMinus, Clock } from "lucide-react";

interface Profile {
  id: string;
  full_name: string;
  username: string | null;
  avatar_url: string | null;
  profile_privacy_setting: string;
  follow_status: 'following' | 'request_pending' | 'not_following';
}

interface ParentSearchResultCardProps {
  profile: Profile;
  onFollowStatusChange?: () => void;
}

export const ParentSearchResultCard = ({ profile, onFollowStatusChange }: ParentSearchResultCardProps) => {
  const [currentFollowStatus, setCurrentFollowStatus] = useState(profile.follow_status);
  const { toast } = useToast();
  const { user } = useAuth();

  const followMutation = useMutation({
    mutationFn: async () => {
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase.functions.invoke('request_follow', {
        body: {
          current_user_id: user.id,
          target_user_id: profile.id
        }
      });

      if (error) {
        // Check if it's a rate limiting error
        if (error.message?.includes('Rate limit exceeded')) {
          throw new Error('You\'ve reached the follow request limit. Please wait before sending more requests.');
        }
        throw error;
      }
      return data;
    },
    onSuccess: (data) => {
      setCurrentFollowStatus(data.status === 'following' ? 'following' : 'request_pending');
      toast({
        title: data.status === 'following' ? 'Now following' : 'Follow request sent',
        description: data.status === 'following' 
          ? `You are now following ${profile.full_name}` 
          : `Follow request sent to ${profile.full_name}`,
      });
      onFollowStatusChange?.();
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to send follow request',
        variant: 'destructive',
      });
    },
  });

  const unfollowMutation = useMutation({
    mutationFn: async () => {
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase.functions.invoke('unfollow_user', {
        body: {
          current_user_id: user.id,
          target_user_id: profile.id
        }
      });

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      setCurrentFollowStatus('not_following');
      toast({
        title: 'Unfollowed',
        description: `You are no longer following ${profile.full_name}`,
      });
      onFollowStatusChange?.();
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: 'Failed to unfollow user',
        variant: 'destructive',
      });
    },
  });

  const cancelRequestMutation = useMutation({
    mutationFn: async () => {
      if (!user) {
        throw new Error('Not authenticated');
      }

      // Ensure we have a valid session before making the request
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError || !session) {
        console.error('Session error:', sessionError);
        throw new Error('Authentication session invalid. Please log in again.');
      }

      console.log('Making cancel request with user:', user.id, 'target:', profile.id);

      const { data, error } = await supabase.functions.invoke('cancel_follow_request', {
        body: {
          target_user_id: profile.id
        }
      });

      if (error) {
        console.error('Cancel request error:', error);
        
        // Handle specific error types
        if (error.message?.includes('Authentication')) {
          throw new Error('Authentication failed. Please log in again.');
        }
        
        if (error.message?.includes('404') || error.message?.includes('No pending')) {
          throw new Error('No pending follow request found to cancel.');
        }
        
        throw error;
      }
      
      return data;
    },
    onSuccess: () => {
      setCurrentFollowStatus('not_following');
      toast({
        title: 'Request cancelled',
        description: `Follow request to ${profile.full_name} has been cancelled`,
      });
      onFollowStatusChange?.();
    },
    onError: (error) => {
      console.error('Cancel mutation error:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to cancel follow request',
        variant: 'destructive',
      });
    },
  });

  const getButtonConfig = () => {
    switch (currentFollowStatus) {
      case 'following':
        return {
          text: 'Unfollow',
          variant: 'outline' as const,
          onClick: () => unfollowMutation.mutate(),
          icon: UserMinus,
          disabled: unfollowMutation.isPending
        };
      case 'request_pending':
        return {
          text: 'Requested',
          variant: 'outline' as const,
          onClick: () => cancelRequestMutation.mutate(),
          icon: Clock,
          disabled: cancelRequestMutation.isPending
        };
      default:
        return {
          text: profile.profile_privacy_setting === 'public' ? 'Follow' : 'Request Follow',
          variant: 'default' as const,
          onClick: () => followMutation.mutate(),
          icon: UserPlus,
          disabled: followMutation.isPending
        };
    }
  };

  const buttonConfig = getButtonConfig();
  const ButtonIcon = buttonConfig.icon;

  return (
    <Card className="w-full">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Avatar className="h-12 w-12">
              <AvatarImage src={profile.avatar_url || undefined} />
              <AvatarFallback>
                {profile.full_name.split(' ').map(n => n[0]).join('').toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-semibold text-gray-900">{profile.full_name}</h3>
              {profile.username && (
                <p className="text-sm text-gray-500">@{profile.username}</p>
              )}
              <p className="text-xs text-gray-400 capitalize">
                {profile.profile_privacy_setting} profile
              </p>
            </div>
          </div>
          
          <Button
            variant={buttonConfig.variant}
            size="sm"
            onClick={buttonConfig.onClick}
            disabled={buttonConfig.disabled}
            className="flex items-center gap-2"
          >
            <ButtonIcon size={16} />
            {buttonConfig.text}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
