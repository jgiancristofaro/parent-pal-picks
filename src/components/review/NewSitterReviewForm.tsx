
import React, { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { StarIcon } from "@/components/StarIcon";

interface UserLocation {
  id: string;
  location_nickname: string;
}

interface NewSitterReviewFormProps {
  userLocations: UserLocation[];
  onCancel: () => void;
}

export const NewSitterReviewForm = ({
  userLocations,
  onCancel
}: NewSitterReviewFormProps) => {
  // Sitter information state
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  
  // Review state
  const [selectedLocationId, setSelectedLocationId] = useState<string>("");
  const [rating, setRating] = useState(0);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [certified, setCertified] = useState(false);
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    
    // Validate sitter information
    if (!firstName.trim()) {
      setErrorMessage("Please enter the sitter's first name");
      return;
    }

    if (!lastName.trim()) {
      setErrorMessage("Please enter the sitter's last name");
      return;
    }

    if (!email.trim() && !phoneNumber.trim()) {
      setErrorMessage("Please provide either an email or a phone number for the sitter");
      return;
    }

    // Validate review information
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
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        setErrorMessage("You must be logged in to submit a review");
        return;
      }

      // Call the edge function to create sitter and review
      const { data, error } = await supabase.functions.invoke('create_sitter_and_review', {
        body: {
          first_name: firstName.trim(),
          last_name: lastName.trim(),
          email: email.trim() || undefined,
          phone_number: phoneNumber.trim() || undefined,
          user_id: user.id,
          service_location_id: selectedLocationId,
          rating: rating,
          title: title.trim(),
          content: content.trim(),
          certification_checkbox_value: certified
        }
      });

      if (error) {
        console.error("Error calling create_sitter_and_review function:", error);
        setErrorMessage("An unexpected error occurred");
        return;
      }

      if (data?.error) {
        setErrorMessage(data.error);
        return;
      }

      if (data?.success) {
        toast({
          title: "Success",
          description: data.message || "Sitter profile created and review submitted!",
        });
        onCancel();
      } else {
        setErrorMessage("An unexpected error occurred");
      }
    } catch (err) {
      console.error("Unexpected error:", err);
      setErrorMessage("An unexpected error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Create New Sitter Profile & Review
        </h2>
        <p className="text-gray-600">
          Add a new sitter to our system and share your experience
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* New Sitter Information Section */}
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">New Sitter Information</h3>
          
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  First Name <span className="text-red-500">*</span>
                </label>
                <Input
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="Enter first name"
                  className="w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  Last Name <span className="text-red-500">*</span>
                </label>
                <Input
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Enter last name"
                  className="w-full"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Email Address
              </label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter email address"
                className="w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Phone Number
              </label>
              <Input
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="Enter phone number"
                className="w-full"
              />
              <p className="text-xs text-gray-500 mt-1">
                Please provide either an email or a phone number for the sitter.
              </p>
            </div>

            {errorMessage && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-red-600 text-sm">{errorMessage}</p>
              </div>
            )}
          </div>
        </div>

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
            {isSubmitting ? "Creating Sitter & Submitting..." : "Create Sitter & Submit Review"}
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
