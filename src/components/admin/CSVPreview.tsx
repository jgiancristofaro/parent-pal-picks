
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ScrollArea } from '@/components/ui/scroll-area';

interface CSVPreviewProps {
  data: Array<Record<string, any>>;
  maxRows?: number;
}

export const CSVPreview = ({ data, maxRows = 5 }: CSVPreviewProps) => {
  if (!data || data.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No data to preview
      </div>
    );
  }

  const headers = Object.keys(data[0]);
  const previewData = data.slice(0, maxRows);

  return (
    <div className="space-y-2">
      <p className="text-sm text-gray-600">
        Showing {previewData.length} of {data.length} rows
      </p>
      <ScrollArea className="h-64 w-full border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              {headers.map((header) => (
                <TableHead key={header} className="whitespace-nowrap">
                  {header}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {previewData.map((row, index) => (
              <TableRow key={index}>
                {headers.map((header) => (
                  <TableCell key={header} className="whitespace-nowrap">
                    {row[header]?.toString() || ''}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </ScrollArea>
    </div>
  );
};
