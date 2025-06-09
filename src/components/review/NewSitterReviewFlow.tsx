
import React, { useState } from "react";
import { CreateSitterForm } from "./CreateSitterForm";
import { EnhancedSitterReviewForm } from "./EnhancedSitterReviewForm";

interface Sitter {
  id: string;
  name: string;
  phone_number: string | null;
}

interface NewSitterReviewFlowProps {
  onCancel: () => void;
}

export const NewSitterReviewFlow = ({ onCancel }: NewSitterReviewFlowProps) => {
  const [step, setStep] = useState<'sitter' | 'review'>('sitter');
  const [newSitter, setNewSitter] = useState<Sitter | null>(null);

  const handleSitterCreated = (sitter: Sitter) => {
    setNewSitter(sitter);
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
