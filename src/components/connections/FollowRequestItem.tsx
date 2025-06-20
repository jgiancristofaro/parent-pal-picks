
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Check, X, UserPlus } from 'lucide-react';
import { useFollowRequestActions } from '@/hooks/useFollowRequestActions';

interface FollowRequestItemProps {
  request: {
    id: string;
    requester_id: string;
    requester?: {
      full_name: string;
      avatar_url: string | null;
    };
    created_at: string;
  };
}

export const FollowRequestItem: React.FC<FollowRequestItemProps> = ({ request }) => {
  const {
    showFollowBack,
    respondToRequest,
    isRespondingToRequest,
    followBack,
    isFollowingBack,
  } = useFollowRequestActions();

  const requesterName = request.requester?.full_name || 'Unknown User';
  const requesterAvatar = request.requester?.avatar_url;

  return (
    <div className="flex items-center justify-between p-3 border rounded-lg">
      <div className="flex items-center space-x-3">
        <Avatar className="h-10 w-10">
          <AvatarImage src={requesterAvatar || undefined} />
          <AvatarFallback>
            {requesterName.split(' ').map(n => n[0]).join('').toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div>
          <h4 className="font-medium">{requesterName}</h4>
          <p className="text-sm text-gray-500">
            {new Date(request.created_at).toLocaleDateString()}
          </p>
        </div>
      </div>
      
      <div className="flex space-x-2">
        {showFollowBack.has(request.id) ? (
          // Show Follow Back button
          <Button
            size="sm"
            onClick={() => followBack(request.requester_id)}
            disabled={isFollowingBack}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <UserPlus size={16} />
            Follow Back
          </Button>
        ) : (
          // Show Approve/Deny buttons
          <>
            <Button
              size="sm"
              variant="outline"
              onClick={() => respondToRequest({ 
                requestId: request.id, 
                action: 'deny' 
              })}
              disabled={isRespondingToRequest}
            >
              <X size={16} />
              Deny
            </Button>
            <Button
              size="sm"
              onClick={() => respondToRequest({ 
                requestId: request.id, 
                action: 'approve' 
              })}
              disabled={isRespondingToRequest}
            >
              <Check size={16} />
              Approve
            </Button>
          </>
        )}
      </div>
    </div>
  );
};
