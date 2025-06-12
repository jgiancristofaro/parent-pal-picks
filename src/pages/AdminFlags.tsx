
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, Calendar, User, Star, Trash2, X } from 'lucide-react';
import { useAdminFlags } from '@/hooks/useAdminFlags';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

const AdminFlags = () => {
  const { profile } = useAuth();
  const { flags, loading, resolveFlag } = useAdminFlags();
  const [resolvingFlags, setResolvingFlags] = useState<Set<string>>(new Set());

  // Redirect if not admin
  if (profile?.role !== 'ADMIN') {
    return <Navigate to="/admin" replace />;
  }

  const handleResolveFlag = async (flagId: string, action: 'dismiss' | 'delete_content') => {
    setResolvingFlags(prev => new Set(prev).add(flagId));
    
    const success = await resolveFlag(flagId, action);
    
    setResolvingFlags(prev => {
      const newSet = new Set(prev);
      newSet.delete(flagId);
      return newSet;
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < rating ? 'text-yellow-500 fill-current' : 'text-gray-300'
        }`}
      />
    ));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center space-x-3 mb-8">
            <AlertTriangle className="h-8 w-8 text-red-600" />
            <h1 className="text-2xl font-bold text-gray-900">Content Moderation</h1>
          </div>
          <p className="text-gray-600">Loading flagged content...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-3">
            <AlertTriangle className="h-8 w-8 text-red-600" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Content Moderation</h1>
              <p className="text-gray-600">Review and manage flagged content</p>
            </div>
          </div>
          <Badge variant="secondary" className="text-lg px-3 py-1">
            {flags.length} pending flags
          </Badge>
        </div>

        {flags.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <AlertTriangle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No flagged content</h3>
              <p className="text-gray-600">All reports have been resolved.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {flags.map((flag) => (
              <Card key={flag.flag_id} className="overflow-hidden">
                <CardHeader className="bg-red-50 border-b border-red-100">
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center space-x-2">
                      <AlertTriangle className="h-5 w-5 text-red-600" />
                      <span>Flagged {flag.content_type}</span>
                    </CardTitle>
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <div className="flex items-center space-x-1">
                        <User className="h-4 w-4" />
                        <span>Reported by {flag.reporter_name}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-4 w-4" />
                        <span>{formatDate(flag.created_at)}</span>
                      </div>
                    </div>
                  </div>
                  <div className="mt-2">
                    <Badge variant="destructive" className="mr-2">
                      {flag.reason}
                    </Badge>
                  </div>
                </CardHeader>

                <CardContent className="p-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Flagged Content */}
                    <div className="space-y-4">
                      <h4 className="font-medium text-gray-900">Flagged Content:</h4>
                      <div className="bg-gray-50 rounded-lg p-4 border-l-4 border-red-500">
                        <div className="flex items-center space-x-2 mb-2">
                          <div className="flex">{renderStars(flag.content_data.rating)}</div>
                          <span className="text-sm text-gray-600">
                            by {flag.content_data.author_name}
                          </span>
                        </div>
                        
                        <h5 className="font-medium text-gray-900 mb-2">
                          {flag.content_data.title}
                        </h5>
                        
                        <p className="text-gray-700 text-sm leading-relaxed">
                          {flag.content_data.content}
                        </p>
                        
                        <div className="mt-3 text-xs text-gray-500">
                          {flag.content_data.sitter_name && (
                            <span>Sitter: {flag.content_data.sitter_name} • </span>
                          )}
                          {flag.content_data.product_name && (
                            <span>Product: {flag.content_data.product_name} • </span>
                          )}
                          <span>{formatDate(flag.content_data.created_at)}</span>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="space-y-4">
                      <h4 className="font-medium text-gray-900">Actions:</h4>
                      <div className="space-y-3">
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button 
                              variant="destructive" 
                              className="w-full"
                              disabled={resolvingFlags.has(flag.flag_id)}
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              Delete Content
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete Content</AlertDialogTitle>
                              <AlertDialogDescription>
                                This will permanently delete the review and resolve the flag. 
                                This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleResolveFlag(flag.flag_id, 'delete_content')}
                                className="bg-red-600 hover:bg-red-700"
                              >
                                Delete Content
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>

                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button 
                              variant="outline" 
                              className="w-full"
                              disabled={resolvingFlags.has(flag.flag_id)}
                            >
                              <X className="w-4 h-4 mr-2" />
                              Dismiss Flag
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Dismiss Flag</AlertDialogTitle>
                              <AlertDialogDescription>
                                This will mark the flag as resolved without taking action 
                                on the content. The content will remain visible.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleResolveFlag(flag.flag_id, 'dismiss')}
                              >
                                Dismiss Flag
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminFlags;
