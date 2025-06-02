
import React from "react";
import { ProfileSection } from "./ProfileSection";

interface CertificationsSectionProps {
  certifications: string[];
}

export const CertificationsSection = ({ certifications }: CertificationsSectionProps) => {
  return (
    <ProfileSection title="Certifications">
      {certifications.map((cert, index) => (
        <div key={index} className="flex items-center mb-2">
          <div className="w-8 h-8 bg-purple-100 rounded-md flex items-center justify-center mr-3">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-purple-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 11 12 14 22 4"></polyline>
              <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path>
            </svg>
          </div>
          <p>{cert}</p>
        </div>
      ))}
    </ProfileSection>
  );
};
