
import React, { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { useUserLocations } from "@/hooks/useUserLocations";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { StarIcon } from "@/components/StarIcon";

interface Sitter {
  id: string;
  name: string;
  experience: string | null;
  profile_image_url: string | null;
  hourly_rate: number | null;
}

interface EnhancedSitterReviewFormProps {
  selectedSitter: Sitter;
  onCancel: () => void;
  onBackToSearch: () => void;
}

export const EnhancedSitterReviewForm = ({
  selectedSitter,
  onCancel,
  onBackToSearch
}: EnhancedSitterReviewFormProps) => {
  const [selectedLocationId, setSelectedLocationId] = useState<string>("");
  const [rating, setRating] = useState(0);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [certified, setCertified] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();
  const { data: userLocations = [], isLoading: locationsLoading } = useUserLocations();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to submit a review",
        variant: "destructive",
      });
      return;
    }

    if (!selectedLocationId) {
      toast({
        title: "Error",
        description: "Please select the location where the service occurred",
        variant: "destructive",
      });
      return;
    }

    if (rating === 0) {
      toast({
        title: "Error",
        description: "Please select a rating",
        variant: "destructive",
      });
      return;
    }

    if (!title.trim()) {
      toast({
        title: "Error",
        description: "Please enter a review title",
        variant: "destructive",
      });
      return;
    }

    if (!content.trim()) {
      toast({
        title: "Error",
        description: "Please enter your review content",
        variant: "destructive",
      });
      return;
    }

    if (!certified) {
      toast({
        title: "Error",
        description: "Please certify that you worked with this sitter at the specified location",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const { data, error } = await supabase.functions.invoke('create_review', {
        body: {
          user_id: user.id,
          sitter_id: selectedSitter.id,
          service_location_id: selectedLocationId,
          rating: rating,
          title: title.trim(),
          content: content.trim(),
          certification_checkbox_value: certified
        }
      });

      if (error) {
        console.error("Error calling create_review function:", error);
        toast({
          title: "Error",
          description: "Failed to submit review",
          variant: "destructive",
        });
        return;
      }

      if (data?.error) {
        toast({
          title: "Error",
          description: data.error,
          variant: "destructive",
        });
        return;
      }

      if (data?.success) {
        toast({
          title: "Success",
          description: "Your review has been submitted!",
        });
        onCancel();
      } else {
        toast({
          title: "Error",
          description: "An unexpected error occurred",
          variant: "destructive",
        });
      }
    } catch (err) {
      console.error("Unexpected error:", err);
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (locationsLoading) {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Review Sitter</h2>
          <p className="text-gray-600">Loading your locations...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Review Sitter
        </h2>
        <p className="text-gray-600">
          Share your experience with this babysitter
        </p>
      </div>

      {/* Selected Sitter Display */}
      <div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
        <div className="flex items-center space-x-4">
          <Avatar className="w-16 h-16">
            <AvatarImage 
              src={selectedSitter.profile_image_url || undefined} 
              alt={selectedSitter.name}
              className="object-cover"
            />
            <AvatarFallback className="bg-purple-100 text-purple-600 text-lg font-semibold">
              {selectedSitter.name.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          
          <div className="flex-grow">
            <h3 className="font-semibold text-lg text-gray-900">{selectedSitter.name}</h3>
            {selectedSitter.experience && (
              <p className="text-sm text-gray-600">{selectedSitter.experience}</p>
            )}
            {selectedSitter.hourly_rate && (
              <p className="text-sm text-gray-500">${selectedSitter.hourly_rate}/hour</p>
            )}
          </div>

          <Button
            onClick={onBackToSearch}
            variant="outline"
            size="sm"
            className="text-purple-600 border-purple-200 hover:bg-purple-50"
          >
            Change Sitter
          </Button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Location Selector */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Select My Home for this Review <span className="text-red-500">*</span>
          </label>
          {userLocations.length === 0 ? (
            <div className="text-sm text-gray-500 bg-gray-50 p-3 rounded-lg">
              Add a home in your settings to tag this review to a specific location.
            </div>
          ) : (
            <>
              <Select value={selectedLocationId} onValueChange={setSelectedLocationId}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Please select the location where the service occurred" />
                </SelectTrigger>
                <SelectContent>
                  {userLocations.map((location) => (
                    <SelectItem key={location.id} value={location.id}>
                      {location.location_nickname}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-gray-500 mt-1">
                Please select the location where the service occurred.
              </p>
            </>
          )}
        </div>

        {/* Rating */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Rating <span className="text-red-500">*</span>
          </label>
          <div className="flex space-x-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                className={`p-1 rounded transition-colors ${
                  star <= rating ? "text-yellow-400" : "text-gray-300 hover:text-yellow-300"
                }`}
              >
                <StarIcon filled={star <= rating} className="w-8 h-8" />
              </button>
            ))}
          </div>
        </div>

        {/* Title */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Review Title <span className="text-red-500">*</span>
          </label>
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Summarize your experience"
            className="w-full"
          />
        </div>

        {/* Content */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Review Details <span className="text-red-500">*</span>
          </label>
          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Share the details of your experience with this sitter..."
            rows={5}
            className="w-full"
          />
        </div>

        {/* Certification Checkbox */}
        <div className="flex items-start space-x-2">
          <Checkbox
            id="certification"
            checked={certified}
            onCheckedChange={(checked) => setCertified(checked === true)}
            className="mt-1"
          />
          <label htmlFor="certification" className="text-sm font-medium leading-5">
            I certify that I worked with this Sitter at the location specified. <span className="text-red-500">*</span>
          </label>
        </div>

        {/* Submit Button */}
        <div className="flex space-x-4">
          <Button
            type="submit"
            disabled={isSubmitting || userLocations.length === 0}
            className="flex-1 bg-purple-500 hover:bg-purple-600 text-white"
          >
            {isSubmitting ? "Submitting..." : "Submit Review"}
          </Button>
          <Button
            type="button"
            onClick={onCancel}
            variant="outline"
            className="px-6"
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
};
