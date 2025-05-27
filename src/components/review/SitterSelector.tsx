
import React from "react";
import { Button } from "@/components/ui/button";

interface Sitter {
  id: string;
  name: string;
  experience: string | null;
  profile_image_url: string | null;
  hourly_rate: number | null;
}

interface SitterSelectorProps {
  sitters: Sitter[];
  selectedSitter: Sitter | null;
  onSitterSelect: (sitter: Sitter) => void;
  onSitterChange: () => void;
}

export const SitterSelector = ({ 
  sitters, 
  selectedSitter, 
  onSitterSelect, 
  onSitterChange 
}: SitterSelectorProps) => {
  if (selectedSitter) {
    return (
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
          onClick={onSitterChange}
          className="text-blue-600"
        >
          Change
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Select a Sitter</h3>
      <div className="grid gap-3">
        {sitters.map((sitter) => (
          <button
            key={sitter.id}
            type="button"
            onClick={() => onSitterSelect(sitter)}
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
  );
};
