
import { ReactNode } from "react";

interface SettingsSectionProps {
  title: string;
  children: ReactNode;
  className?: string;
}

export const SettingsSection = ({ title, children, className = "" }: SettingsSectionProps) => {
  return (
    <div className={className}>
      <h2 className="text-lg font-semibold text-gray-900 mb-4">{title}</h2>
      <div className="bg-white rounded-lg shadow-sm">
        {children}
      </div>
    </div>
  );
};
