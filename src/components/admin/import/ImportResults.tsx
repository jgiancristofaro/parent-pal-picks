
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, CheckCircle } from 'lucide-react';

interface ImportResultsProps {
  importResult: any;
}

const ImportResults = ({ importResult }: ImportResultsProps) => {
  if (!importResult) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {importResult.success ? (
            <CheckCircle className="w-5 h-5 text-green-600" />
          ) : (
            <AlertCircle className="w-5 h-5 text-red-600" />
          )}
          Import Results
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {importResult.success ? (
            <div className="bg-green-50 p-4 rounded-lg">
              <p className="text-green-800">
                Successfully imported {importResult.imported} records
              </p>
              {importResult.errors > 0 && (
                <p className="text-orange-800 mt-2">
                  {importResult.errors} rows had validation errors and were skipped
                </p>
              )}
            </div>
          ) : (
            <div className="bg-red-50 p-4 rounded-lg">
              <p className="text-red-800">Import failed: {importResult.error}</p>
            </div>
          )}

          {importResult.validationErrors && importResult.validationErrors.length > 0 && (
            <div>
              <h4 className="font-medium mb-2">Validation Errors:</h4>
              <div className="bg-gray-50 p-3 rounded-lg max-h-32 overflow-auto">
                <ul className="text-sm space-y-1">
                  {importResult.validationErrors.map((error: string, index: number) => (
                    <li key={index} className="text-red-600">• {error}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ImportResults;
