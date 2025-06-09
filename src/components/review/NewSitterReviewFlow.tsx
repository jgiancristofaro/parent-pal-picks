
import React, { useState } from "react";
import { CreateSitterForm } from "./CreateSitterForm";
import { EnhancedSitterReviewForm } from "./EnhancedSitterReviewForm";

interface Sitter {
  id: string;
  name: string;
  phone_number: string | null;
  experience: string | null;
  profile_image_url: string | null;
  hourly_rate: number | null;
}

interface NewSitterReviewFlowProps {
  onCancel: () => void;
}

export const NewSitterReviewFlow = ({ onCancel }: NewSitterReviewFlowProps) => {
  const [step, setStep] = useState<'sitter' | 'review'>('sitter');
  const [newSitter, setNewSitter] = useState<Sitter | null>(null);

  const handleSitterCreated = (sitter: any) => {
    // Transform the response from create_sitter_profile to match our expected interface
    const transformedSitter: Sitter = {
      id: sitter.id,
      name: sitter.name,
      phone_number: sitter.phone_number || null,
      experience: null, // New sitters don't have experience yet
      profile_image_url: null, // New sitters don't have profile images yet
      hourly_rate: null, // New sitters don't have hourly rates yet
    };
    setNewSitter(transformedSitter);
    setStep('review');
  };

  const handleBackToSitterForm = () => {
    setStep('sitter');
    setNewSitter(null);
  };

  if (step === 'sitter') {
    return (
      <CreateSitterForm
        onNext={handleSitterCreated}
        onCancel={onCancel}
      />
    );
  }

  if (step === 'review' && newSitter) {
    return (
      <EnhancedSitterReviewForm
        selectedSitter={newSitter}
        onCancel={onCancel}
        onBackToSearch={handleBackToSitterForm}
        isNewSitterFlow={true}
      />
    );
  }

  return null;
};
