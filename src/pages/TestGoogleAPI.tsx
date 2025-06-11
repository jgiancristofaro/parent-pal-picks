
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { testGooglePlacesService } from "@/services/testGooglePlacesService";
import { testGooglePlacesDirectFetch } from "@/services/directFetchTestService";

const TestGoogleAPI = () => {
  const [supabaseTestResult, setSupabaseTestResult] = useState<any>(null);
  const [directFetchTestResult, setDirectFetchTestResult] = useState<any>(null);
  const [isLoadingSupabase, setIsLoadingSupabase] = useState(false);
  const [isLoadingDirectFetch, setIsLoadingDirectFetch] = useState(false);

  const runSupabaseTest = async () => {
    setIsLoadingSupabase(true);
    setSupabaseTestResult(null);
    
    console.log('🚀 Starting Supabase Client Google API test...');
    const result = await testGooglePlacesService();
    
    setSupabaseTestResult(result);
    setIsLoadingSupabase(false);
  };

  const runDirectFetchTest = async () => {
    setIsLoadingDirectFetch(true);
    setDirectFetchTestResult(null);
    
    console.log('🚀 Starting Direct Fetch Google API test...');
    const result = await testGooglePlacesDirectFetch();
    
    setDirectFetchTestResult(result);
    setIsLoadingDirectFetch(false);
  };

  const renderTestResult = (testResult: any, testType: string) => {
    if (!testResult) return null;

    return (
      <div className={`p-4 rounded-md ${
        testResult.success ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
      }`}>
        <h3 className={`font-semibold ${
          testResult.success ? 'text-green-800' : 'text-red-800'
        }`}>
          {testResult.success ? `✅ ${testType} Test Passed` : `❌ ${testType} Test Failed`}
        </h3>
        
        {testResult.success ? (
          <div className="mt-2 space-y-2">
            <p className="text-green-700">
              Google Places API is working correctly!
            </p>
            {testResult.summary && (
              <div className="text-sm text-green-600">
                <p>Status: {testResult.summary.status}</p>
                <p>Predictions returned: {testResult.summary.predictionsCount}</p>
                {testResult.summary.firstPrediction && (
                  <p>First prediction: {testResult.summary.firstPrediction}</p>
                )}
              </div>
            )}
          </div>
        ) : (
          <div className="mt-2">
            <p className="text-red-700 font-medium">Error: {testResult.error}</p>
            {testResult.details && (
              <details className="mt-2">
                <summary className="text-sm text-red-600 cursor-pointer">
                  View error details
                </summary>
                <pre className="mt-1 text-xs text-red-600 bg-red-100 p-2 rounded overflow-auto">
                  {JSON.stringify(testResult.details, null, 2)}
                </pre>
              </details>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Google API Test</h1>
          <p className="text-gray-600">
            Test the Google Places API integration using different methods
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Supabase Client Test</CardTitle>
            </CardHeader>
            <CardContent>
              <Button 
                onClick={runSupabaseTest} 
                disabled={isLoadingSupabase}
                className="mb-4 w-full"
              >
                {isLoadingSupabase ? "Testing..." : "Run Supabase Client Test"}
              </Button>

              {renderTestResult(supabaseTestResult, "Supabase Client")}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Direct Fetch Test</CardTitle>
            </CardHeader>
            <CardContent>
              <Button 
                onClick={runDirectFetchTest} 
                disabled={isLoadingDirectFetch}
                className="mb-4 w-full"
                variant="outline"
              >
                {isLoadingDirectFetch ? "Testing..." : "Run Direct Fetch Test"}
              </Button>

              {renderTestResult(directFetchTestResult, "Direct Fetch")}
            </CardContent>
          </Card>
        </div>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Test Instructions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 text-sm text-gray-600">
              <p>
                <strong>This comparison test will help identify the issue:</strong>
              </p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li><strong>Supabase Client Test:</strong> Uses the official Supabase client invoke method</li>
                <li><strong>Direct Fetch Test:</strong> Makes a direct HTTP request to the Edge Function URL</li>
                <li>Both tests send identical data to the same Google Places API endpoint</li>
                <li>If Direct Fetch works but Supabase Client fails, the issue is with the client invocation</li>
                <li>If both fail the same way, the issue is with the Edge Function itself</li>
              </ul>
              <p className="mt-4">
                <strong>Check the browser console for detailed logs during both tests.</strong>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TestGoogleAPI;
