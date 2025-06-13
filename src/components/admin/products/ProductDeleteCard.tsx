
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Trash2 } from 'lucide-react';
import { AdminProduct } from '@/hooks/admin/useAdminProductsTypes';

interface ProductDeleteCardProps {
  product: AdminProduct;
  onDeleteProduct: () => void;
  isDeleting: boolean;
}

export const ProductDeleteCard = ({ product, onDeleteProduct, isDeleting }: ProductDeleteCardProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Delete Product</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-gray-600">
          Permanently delete this product and all associated data. This action cannot be undone.
        </p>
        
        {product.review_count > 0 && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3">
            <p className="text-sm text-yellow-800">
              <strong>Warning:</strong> This product has {product.review_count} reviews that will also be deleted.
            </p>
          </div>
        )}

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              variant="destructive"
              disabled={isDeleting}
              className="w-full flex items-center gap-2"
            >
              <Trash2 className="w-4 h-4" />
              {isDeleting ? 'Deleting...' : 'Delete Product'}
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Product</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete "{product.name}"? 
                {product.review_count > 0 && (
                  <span className="block mt-2 font-medium text-red-600">
                    This will permanently remove the product and all {product.review_count} associated reviews.
                  </span>
                )}
                <span className="block mt-2">This action cannot be undone.</span>
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={onDeleteProduct}
                className="bg-red-600 hover:bg-red-700"
              >
                Delete Product
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardContent>
    </Card>
  );
};
