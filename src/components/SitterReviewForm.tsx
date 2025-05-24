
import React, { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { StarIcon } from "@/components/StarIcon";
import { useToast } from "@/hooks/use-toast";

interface Sitter {
  id: string;
  name: string;
  experience: string | null;
  profile_image_url: string | null;
  hourly_rate: number | null;
}

interface SitterReviewFormProps {
  onCancel: () => void;
}

export const SitterReviewForm = ({ onCancel }: SitterReviewFormProps) => {
  const [sitters, setSitters] = useState<Sitter[]>([]);
  const [selectedSitter, setSelectedSitter] = useState<Sitter | null>(null);
  const [rating, setRating] = useState(0);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchSitters();
  }, []);

  const fetchSitters = async () => {
    const { data, error } = await supabase
      .from("sitters")
      .select("id, name, experience, profile_image_url, hourly_rate")
      .order("name");

    if (error) {
      console.error("Error fetching sitters:", error);
      toast({
        title: "Error",
        description: "Failed to load sitters",
        variant: "destructive",
      });
    } else {
      setSitters(data || []);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedSitter || rating === 0 || !title.trim() || !content.trim()) {
      toast({
        title: "Error",
        description: "Please fill in all fields and select a rating",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to submit a review",
        variant: "destructive",
      });
      setIsSubmitting(false);
      return;
    }

    const { error } = await supabase
      .from("reviews")
      .insert({
        user_id: user.id,
        sitter_id: selectedSitter.id,
        rating,
        title: title.trim(),
        content: content.trim(),
      });

    setIsSubmitting(false);

    if (error) {
      console.error("Error submitting review:", error);
      toast({
        title: "Error",
        description: "Failed to submit review",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: "Your review has been submitted!",
      });
      onCancel();
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Review a Sitter
        </h2>
        <p className="text-gray-600">
          Share your experience with babysitters
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {!selectedSitter ? (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Select a Sitter</h3>
            <div className="grid gap-3">
              {sitters.map((sitter) => (
                <button
                  key={sitter.id}
                  type="button"
                  onClick={() => setSelectedSitter(sitter)}
                  className="flex items-center p-3 bg-white rounded-lg border hover:border-blue-300 transition-colors text-left"
                >
                  {sitter.profile_image_url && (
                    <img
                      src={sitter.profile_image_url}
                      alt={sitter.name}
                      className="w-12 h-12 rounded-full object-cover mr-3"
                    />
                  )}
                  <div>
                    <div className="font-semibold">{sitter.name}</div>
                    {sitter.experience && (
                      <div className="text-sm text-gray-500">{sitter.experience}</div>
                    )}
                    {sitter.hourly_rate && (
                      <div className="text-sm text-green-600">${sitter.hourly_rate}/hr</div>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex items-center p-3 bg-white rounded-lg border">
              {selectedSitter.profile_image_url && (
                <img
                  src={selectedSitter.profile_image_url}
                  alt={selectedSitter.name}
                  className="w-12 h-12 rounded-full object-cover mr-3"
                />
              )}
              <div className="flex-grow">
                <div className="font-semibold">{selectedSitter.name}</div>
                {selectedSitter.experience && (
                  <div className="text-sm text-gray-500">{selectedSitter.experience}</div>
                )}
                {selectedSitter.hourly_rate && (
                  <div className="text-sm text-green-600">${selectedSitter.hourly_rate}/hr</div>
                )}
              </div>
              <Button
                type="button"
                variant="ghost"
                onClick={() => setSelectedSitter(null)}
                className="text-blue-600"
              >
                Change
              </Button>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Rating</label>
              <div className="flex space-x-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
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
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Summarize your experience"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Your Review</label>
              <Textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
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
          </div>
        )}
      </form>
    </div>
  );
};
