
import React from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Edit, Loader2 } from "lucide-react";
import { useUserReview } from "@/hooks/useUserReview";

interface Sitter {
  id: string;
  name: string;
  image: string;
  rating: number;
  experience?: string;
  friendRecommendationCount: number;
  workedInUserLocationNickname?: string;
}

interface EnhancedSitterSearchResultCardProps {
  sitter: Sitter;
  onSelectForNewReview: () => void;
  onEditExistingReview: (reviewData: any) => void;
}

export const EnhancedSitterSearchResultCard = ({ 
  sitter, 
  onSelectForNewReview, 
  onEditExistingReview 
}: EnhancedSitterSearchResultCardProps) => {
  const { userReview, loading } = useUserReview(undefined, sitter.id);

  const handleButtonClick = () => {
    if (userReview) {
      onEditExistingReview({
        reviewId: userReview.id,
        rating: userReview.rating,
        title: userReview.title,
        content: userReview.content,
        sitterId: sitter.id
      });
    } else {
      onSelectForNewReview();
    }
  };

  const getButtonText = () => {
    if (loading) return "Loading...";
    if (userReview) return "Edit Your Review";
    return "Review this Sitter";
  };

  const getButtonIcon = () => {
    if (loading) return <Loader2 className="w-4 h-4 mr-2 animate-spin" />;
    if (userReview) return <Edit className="w-4 h-4 mr-2" />;
    return null;
  };

  const getButtonStyle = () => {
    if (userReview) {
      return "bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg";
    }
    return "bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg";
  };

  return (
    <div className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg hover:border-purple-200 hover:bg-purple-50 transition-all">
      <Avatar className="w-16 h-16">
        <AvatarImage 
          src={sitter.image} 
          alt={sitter.name}
          className="object-cover"
        />
        <AvatarFallback className="bg-gray-100 text-gray-600">
          {sitter.name.charAt(0).toUpperCase()}
        </AvatarFallback>
      </Avatar>
      
      <div className="flex-grow">
        <h4 className="font-semibold text-gray-900">{sitter.name}</h4>
        {sitter.experience && (
          <p className="text-sm text-gray-600">{sitter.experience}</p>
        )}
        {sitter.rating > 0 && (
          <p className="text-sm text-gray-500">Rating: {sitter.rating}/5</p>
        )}
      </div>
      
      <Button
        onClick={handleButtonClick}
        className={getButtonStyle()}
        disabled={loading}
      >
        {getButtonIcon()}
        {getButtonText()}
      </Button>
    </div>
  );
};
