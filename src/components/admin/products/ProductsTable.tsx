
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Edit, Shield, ShieldCheck } from 'lucide-react';
import { AdminProduct } from '@/hooks/admin/useAdminProductsTypes';

interface ProductsTableProps {
  products: AdminProduct[];
  debouncedSearchTerm: string;
}

export const ProductsTable = ({ products, debouncedSearchTerm }: ProductsTableProps) => {
  const navigate = useNavigate();

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          All Products ({products.length})
          {debouncedSearchTerm && (
            <span className="text-sm font-normal text-gray-500 ml-2">
              - filtered by "{debouncedSearchTerm}"
            </span>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Product</TableHead>
              <TableHead>Brand</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Rating</TableHead>
              <TableHead>Reviews</TableHead>
              <TableHead>Verified</TableHead>
              <TableHead>Created</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    {product.image_url ? (
                      <img
                        src={product.image_url}
                        alt={product.name}
                        className="w-10 h-10 rounded object-cover"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded bg-gray-200 flex items-center justify-center">
                        <span className="text-xs font-medium text-gray-600">
                          {product.name.charAt(0)}
                        </span>
                      </div>
                    )}
                    <span className="font-medium">{product.name}</span>
                  </div>
                </TableCell>
                <TableCell>{product.brand_name}</TableCell>
                <TableCell>{product.category || 'Uncategorized'}</TableCell>
                <TableCell>
                  {product.average_rating ? `${product.average_rating}/5` : 'No rating'}
                </TableCell>
                <TableCell>{product.review_count}</TableCell>
                <TableCell>
                  {product.is_verified ? (
                    <Badge variant="default" className="flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3" />
                      Verified
                    </Badge>
                  ) : (
                    <Badge variant="secondary" className="flex items-center gap-1">
                      <Shield className="w-3 h-3" />
                      Unverified
                    </Badge>
                  )}
                </TableCell>
                <TableCell>
                  {new Date(product.created_at).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => navigate(`/admin/products/${product.id}`)}
                    className="flex items-center gap-2"
                  >
                    <Edit className="w-4 h-4" />
                    Edit
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {products.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500">
              {debouncedSearchTerm ? `No products found for "${debouncedSearchTerm}"` : 'No products found'}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
