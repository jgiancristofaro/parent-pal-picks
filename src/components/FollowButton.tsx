
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { UserPlus, UserMinus, Clock } from "lucide-react";

interface FollowButtonProps {
  targetProfile: {
    id: string;
    full_name: string;
    profile_privacy_setting: string;
    follow_status: 'following' | 'request_pending' | 'not_following' | 'own_profile';
  };
  onStatusChange?: () => void;
  size?: 'sm' | 'default' | 'lg';
  variant?: 'default' | 'outline' | 'ghost';
}

export const FollowButton = ({ 
  targetProfile, 
  onStatusChange, 
  size = 'sm',
  variant = 'default'
}: FollowButtonProps) => {
  const [currentFollowStatus, setCurrentFollowStatus] = useState(targetProfile.follow_status);
  const { toast } = useToast();
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Don't show button for own profile
  if (currentFollowStatus === 'own_profile') {
    return null;
  }

  const followMutation = useMutation({
    mutationFn: async () => {
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase.functions.invoke('request_follow', {
        body: {
          current_user_id: user.id,
          target_user_id: targetProfile.id
        }
      });

      if (error) {
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
          ? `You are now following ${targetProfile.full_name}` 
          : `Follow request sent to ${targetProfile.full_name}`,
      });
      queryClient.invalidateQueries({ queryKey: ['profile', targetProfile.id] });
      onStatusChange?.();
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
          target_user_id: targetProfile.id
        }
      });

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      setCurrentFollowStatus('not_following');
      toast({
        title: 'Unfollowed',
        description: `You are no longer following ${targetProfile.full_name}`,
      });
      queryClient.invalidateQueries({ queryKey: ['profile', targetProfile.id] });
      onStatusChange?.();
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

      const { data, error } = await supabase
        .from('follow_requests')
        .delete()
        .eq('requester_id', user.id)
        .eq('requestee_id', targetProfile.id)
        .eq('status', 'pending');

      if (error) {
        throw new Error(`Failed to cancel follow request: ${error.message}`);
      }

      return data;
    },
    onSuccess: () => {
      setCurrentFollowStatus('not_following');
      toast({
        title: 'Request cancelled',
        description: `Follow request to ${targetProfile.full_name} has been cancelled`,
      });
      queryClient.invalidateQueries({ queryKey: ['profile', targetProfile.id] });
      onStatusChange?.();
    },
    onError: (error) => {
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
          text: targetProfile.profile_privacy_setting === 'public' ? 'Follow' : 'Request Follow',
          variant: variant,
          onClick: () => followMutation.mutate(),
          icon: UserPlus,
          disabled: followMutation.isPending
        };
    }
  };

  const buttonConfig = getButtonConfig();
  const ButtonIcon = buttonConfig.icon;

  return (
    <Button
      variant={buttonConfig.variant}
      size={size}
      onClick={buttonConfig.onClick}
      disabled={buttonConfig.disabled}
      className="flex items-center gap-2"
    >
      <ButtonIcon size={16} />
      {buttonConfig.text}
    </Button>
  );
};
