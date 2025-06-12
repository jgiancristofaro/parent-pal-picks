
import React from "react";
import { StarIcon } from "@/components/StarIcon";
import { AdminActions } from "@/components/admin/AdminActions";
import { useAdmin } from "@/hooks/useAdmin";

interface ProfileHeaderProps {
  sitter: {
    id?: string;
    name: string;
    role: string;
    rating: number;
    reviewCount: number;
    profileImage: string;
  };
  renderStars: (rating: number) => React.ReactNode;
}

export const ProfileHeader = ({ sitter, renderStars }: ProfileHeaderProps) => {
  const { isAdmin } = useAdmin();

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
        <h1 className="text-xl font-bold">{sitter.name}</h1>
        <p className="text-purple-500">{sitter.role}</p>
        <div className="flex items-center mt-1">
          <div className="flex">
            {renderStars(Math.floor(sitter.rating))}
          </div>
          <span className="ml-2 text-gray-600">
            {sitter.rating} ({sitter.reviewCount} reviews)
          </span>
        </div>
        
        {isAdmin && sitter.id && (
          <div className="mt-4">
            <AdminActions 
              userId={sitter.id}
              userType="sitter"
              entityId={sitter.id}
            />
          </div>
        )}
      </div>
    </div>
  );
};
