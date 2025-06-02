
import React from "react";
import { ProfileSection } from "./ProfileSection";

interface ExperienceSectionProps {
  experience: string;
}

export const ExperienceSection = ({ experience }: ExperienceSectionProps) => {
  return (
    <ProfileSection title="Experience">
      <div className="flex items-center">
        <div className="w-8 h-8 bg-purple-100 rounded-md flex items-center justify-center mr-3">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-purple-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
            <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
          </svg>
        </div>
        <div>
          <p className="font-medium">Babysitter</p>
          <p className="text-gray-500 text-sm">{experience}</p>
        </div>
      </div>
    </ProfileSection>
  );
};
