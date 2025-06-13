
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Trash2 } from 'lucide-react';
import { AdminReview } from '@/hooks/admin/useAdminProductsTypes';

interface ProductReviewsCardProps {
  reviews: AdminReview[];
  onDeleteReview: (reviewId: string) => void;
  isDeletingReview: boolean;
}

export const ProductReviewsCard = ({ reviews, onDeleteReview, isDeletingReview }: ProductReviewsCardProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Reviews ({reviews.length})</CardTitle>
      </CardHeader>
      <CardContent>
        {reviews.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Rating</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {reviews.map((review) => (
                <TableRow key={review.id}>
                  <TableCell>{review.user_full_name}</TableCell>
                  <TableCell>
                    <Badge variant="secondary">{review.rating}/5</Badge>
                  </TableCell>
                  <TableCell className="max-w-xs truncate">{review.title}</TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDeleteReview(review.id)}
                      disabled={isDeletingReview}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <p className="text-gray-500 text-center py-4">No reviews found</p>
        )}
      </CardContent>
    </Card>
  );
};
