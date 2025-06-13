import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Upload, FileText, AlertCircle, CheckCircle } from 'lucide-react';

interface CSVData {
  headers: string[];
  rows: { [key: string]: string }[];
}

interface ColumnMapping {
  [csvColumn: string]: string;
}

const AdminImport = () => {
  const { toast } = useToast();
  const [importType, setImportType] = useState<'sitters' | 'products'>('sitters');
  const [file, setFile] = useState<File | null>(null);
  const [csvData, setCsvData] = useState<CSVData | null>(null);
  const [columnMapping, setColumnMapping] = useState<ColumnMapping>({});
  const [isImporting, setIsImporting] = useState(false);
  const [importResult, setImportResult] = useState<any>(null);

  console.log('AdminImport component rendered');

  const parseCSV = (csvText: string): CSVData => {
    const lines = csvText.split('\n').filter(line => line.trim());
    const headers = lines[0].split(',').map(header => header.trim().replace(/"/g, ''));
    const rows = lines.slice(1).map(line => {
      const values = line.split(',').map(value => value.trim().replace(/"/g, ''));
      const row: { [key: string]: string } = {};
      headers.forEach((header, index) => {
        row[header] = values[index] || '';
      });
      return row;
    });

    return { headers, rows };
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log('File upload handler triggered');
    const selectedFile = event.target.files?.[0];
    if (!selectedFile) return;

    if (!selectedFile.name.endsWith('.csv')) {
      toast({
        title: "Invalid File",
        description: "Please select a CSV file",
        variant: "destructive",
      });
      return;
    }

    console.log('Processing CSV file:', selectedFile.name);
    setFile(selectedFile);
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const csvText = e.target?.result as string;
        const parsed = parseCSV(csvText);
        console.log('CSV parsed successfully:', parsed.headers.length, 'columns,', parsed.rows.length, 'rows');
        setCsvData(parsed);
        setImportResult(null);
        // Reset column mapping when new file is uploaded
        setColumnMapping({});
      } catch (error) {
        console.error('CSV parse error:', error);
        toast({
          title: "Parse Error",
          description: "Failed to parse CSV file",
          variant: "destructive",
        });
      }
    };
    reader.readAsText(selectedFile);
  };

  const getRequiredFields = () => {
    if (importType === 'sitters') {
      return {
        name: 'Name (required)',
        bio: 'Bio',
        experience: 'Experience',
        hourly_rate: 'Hourly Rate',
        phone_number: 'Phone Number',
        email: 'Email',
        profile_image_url: 'Profile Image URL',
        certifications: 'Certifications (comma-separated)'
      };
    } else {
      return {
        name: 'Name (required)',
        description: 'Description',
        brand_name: 'Brand Name (required)',
        category: 'Category',
        price: 'Price',
        image_url: 'Image URL',
        external_purchase_link: 'Purchase Link'
      };
    }
  };

  const handleImport = async () => {
    if (!csvData || !file) return;

    console.log('Starting import process for', csvData.rows.length, 'records');
    setIsImporting(true);
    try {
      const { data, error } = await supabase.functions.invoke('admin_bulk_import', {
        body: {
          importType,
          data: csvData.rows,
          columnMapping
        }
      });

      if (error) throw error;

      console.log('Import completed:', data);
      setImportResult(data);
      
      if (data.success) {
        toast({
          title: "Import Successful",
          description: `Successfully imported ${data.imported} records`,
        });
      } else {
        toast({
          title: "Import Failed",
          description: data.error || "Unknown error occurred",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      console.error('Import error:', error);
      toast({
        title: "Import Failed",
        description: error.message || "Failed to import data",
        variant: "destructive",
      });
    } finally {
      setIsImporting(false);
    }
  };

  const requiredFields = getRequiredFields();
  const canImport = csvData && Object.keys(columnMapping).length > 0;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Bulk Import</h1>
          <p className="text-gray-600">Import multiple sitters or products from a CSV file</p>
        </div>

        {/* Step 1: Import Type Selection */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Step 1: Select Import Type
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <Label>Import Type</Label>
                <Select value={importType} onValueChange={(value: 'sitters' | 'products') => setImportType(value)}>
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sitters">Sitters</SelectItem>
                    <SelectItem value="products">Products</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Step 2: File Upload */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="w-5 h-5" />
              Step 2: Upload CSV File
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <Label htmlFor="csv-file">CSV File</Label>
                <Input
                  id="csv-file"
                  type="file"
                  accept=".csv"
                  onChange={handleFileUpload}
                  className="mt-1"
                />
              </div>
              {file && (
                <div className="text-sm text-gray-600">
                  Selected: {file.name} ({(file.size / 1024).toFixed(2)} KB)
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Step 3: Column Mapping */}
        {csvData && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Step 3: Map CSV Columns to Database Fields</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                {Object.entries(requiredFields).map(([field, label]) => (
                  <div key={field}>
                    <Label>{label}</Label>
                    <Select
                      value={Object.keys(columnMapping).find(key => columnMapping[key] === field) || 'no-mapping'}
                      onValueChange={(csvColumn) => {
                        const newMapping = { ...columnMapping };
                        // Remove any existing mapping to this field
                        Object.keys(newMapping).forEach(key => {
                          if (newMapping[key] === field) {
                            delete newMapping[key];
                          }
                        });
                        // Add new mapping only if not "no-mapping"
                        if (csvColumn && csvColumn !== 'no-mapping') {
                          newMapping[csvColumn] = field;
                        }
                        setColumnMapping(newMapping);
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select CSV column..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="no-mapping">-- No mapping --</SelectItem>
                        {csvData.headers.map(header => (
                          <SelectItem key={header} value={header}>{header}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                ))}
              </div>

              {/* Data Preview */}
              <div className="mt-6">
                <h4 className="font-medium mb-3">Data Preview (first 5 rows)</h4>
                <div className="border rounded-lg overflow-auto max-h-64">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        {csvData.headers.map(header => (
                          <TableHead key={header} className="whitespace-nowrap">
                            {header}
                          </TableHead>
                        ))}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {csvData.rows.slice(0, 5).map((row, index) => (
                        <TableRow key={index}>
                          {csvData.headers.map(header => (
                            <TableCell key={header} className="whitespace-nowrap">
                              {row[header]}
                            </TableCell>
                          ))}
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 4: Import */}
        {canImport && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Step 4: Confirm Import</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-sm text-blue-800">
                    Ready to import {csvData?.rows.length} {importType} records.
                  </p>
                </div>
                <Button 
                  onClick={handleImport} 
                  disabled={isImporting}
                  className="w-full md:w-auto"
                >
                  {isImporting ? 'Importing...' : 'Confirm Import'}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Import Results */}
        {importResult && (
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
        )}
      </div>
    </div>
  );
};

export default AdminImport;
