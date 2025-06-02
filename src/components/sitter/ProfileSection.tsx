
import React from "react";

interface ProfileSectionProps {
  title: string;
  children: React.ReactNode;
  className?: string;
}

export const ProfileSection = ({ title, children, className = "mb-6" }: ProfileSectionProps) => {
  return (
    <section className={className}>
      <h2 className="text-xl font-bold mb-2">{title}</h2>
      {children}
    </section>
  );
};
