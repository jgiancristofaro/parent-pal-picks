
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FileText } from 'lucide-react';

interface ImportTypeSelectorProps {
  importType: 'sitters' | 'products';
  onImportTypeChange: (value: 'sitters' | 'products') => void;
}

const ImportTypeSelector = ({ importType, onImportTypeChange }: ImportTypeSelectorProps) => {
  return (
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
            <Select value={importType} onValueChange={onImportTypeChange}>
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
  );
};

export default ImportTypeSelector;
