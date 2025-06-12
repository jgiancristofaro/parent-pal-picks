
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface ImportRow {
  [key: string]: string | number | boolean | null;
}

interface ImportResults {
  successful: number;
  failed: number;
  errors: string[];
}

export const useBulkImport = () => {
  const [isImporting, setIsImporting] = useState(false);
  const { toast } = useToast();

  const performBulkImport = async (
    type: 'sitters' | 'products',
    data: ImportRow[],
    columnMapping: Record<string, string>
  ): Promise<ImportResults | null> => {
    setIsImporting(true);
    
    try {
      const { data: result, error } = await supabase.functions.invoke('admin-bulk-import', {
        body: {
          type,
          data,
          columnMapping
        }
      });

      if (error) {
        console.error('Error in bulk import:', error);
        toast({
          title: "Import Failed",
          description: error.message || "Failed to import data",
          variant: "destructive",
        });
        return null;
      }

      const response = result as { success?: boolean; results?: ImportResults; error?: string };

      if (response?.error) {
        toast({
          title: "Import Failed",
          description: response.error,
          variant: "destructive",
        });
        return null;
      }

      if (response?.success && response?.results) {
        const { successful, failed } = response.results;
        toast({
          title: "Import Completed",
          description: `Successfully imported ${successful} items. ${failed > 0 ? `${failed} items failed.` : ''}`,
          variant: successful > 0 ? "default" : "destructive",
        });
        return response.results;
      }

      return null;
    } catch (err) {
      console.error('Unexpected error:', err);
      toast({
        title: "Import Failed",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
      return null;
    } finally {
      setIsImporting(false);
    }
  };

  return { performBulkImport, isImporting };
};
