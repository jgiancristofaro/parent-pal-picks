
import React from "react";
import { StarIcon } from "@/components/StarIcon";
import { useAdmin } from "@/hooks/useAdmin";
import { Button } from "@/components/ui/button";
import { Edit, Check, X } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface ProfileHeaderProps {
  sitter: {
    id?: string;
    name: string;
    role: string;
    rating: number;
    reviewCount: number;
    profileImage: string;
    is_verified?: boolean;
  };
  renderStars: (rating: number) => React.ReactNode;
}

export const ProfileHeader = ({ sitter, renderStars }: ProfileHeaderProps) => {
  const { isAdmin } = useAdmin();
  const navigate = useNavigate();

  return (
    <div className="bg-white pb-6">
      <div className="flex flex-col items-center pt-6 pb-4">
        <div className="w-24 h-24 rounded-full overflow-hidden mb-4">
          <img 
            src={sitter.profileImage} 
            alt={sitter.name} 
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex items-center gap-2 mb-2">
          <h1 className="text-xl font-bold">{sitter.name}</h1>
          {isAdmin && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate(`/admin/sitters/${sitter.id}`)}
              className="h-6 w-6 p-0"
              title="Edit Sitter"
            >
              <Edit className="h-3 w-3" />
            </Button>
          )}
          {sitter.is_verified && (
            <Check className="h-4 w-4 text-green-600" title="Verified" />
          )}
        </div>
        <p className="text-purple-500">{sitter.role}</p>
        <div className="flex items-center mt-1">
          <div className="flex">
            {renderStars(Math.floor(sitter.rating))}
          </div>
          <span className="ml-2 text-gray-600">
            {sitter.rating} ({sitter.reviewCount} reviews)
          </span>
        </div>
      </div>
    </div>
  );
};
