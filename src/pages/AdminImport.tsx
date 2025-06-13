
import React, { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { CSVData } from '@/utils/csvParser';
import ImportTypeSelector from '@/components/admin/import/ImportTypeSelector';
import FileUploadSection from '@/components/admin/import/FileUploadSection';
import ColumnMappingSection from '@/components/admin/import/ColumnMappingSection';
import ImportConfirmation from '@/components/admin/import/ImportConfirmation';
import ImportResults from '@/components/admin/import/ImportResults';

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

  const handleFileUpload = (uploadedFile: File, parsedCsvData: CSVData) => {
    setFile(uploadedFile);
    setCsvData(parsedCsvData);
    setImportResult(null);
    // Reset column mapping when new file is uploaded
    setColumnMapping({});
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

  const canImport = csvData && Object.keys(columnMapping).length > 0;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Bulk Import</h1>
          <p className="text-gray-600">Import multiple sitters or products from a CSV file</p>
        </div>

        <ImportTypeSelector 
          importType={importType}
          onImportTypeChange={setImportType}
        />

        <FileUploadSection 
          file={file}
          onFileUpload={handleFileUpload}
        />

        {csvData && (
          <ColumnMappingSection
            csvData={csvData}
            importType={importType}
            columnMapping={columnMapping}
            onColumnMappingChange={setColumnMapping}
          />
        )}

        {canImport && (
          <ImportConfirmation
            csvData={csvData}
            importType={importType}
            isImporting={isImporting}
            onImport={handleImport}
          />
        )}

        <ImportResults importResult={importResult} />
      </div>
    </div>
  );
};

export default AdminImport;
