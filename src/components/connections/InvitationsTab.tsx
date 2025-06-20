
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, Mail, CheckCircle, Clock, X } from 'lucide-react';
import { useFollowRequests } from '@/hooks/useFollowRequests';
import { FollowRequestItem } from './FollowRequestItem';

export const InvitationsTab = () => {
  const {
    incomingRequests = [],
    outgoingRequests = [],
    isLoadingIncoming,
    isLoadingOutgoing,
    cancelFollowRequest,
    isCancellingRequest
  } = useFollowRequests();

  const pendingOutgoingRequests = outgoingRequests.filter(req => req.status === 'pending');
  const approvedRequests = outgoingRequests.filter(req => req.status === 'approved');

  return (
    <div className="space-y-6">
      {/* Incoming Requests */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="w-5 h-5" />
            Pending Follow Requests ({incomingRequests.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoadingIncoming ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-purple-600" />
              <span className="ml-2 text-gray-600">Loading requests...</span>
            </div>
          ) : incomingRequests.length > 0 ? (
            <div className="space-y-4">
              {incomingRequests.map((request) => (
                <FollowRequestItem key={request.id} request={request} />
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Mail className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No pending follow requests</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Outgoing Requests */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Sent Requests ({pendingOutgoingRequests.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoadingOutgoing ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-purple-600" />
              <span className="ml-2 text-gray-600">Loading sent requests...</span>
            </div>
          ) : pendingOutgoingRequests.length > 0 ? (
            <div className="space-y-4">
              {pendingOutgoingRequests.map((request) => (
                <div key={request.id} className="flex items-center justify-between p-4 bg-white rounded-lg border">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                      {request.requestee?.avatar_url ? (
                        <img
                          src={request.requestee.avatar_url}
                          alt={request.requestee.full_name}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                      ) : (
                        <Clock className="w-5 h-5 text-gray-600" />
                      )}
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">
                        {request.requestee?.full_name || 'Unknown User'}
                      </h4>
                      <p className="text-sm text-gray-600">
                        @{request.requestee?.username || 'unknown'}
                      </p>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => cancelFollowRequest(request.requestee_id)}
                    disabled={isCancellingRequest}
                  >
                    <X className="w-4 h-4 mr-1" />
                    Cancel
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No pending sent requests</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Successful Connections */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5" />
            Recent Connections ({approvedRequests.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {approvedRequests.length > 0 ? (
            <div className="space-y-3">
              {approvedRequests.slice(0, 5).map((request) => (
                <div key={request.id} className="flex items-center gap-3 p-3 bg-green-50 rounded-lg border border-green-200">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <div>
                    <h4 className="font-medium text-gray-900">
                      {request.requestee?.full_name || 'Unknown User'}
                    </h4>
                    <p className="text-sm text-gray-600">Connection approved</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <CheckCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No recent connections</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
