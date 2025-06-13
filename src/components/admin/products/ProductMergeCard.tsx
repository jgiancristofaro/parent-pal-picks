
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Merge } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface MergeData {
  targetProductId: string;
  reason: string;
}

interface ProductMergeCardProps {
  mergeData: MergeData;
  setMergeData: React.Dispatch<React.SetStateAction<MergeData>>;
}

export const ProductMergeCard = ({ mergeData, setMergeData }: ProductMergeCardProps) => {
  const { toast } = useToast();

  const handleMerge = () => {
    if (confirm('Are you sure you want to merge this product? This action cannot be undone.')) {
      // mergeDuplicates logic would go here
      toast({
        title: "Feature Coming Soon",
        description: "Merge functionality will be implemented",
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Merge Duplicates</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="targetProductId">Target Product ID</Label>
          <Input
            id="targetProductId"
            value={mergeData.targetProductId}
            onChange={(e) => setMergeData({ ...mergeData, targetProductId: e.target.value })}
            placeholder="Enter ID of product to merge into"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="mergeReason">Merge Reason</Label>
          <Input
            id="mergeReason"
            value={mergeData.reason}
            onChange={(e) => setMergeData({ ...mergeData, reason: e.target.value })}
            placeholder="Reason for merging"
          />
        </div>

        <Button
          variant="destructive"
          disabled={!mergeData.targetProductId}
          className="w-full flex items-center gap-2"
          onClick={handleMerge}
        >
          <Merge className="w-4 h-4" />
          Merge Product
        </Button>
      </CardContent>
    </Card>
  );
};
