
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, AlertTriangle, Calendar, User, Star } from 'lucide-react';
import { useAdminFlaggedContent } from '@/hooks/useFlaggedContent';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';

const AdminContentModeration = () => {
  const navigate = useNavigate();
  const { flaggedContent, isLoading, resolveFlag, isResolving } = useAdminFlaggedContent();
  const [selectedFlag, setSelectedFlag] = useState<any>(null);
  const [actionType, setActionType] = useState<'dismiss' | 'delete_content' | null>(null);
  const [resolutionReason, setResolutionReason] = useState('');

  const handleResolveFlag = () => {
    if (!selectedFlag || !actionType) return;

    resolveFlag({
      flagId: selectedFlag.flag_id,
      action: actionType,
      reason: resolutionReason || undefined,
    });

    setSelectedFlag(null);
    setActionType(null);
    setResolutionReason('');
  };

  const openConfirmDialog = (flag: any, action: 'dismiss' | 'delete_content') => {
    setSelectedFlag(flag);
    setActionType(action);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-8">
            <p className="text-gray-500">Loading flagged content...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              onClick={() => navigate('/admin')}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Dashboard
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Content Moderation</h1>
              <p className="text-gray-600">Review and manage flagged content</p>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <AlertTriangle className="w-8 h-8 text-orange-600" />
                <div>
                  <p className="text-2xl font-bold">{flaggedContent.length}</p>
                  <p className="text-gray-600">Pending Flags</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Flagged Content List */}
        <Card>
          <CardHeader>
            <CardTitle>Flagged Content Queue</CardTitle>
          </CardHeader>
          <CardContent>
            {flaggedContent.length === 0 ? (
              <div className="text-center py-8">
                <AlertTriangle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No flagged content to review</p>
              </div>
            ) : (
              <div className="space-y-6">
                {flaggedContent.map((flag) => (
                  <Card key={flag.flag_id} className="border-l-4 border-l-orange-500">
                    <CardContent className="p-6">
                      {/* Flag Info */}
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-4">
                          <Badge variant="destructive">
                            <AlertTriangle className="w-3 h-3 mr-1" />
                            Flagged
                          </Badge>
                          <div className="text-sm text-gray-600">
                            <div className="flex items-center gap-1">
                              <User className="w-3 h-3" />
                              Reported by: {flag.reporter_name}
                            </div>
                            <div className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {new Date(flag.created_at).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Flag Reason */}
                      <div className="mb-4 p-3 bg-red-50 rounded-lg">
                        <p className="text-sm font-medium text-red-800 mb-1">Reason for flagging:</p>
                        <p className="text-red-700">{flag.reason}</p>
                      </div>

                      {/* Flagged Content */}
                      {flag.content_data && (
                        <div className="mb-4 p-4 bg-gray-50 rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <p className="font-medium">Review by {flag.content_data.author_name}</p>
                              <div className="flex items-center gap-1">
                                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                <span className="text-sm">{flag.content_data.rating}/5</span>
                              </div>
                            </div>
                            <p className="text-sm text-gray-500">
                              {new Date(flag.content_data.created_at).toLocaleDateString()}
                            </p>
                          </div>
                          
                          {flag.content_data.title && (
                            <h4 className="font-semibold mb-2">{flag.content_data.title}</h4>
                          )}
                          
                          <p className="text-gray-700 mb-2">{flag.content_data.content}</p>
                          
                          {(flag.content_data.sitter_name || flag.content_data.product_name) && (
                            <p className="text-sm text-gray-600">
                              For: {flag.content_data.sitter_name || flag.content_data.product_name}
                            </p>
                          )}
                        </div>
                      )}

                      {/* Action Buttons */}
                      <div className="flex gap-3">
                        <Button
                          variant="outline"
                          onClick={() => openConfirmDialog(flag, 'dismiss')}
                          disabled={isResolving}
                        >
                          Dismiss Flag
                        </Button>
                        <Button
                          variant="destructive"
                          onClick={() => openConfirmDialog(flag, 'delete_content')}
                          disabled={isResolving}
                        >
                          Delete Content
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Confirmation Dialog */}
        <Dialog open={!!selectedFlag} onOpenChange={() => {
          setSelectedFlag(null);
          setActionType(null);
          setResolutionReason('');
        }}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {actionType === 'dismiss' ? 'Dismiss Flag' : 'Delete Content'}
              </DialogTitle>
              <DialogDescription>
                {actionType === 'dismiss' 
                  ? 'This will mark the flag as resolved without taking action on the content.'
                  : 'This will permanently delete the flagged content and resolve the flag.'}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Resolution notes (optional)</label>
                <Textarea
                  placeholder="Add any notes about your decision..."
                  value={resolutionReason}
                  onChange={(e) => setResolutionReason(e.target.value)}
                  className="mt-1"
                  rows={3}
                />
              </div>
            </div>

            <DialogFooter>
              <Button 
                variant="outline" 
                onClick={() => {
                  setSelectedFlag(null);
                  setActionType(null);
                  setResolutionReason('');
                }}
              >
                Cancel
              </Button>
              <Button
                variant={actionType === 'delete_content' ? 'destructive' : 'default'}
                onClick={handleResolveFlag}
                disabled={isResolving}
              >
                {isResolving ? 'Processing...' : 
                  actionType === 'dismiss' ? 'Dismiss Flag' : 'Delete Content'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default AdminContentModeration;
