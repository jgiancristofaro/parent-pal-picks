
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { CSVData } from '@/utils/csvParser';
import { getRequiredFields } from '@/utils/importFieldMappings';

interface ColumnMappingSectionProps {
  csvData: CSVData;
  importType: 'sitters' | 'products';
  columnMapping: { [csvColumn: string]: string };
  onColumnMappingChange: (mapping: { [csvColumn: string]: string }) => void;
}

const ColumnMappingSection = ({ 
  csvData, 
  importType, 
  columnMapping, 
  onColumnMappingChange 
}: ColumnMappingSectionProps) => {
  const requiredFields = getRequiredFields(importType);

  const handleMappingChange = (field: string, csvColumn: string) => {
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
    onColumnMappingChange(newMapping);
  };

  return (
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
                onValueChange={(csvColumn) => handleMappingChange(field, csvColumn)}
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
  );
};

export default ColumnMappingSection;
