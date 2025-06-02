
import React from "react";
import { ProfileSection } from "./ProfileSection";

interface RatesSectionProps {
  rate: string;
}

export const RatesSection = ({ rate }: RatesSectionProps) => {
  return (
    <ProfileSection title="Rates">
      <div className="flex items-center">
        <div className="w-8 h-8 bg-purple-100 rounded-md flex items-center justify-center mr-3">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-purple-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="1" x2="12" y2="23"></line>
            <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
          </svg>
        </div>
        <p>{rate}</p>
      </div>
    </ProfileSection>
  );
};
