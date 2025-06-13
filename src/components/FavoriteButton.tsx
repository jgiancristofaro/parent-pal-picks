
import { useState } from "react";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useFavorites } from "@/hooks/useFavorites";
import { useFavoriteStatus } from "@/hooks/useFavoriteStatus";
import { useAuth } from "@/contexts/AuthContext";

interface FavoriteButtonProps {
  itemId: string;
  itemType: 'sitter' | 'product';
  size?: 'sm' | 'default' | 'lg';
  variant?: 'default' | 'outline' | 'ghost';
  showText?: boolean;
}

export const FavoriteButton = ({ 
  itemId, 
  itemType, 
  size = 'sm',
  variant = 'ghost',
  showText = false
}: FavoriteButtonProps) => {
  const { user } = useAuth();
  const { addFavorite, removeFavorite, isAddingFavorite, isRemovingFavorite } = useFavorites();
  const { data: isFavorited = false, isLoading } = useFavoriteStatus(itemId, itemType);

  // Don't show button if user is not authenticated
  if (!user) {
    return null;
  }

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigation if button is inside a link
    e.stopPropagation();

    if (isFavorited) {
      removeFavorite({ itemId, itemType });
    } else {
      addFavorite({ itemId, itemType });
    }
  };

  const isLoading_ = isLoading || isAddingFavorite || isRemovingFavorite;

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleToggleFavorite}
      disabled={isLoading_}
      className="flex items-center gap-2"
    >
      <Heart 
        className={`h-4 w-4 ${isFavorited ? 'fill-red-500 text-red-500' : 'text-gray-400'}`}
      />
      {showText && (
        <span className="text-sm">
          {isFavorited ? 'Favorited' : 'Add to Favorites'}
        </span>
      )}
    </Button>
  );
};
