
import React from "react";
import { Button } from "@/components/ui/button";
import { Edit } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface EditReviewButtonProps {
  reviewId: string;
  rating: number;
  title: string;
  content: string;
  productId?: string;
  sitterId?: string;
  className?: string;
}

export const EditReviewButton = ({
  reviewId,
  rating,
  title,
  content,
  productId,
  sitterId,
  className
}: EditReviewButtonProps) => {
  const navigate = useNavigate();

  const handleEditClick = () => {
    const editData = {
      reviewId,
      rating,
      title,
      content,
      productId,
      sitterId,
      editMode: true
    };

    navigate("/add-review", { state: editData });
  };

  return (
    <Button
      onClick={handleEditClick}
      variant="outline"
      size="sm"
      className={className}
    >
      <Edit className="w-4 h-4 mr-1" />
      Edit Review
    </Button>
  );
};
