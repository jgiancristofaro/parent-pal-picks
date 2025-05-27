
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { StarIcon } from "@/components/StarIcon";

interface ReviewFormProps {
  rating: number;
  title: string;
  content: string;
  isSubmitting: boolean;
  onRatingChange: (rating: number) => void;
  onTitleChange: (title: string) => void;
  onContentChange: (content: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
}

export const ReviewForm = ({
  rating,
  title,
  content,
  isSubmitting,
  onRatingChange,
  onTitleChange,
  onContentChange,
  onSubmit,
  onCancel
}: ReviewFormProps) => {
  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium mb-2">Rating</label>
        <div className="flex space-x-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => onRatingChange(star)}
              className="p-1"
            >
              <StarIcon
                filled={star <= rating}
                className="w-8 h-8 text-yellow-500"
              />
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Review Title</label>
        <Input
          value={title}
          onChange={(e) => onTitleChange(e.target.value)}
          placeholder="Summarize your experience"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Your Review</label>
        <Textarea
          value={content}
          onChange={(e) => onContentChange(e.target.value)}
          placeholder="Tell other parents about your experience with this sitter..."
          rows={4}
          required
        />
      </div>

      <div className="flex space-x-3">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          className="flex-1"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={isSubmitting}
          className="flex-1 bg-blue-500 hover:bg-blue-600"
        >
          {isSubmitting ? "Submitting..." : "Submit Review"}
        </Button>
      </div>
    </form>
  );
};
