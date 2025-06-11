
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { testGooglePlacesService } from "@/services/testGooglePlacesService";

const TestGoogleAPI = () => {
  const [testResult, setTestResult] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  const runTest = async () => {
    setIsLoading(true);
    setTestResult(null);
    
    console.log('🚀 Starting Google API test...');
    const result = await testGooglePlacesService();
    
    setTestResult(result);
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Google API Test</h1>
          <p className="text-gray-600">
            Test the Google Places API integration and Edge Function
          </p>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>API Test</CardTitle>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={runTest} 
              disabled={isLoading}
              className="mb-4"
            >
              {isLoading ? "Testing..." : "Run Google API Test"}
            </Button>

            {testResult && (
              <div className="mt-4">
                <div className={`p-4 rounded-md ${
                  testResult.success ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
                }`}>
                  <h3 className={`font-semibold ${
                    testResult.success ? 'text-green-800' : 'text-red-800'
                  }`}>
                    {testResult.success ? '✅ Test Passed' : '❌ Test Failed'}
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
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Test Instructions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 text-sm text-gray-600">
              <p>
                <strong>This test will:</strong>
              </p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Verify that the GOOGLE_API_KEY secret is configured in Supabase</li>
                <li>Test the API key with a simple Google Places API call</li>
                <li>Check if the Edge Function can communicate with Google's servers</li>
                <li>Validate that the request/response format is correct</li>
                <li>Show detailed error information if something fails</li>
              </ul>
              <p className="mt-4">
                <strong>Check the browser console for detailed logs during the test.</strong>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TestGoogleAPI;
