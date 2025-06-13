
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Upload } from 'lucide-react';
import { CSVData, parseCSV } from '@/utils/csvParser';
import { useToast } from '@/hooks/use-toast';

interface FileUploadSectionProps {
  file: File | null;
  onFileUpload: (file: File, csvData: CSVData) => void;
}

const FileUploadSection = ({ file, onFileUpload }: FileUploadSectionProps) => {
  const { toast } = useToast();

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
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const csvText = e.target?.result as string;
        const parsed = parseCSV(csvText);
        console.log('CSV parsed successfully:', parsed.headers.length, 'columns,', parsed.rows.length, 'rows');
        onFileUpload(selectedFile, parsed);
      } catch (error) {
        console.error('CSV parse error:', error);
        toast({
          title: "Parse Error",
          description: `Failed to parse CSV file: ${error.message}`,
          variant: "destructive",
        });
      }
    };
    reader.readAsText(selectedFile);
  };

  return (
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
  );
};

export default FileUploadSection;
