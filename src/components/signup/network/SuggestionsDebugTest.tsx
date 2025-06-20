
import React, { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export const SuggestionsDebugTest = () => {
  const { user } = useAuth();
  const [testResult, setTestResult] = useState<any>(null);
  const [isTestRunning, setIsTestRunning] = useState(false);

  const runDirectTest = async () => {
    if (!user?.id) {
      setTestResult({ error: 'No user ID available' });
      return;
    }

    setIsTestRunning(true);
    console.log('🧪 Running direct test of get_onboarding_suggestions...');

    try {
      // Test the RPC function directly
      const { data, error } = await supabase.rpc('get_onboarding_suggestions', {
        p_user_id: user.id,
        p_limit: 15
      });

      console.log('🧪 Direct test result:', { data, error });
      setTestResult({ data, error, success: !error });
    } catch (err) {
      console.error('🧪 Direct test failed:', err);
      setTestResult({ error: err, success: false });
    } finally {
      setIsTestRunning(false);
    }
  };

  const checkCommunityLeaders = async () => {
    setIsTestRunning(true);
    console.log('👑 Checking for community leaders in database...');

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, full_name, is_community_leader')
        .eq('is_community_leader', true)
        .eq('is_suspended', false);

      console.log('👑 Community leaders found:', { data, error });
      setTestResult({ 
        communityLeaders: data, 
        error, 
        success: !error,
        message: `Found ${data?.length || 0} community leaders`
      });
    } catch (err) {
      console.error('👑 Community leaders check failed:', err);
      setTestResult({ error: err, success: false, message: 'Failed to check community leaders' });
    } finally {
      setIsTestRunning(false);
    }
  };

  return (
    <Card className="w-full mt-4 border-dashed border-orange-300">
      <CardHeader>
        <CardTitle className="text-sm text-orange-600">Debug Test Panel</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Button 
            onClick={runDirectTest} 
            disabled={isTestRunning || !user?.id}
            size="sm"
            variant="outline"
          >
            {isTestRunning ? 'Testing...' : 'Test RPC Function'}
          </Button>
          <Button 
            onClick={checkCommunityLeaders} 
            disabled={isTestRunning}
            size="sm"
            variant="outline"
          >
            {isTestRunning ? 'Checking...' : 'Check Community Leaders'}
          </Button>
        </div>
        
        <div className="text-xs text-gray-600">
          <p>User ID: {user?.id || 'Not available'}</p>
        </div>

        {testResult && (
          <div className="mt-4 p-3 bg-gray-50 rounded text-xs">
            <pre className="whitespace-pre-wrap overflow-auto max-h-40">
              {JSON.stringify(testResult, null, 2)}
            </pre>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
