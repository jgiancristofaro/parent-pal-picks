
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Upload, Download, FileText, AlertCircle } from 'lucide-react';
import { CSVPreview } from '@/components/admin/CSVPreview';
import { ColumnMapper } from '@/components/admin/ColumnMapper';
import { useBulkImport } from '@/hooks/useBulkImport';
import { Alert, AlertDescription } from '@/components/ui/alert';

const AdminImport = () => {
  const navigate = useNavigate();
  const { performBulkImport, isImporting } = useBulkImport();
  const [importType, setImportType] = useState<'sitters' | 'products'>('sitters');
  const [csvData, setCsvData] = useState<Array<Record<string, any>>>([]);
  const [csvColumns, setCsvColumns] = useState<string[]>([]);
  const [columnMapping, setColumnMapping] = useState<Record<string, string>>({});
  const [step, setStep] = useState<'upload' | 'preview' | 'mapping' | 'results'>('upload');
  const [results, setResults] = useState<any>(null);

  const sitterColumns = [
    { key: 'name', label: 'Name', required: true },
    { key: 'profile_image_url', label: 'Profile Image URL' },
    { key: 'bio', label: 'Bio' },
    { key: 'experience', label: 'Experience' },
    { key: 'hourly_rate', label: 'Hourly Rate' },
    { key: 'phone_number', label: 'Phone Number' },
    { key: 'email', label: 'Email' },
    { key: 'certifications', label: 'Certifications (comma-separated)' },
  ];

  const productColumns = [
    { key: 'name', label: 'Name', required: true },
    { key: 'brand_name', label: 'Brand Name', required: true },
    { key: 'category', label: 'Category' },
    { key: 'description', label: 'Description' },
    { key: 'image_url', label: 'Image URL' },
    { key: 'price', label: 'Price' },
    { key: 'external_purchase_link', label: 'Purchase Link' },
  ];

  const parseCSV = (text: string) => {
    const lines = text.split('\n');
    const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
    const data = [];

    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (line) {
        const values = line.split(',').map(v => v.trim().replace(/"/g, ''));
        const row: Record<string, any> = {};
        headers.forEach((header, index) => {
          row[header] = values[index] || '';
        });
        data.push(row);
      }
    }

    return { headers, data };
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith('.csv')) {
      alert('Please upload a CSV file');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      const { headers, data } = parseCSV(text);
      
      setCsvColumns(headers);
      setCsvData(data);
      setColumnMapping({});
      setStep('preview');
    };
    reader.readAsText(file);
  };

  const handleMappingChange = (csvColumn: string, dbColumn: string) => {
    setColumnMapping(prev => {
      const newMapping = { ...prev };
      
      // Remove any existing mapping for this database column
      Object.keys(newMapping).forEach(key => {
        if (newMapping[key] === dbColumn) {
          delete newMapping[key];
        }
      });
      
      // Add new mapping if csvColumn is not empty
      if (csvColumn) {
        newMapping[csvColumn] = dbColumn;
      }
      
      return newMapping;
    });
  };

  const handleConfirmImport = async () => {
    const requiredColumns = importType === 'sitters' 
      ? sitterColumns.filter(col => col.required)
      : productColumns.filter(col => col.required);

    const mappedRequired = requiredColumns.filter(col => 
      Object.values(columnMapping).includes(col.key)
    );

    if (mappedRequired.length !== requiredColumns.length) {
      alert('Please map all required fields before importing');
      return;
    }

    const importResults = await performBulkImport(importType, csvData, columnMapping);
    if (importResults) {
      setResults(importResults);
      setStep('results');
    }
  };

  const downloadTemplate = () => {
    const columns = importType === 'sitters' ? sitterColumns : productColumns;
    const headers = columns.map(col => col.label).join(',');
    const sampleRow = columns.map(col => {
      if (col.key === 'name') return 'Sample Name';
      if (col.key === 'brand_name') return 'Sample Brand';
      if (col.key === 'hourly_rate' || col.key === 'price') return '25.00';
      if (col.key === 'email') return 'example@email.com';
      if (col.key === 'phone_number') return '1234567890';
      return 'Sample Value';
    }).join(',');
    
    const csvContent = `${headers}\n${sampleRow}`;
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${importType}_template.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const resetImport = () => {
    setCsvData([]);
    setCsvColumns([]);
    setColumnMapping({});
    setResults(null);
    setStep('upload');
  };

  return (
    <AdminLayout>
      <div className="min-h-screen bg-gray-50">
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="py-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Upload className="h-8 w-8 text-purple-600" />
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900">Bulk Import</h1>
                    <p className="text-gray-600">Import multiple sitters or products from CSV files</p>
                  </div>
                </div>
                <Button variant="outline" onClick={() => navigate('/admin')}>
                  Back to Dashboard
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="space-y-6">
            {/* Step 1: Upload */}
            {step === 'upload' && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Upload CSV File
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="import-type">Import Type</Label>
                      <Select value={importType} onValueChange={(value: 'sitters' | 'products') => setImportType(value)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="sitters">Sitters</SelectItem>
                          <SelectItem value="products">Products</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex items-center gap-4">
                      <Button variant="outline" onClick={downloadTemplate}>
                        <Download className="h-4 w-4 mr-2" />
                        Download Template
                      </Button>
                      <span className="text-sm text-gray-500">
                        Download a template CSV file to get started
                      </span>
                    </div>

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
                  </div>

                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      Make sure your CSV file has headers in the first row. The data will be validated before import.
                    </AlertDescription>
                  </Alert>
                </CardContent>
              </Card>
            )}

            {/* Step 2: Preview */}
            {step === 'preview' && (
              <Card>
                <CardHeader>
                  <CardTitle>Data Preview</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <CSVPreview data={csvData} />
                  <div className="flex gap-2">
                    <Button onClick={() => setStep('mapping')}>
                      Continue to Mapping
                    </Button>
                    <Button variant="outline" onClick={resetImport}>
                      Start Over
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Step 3: Column Mapping */}
            {step === 'mapping' && (
              <Card>
                <CardHeader>
                  <CardTitle>Map Columns</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <ColumnMapper
                    csvColumns={csvColumns}
                    dbColumns={importType === 'sitters' ? sitterColumns : productColumns}
                    mapping={columnMapping}
                    onMappingChange={handleMappingChange}
                    type={importType}
                  />
                  
                  <div className="flex gap-2">
                    <Button 
                      onClick={handleConfirmImport}
                      disabled={isImporting}
                    >
                      {isImporting ? 'Importing...' : 'Confirm Import'}
                    </Button>
                    <Button variant="outline" onClick={() => setStep('preview')}>
                      Back to Preview
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Step 4: Results */}
            {step === 'results' && results && (
              <Card>
                <CardHeader>
                  <CardTitle>Import Results</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-green-50 rounded-lg">
                      <h3 className="font-semibold text-green-800">Successful</h3>
                      <p className="text-2xl font-bold text-green-600">{results.successful}</p>
                    </div>
                    <div className="p-4 bg-red-50 rounded-lg">
                      <h3 className="font-semibold text-red-800">Failed</h3>
                      <p className="text-2xl font-bold text-red-600">{results.failed}</p>
                    </div>
                  </div>

                  {results.errors.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="font-semibold text-red-800">Errors:</h4>
                      <div className="max-h-48 overflow-y-auto space-y-1">
                        {results.errors.map((error: string, index: number) => (
                          <p key={index} className="text-sm text-red-600 bg-red-50 p-2 rounded">
                            {error}
                          </p>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex gap-2">
                    <Button onClick={resetImport}>
                      Import Another File
                    </Button>
                    <Button variant="outline" onClick={() => navigate('/admin')}>
                      Back to Dashboard
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminImport;
