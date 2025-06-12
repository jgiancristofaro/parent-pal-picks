
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';

interface ColumnMapperProps {
  csvColumns: string[];
  dbColumns: { key: string; label: string; required?: boolean }[];
  mapping: Record<string, string>;
  onMappingChange: (csvColumn: string, dbColumn: string) => void;
  type: 'sitters' | 'products';
}

export const ColumnMapper = ({
  csvColumns,
  dbColumns,
  mapping,
  onMappingChange,
  type
}: ColumnMapperProps) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <h4 className="font-semibold mb-2">CSV Columns</h4>
          <div className="space-y-2">
            {csvColumns.map((csvCol) => (
              <div key={csvCol} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                <span className="text-sm">{csvCol}</span>
              </div>
            ))}
          </div>
        </div>
        
        <div>
          <h4 className="font-semibold mb-2">Database Fields</h4>
          <div className="space-y-3">
            {dbColumns.map((dbCol) => (
              <div key={dbCol.key} className="space-y-1">
                <Label className="text-sm">
                  {dbCol.label}
                  {dbCol.required && <span className="text-red-500 ml-1">*</span>}
                </Label>
                <Select
                  value={Object.entries(mapping).find(([, db]) => db === dbCol.key)?.[0] || ''}
                  onValueChange={(csvColumn) => onMappingChange(csvColumn, dbCol.key)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select CSV column..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">-- None --</SelectItem>
                    {csvColumns.map((csvCol) => (
                      <SelectItem key={csvCol} value={csvCol}>
                        {csvCol}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
