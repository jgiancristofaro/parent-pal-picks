
import React from "react";
import { Button } from "@/components/ui/button";

interface ProductReviewsHeaderProps {
  filter: 'all' | 'following';
  onFilterChange: (filter: 'all' | 'following') => void;
}

export const ProductReviewsHeader = ({ filter, onFilterChange }: ProductReviewsHeaderProps) => {
  return (
    <div className="flex items-center justify-between mb-6">
      <h2 className="text-2xl font-bold">ParentPal Reviews</h2>
      
      {/* Filter Toggle */}
      <div className="flex bg-gray-100 rounded-lg p-1">
        <Button
          variant={filter === 'all' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => onFilterChange('all')}
          className={filter === 'all' ? 'bg-white shadow-sm' : ''}
        >
          All Parents
        </Button>
        <Button
          variant={filter === 'following' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => onFilterChange('following')}
          className={filter === 'following' ? 'bg-white shadow-sm' : ''}
        >
          People I Follow
        </Button>
      </div>
    </div>
  );
};
