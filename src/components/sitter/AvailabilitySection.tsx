
import React from "react";
import { ProfileSection } from "./ProfileSection";

export const AvailabilitySection = () => {
  return (
    <ProfileSection title="Availability">
      <div className="overflow-x-auto">
        <div className="grid grid-cols-7 gap-2">
          <div className="text-center font-medium py-2">S</div>
          <div className="text-center font-medium py-2">M</div>
          <div className="text-center font-medium py-2">T</div>
          <div className="text-center font-medium py-2">W</div>
          <div className="text-center font-medium py-2">T</div>
          <div className="text-center font-medium py-2">F</div>
          <div className="text-center font-medium py-2">S</div>
          
          {/* Calendar days would go here */}
          <div className="text-center py-2 text-gray-400">1</div>
          <div className="text-center py-2 text-gray-400">2</div>
          <div className="text-center py-2 text-gray-400">3</div>
          <div className="text-center py-2 text-gray-400">4</div>
          <div className="text-center py-2 bg-purple-500 text-white rounded-full">5</div>
          <div className="text-center py-2 text-gray-400">6</div>
          <div className="text-center py-2 text-gray-400">7</div>
        </div>
      </div>
    </ProfileSection>
  );
};
