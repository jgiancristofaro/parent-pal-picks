import React, { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useUserLocations } from "@/hooks/useUserLocations";
import { SitterSelector } from "@/components/review/SitterSelector";
import { LocationSelector } from "@/components/review/LocationSelector";
import { ReviewForm } from "@/components/review/ReviewForm";
import { SitterSearch } from "@/components/review/SitterSearch";

interface Sitter {
  id: string;
  name: string;
  experience: string | null;
  profile_image_url: string | null;
  hourly_rate: number | null;
}

interface SitterReviewFormProps {
  onCancel: () => void;
  reviewType: "existing" | "new";
}

export const SitterReviewForm = ({ onCancel, reviewType }: SitterReviewFormProps) => {
  const [sitters, setSitters] = useState<Sitter[]>([]);
  const [selectedSitter, setSelectedSitter] = useState<Sitter | null>(null);
  const [rating, setRating] = useState(0);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [selectedLocationId, setSelectedLocationId] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSearch, setShowSearch] = useState(true);
  const { toast } = useToast();

  // Fetch user's saved locations
  const { data: userLocations = [] } = useUserLocations();

  useEffect(() => {
    if (reviewType === "existing") {
      fetchSitters();
    }
  }, [reviewType]);

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

  const handleSitterSelect = (sitter: Sitter) => {
    setSelectedSitter(sitter);
    setShowSearch(false);
  };

  const handleCreateNew = () => {
    // This will be handled by the parent component
    onCancel(); // Go back to show the "new" option
  };

  const handleBackToSearch = () => {
    setSelectedSitter(null);
    setShowSearch(true);
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

    // Prepare review data
    const reviewData: any = {
      user_id: user.id,
      sitter_id: selectedSitter.id,
      rating,
      title: title.trim(),
      content: content.trim(),
    };

    // Add service_location_id if a location was selected
    if (selectedLocationId) {
      reviewData.service_location_id = selectedLocationId;
    }

    const { error } = await supabase
      .from("reviews")
      .insert(reviewData);

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

  if (reviewType === "new") {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Create New Sitter Profile
          </h2>
          <p className="text-gray-600">
            This feature is coming soon! For now, please use "Find an Existing Sitter to Review".
          </p>
        </div>
        <div className="flex justify-center">
          <button
            onClick={onCancel}
            className="px-6 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
          >
            Back
          </button>
        </div>
      </div>
    );
  }

  if (reviewType === "existing" && showSearch && !selectedSitter) {
    return (
      <SitterSearch
        onSitterSelect={handleSitterSelect}
        onCreateNew={handleCreateNew}
        onBack={onCancel}
      />
    );
  }

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

      {!selectedSitter ? (
        <SitterSelector
          sitters={sitters}
          selectedSitter={selectedSitter}
          onSitterSelect={setSelectedSitter}
          onSitterChange={() => setSelectedSitter(null)}
        />
      ) : (
        <div className="space-y-6">
          <SitterSelector
            sitters={sitters}
            selectedSitter={selectedSitter}
            onSitterSelect={setSelectedSitter}
            onSitterChange={handleBackToSearch}
          />

          <LocationSelector
            userLocations={userLocations}
            selectedLocationId={selectedLocationId}
            onLocationChange={setSelectedLocationId}
          />

          <ReviewForm
            rating={rating}
            title={title}
            content={content}
            isSubmitting={isSubmitting}
            onRatingChange={setRating}
            onTitleChange={setTitle}
            onContentChange={setContent}
            onSubmit={handleSubmit}
            onCancel={onCancel}
          />
        </div>
      )}
    </div>
  );
};
