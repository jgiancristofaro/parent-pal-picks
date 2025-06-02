
import React from "react";
import { ProfileSection } from "./ProfileSection";

interface AboutSectionProps {
  about: string;
}

export const AboutSection = ({ about }: AboutSectionProps) => {
  return (
    <ProfileSection title="About">
      <p className="text-gray-700">{about}</p>
    </ProfileSection>
  );
};
