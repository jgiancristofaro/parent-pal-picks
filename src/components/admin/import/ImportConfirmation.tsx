
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CSVData } from '@/utils/csvParser';

interface ImportConfirmationProps {
  csvData: CSVData;
  importType: 'sitters' | 'products';
  isImporting: boolean;
  onImport: () => void;
}

const ImportConfirmation = ({ csvData, importType, isImporting, onImport }: ImportConfirmationProps) => {
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Step 4: Confirm Import</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-sm text-blue-800">
              Ready to import {csvData.rows.length} {importType} records.
            </p>
          </div>
          <Button 
            onClick={onImport} 
            disabled={isImporting}
            className="w-full md:w-auto"
          >
            {isImporting ? 'Importing...' : 'Confirm Import'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ImportConfirmation;
