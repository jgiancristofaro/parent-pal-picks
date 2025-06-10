
import React, { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { SitterSelector } from "@/components/review/SitterSelector";
import { LocationSelector } from "@/components/review/LocationSelector";
import { ReviewForm } from "@/components/review/ReviewForm";
import { SitterSearch } from "@/components/review/SitterSearch";
import { EnhancedSitterReviewForm } from "@/components/review/EnhancedSitterReviewForm";
import { NewSitterReviewFlow } from "@/components/review/NewSitterReviewFlow";

interface DatabaseSitter {
  id: string;
  name: string;
  experience: string | null;
  profile_image_url: string | null;
  hourly_rate: number | null;
}

interface TransformedSitter {
  id: string;
  name: string;
  image: string;
  rating: number;
  experience?: string;
  friendRecommendationCount: number;
  workedInUserLocationNickname?: string;
}

interface SitterReviewFormProps {
  onCancel: () => void;
  reviewType: "existing" | "new";
  editData?: {
    reviewId: string;
    rating: number;
    title: string;
    content: string;
    sitterId: string;
  };
  selectedSitterId?: string;
  selectedSitterData?: any;
}

export const SitterReviewForm = ({ 
  onCancel, 
  reviewType, 
  editData, 
  selectedSitterId, 
  selectedSitterData 
}: SitterReviewFormProps) => {
  const [sitters, setSitters] = useState<DatabaseSitter[]>([]);
  const [selectedSitter, setSelectedSitter] = useState<DatabaseSitter | null>(null);
  const [showSearch, setShowSearch] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    if (reviewType === "existing") {
      fetchSitters();
    }
  }, [reviewType]);

  // Handle pre-selected sitter from search
  useEffect(() => {
    if (selectedSitterId && selectedSitterData) {
      const databaseSitter: DatabaseSitter = {
        id: selectedSitterData.id,
        name: selectedSitterData.name,
        experience: selectedSitterData.experience || null,
        profile_image_url: selectedSitterData.image || selectedSitterData.profile_image_url,
        hourly_rate: selectedSitterData.hourly_rate || null,
      };
      setSelectedSitter(databaseSitter);
      setShowSearch(false);
    }
  }, [selectedSitterId, selectedSitterData]);

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

  const handleSitterSelect = (transformedSitter: TransformedSitter) => {
    // Convert TransformedSitter back to DatabaseSitter format for internal use
    const databaseSitter: DatabaseSitter = {
      id: transformedSitter.id,
      name: transformedSitter.name,
      experience: transformedSitter.experience || null,
      profile_image_url: transformedSitter.image,
      hourly_rate: null, // We don't have this in TransformedSitter, so default to null
    };
    setSelectedSitter(databaseSitter);
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

  // If in edit mode, go directly to the enhanced form
  if (editData) {
    return (
      <EnhancedSitterReviewForm
        onCancel={onCancel}
        editData={editData}
      />
    );
  }

  if (reviewType === "new") {
    return (
      <NewSitterReviewFlow
        onCancel={onCancel}
      />
    );
  }

  // If we have a pre-selected sitter, go directly to the form
  if (selectedSitter) {
    return (
      <EnhancedSitterReviewForm
        selectedSitter={selectedSitter}
        onCancel={onCancel}
        onBackToSearch={handleBackToSearch}
      />
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

      <SitterSelector
        sitters={sitters}
        selectedSitter={selectedSitter}
        onSitterSelect={setSelectedSitter}
        onSitterChange={() => setSelectedSitter(null)}
      />
    </div>
  );
};
