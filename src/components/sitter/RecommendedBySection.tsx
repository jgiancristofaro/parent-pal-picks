
import React from "react";
import { ProfileSection } from "./ProfileSection";

export const RecommendedBySection = () => {
  return (
    <ProfileSection title="Recommended by">
      <div className="flex">
        <img 
          src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=2487&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" 
          alt="Recommender" 
          className="w-10 h-10 rounded-full border-2 border-white object-cover"
        />
        <img 
          src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=2487&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" 
          alt="Recommender" 
          className="w-10 h-10 rounded-full border-2 border-white -ml-2 object-cover"
        />
        <img 
          src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=2564&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" 
          alt="Recommender" 
          className="w-10 h-10 rounded-full border-2 border-white -ml-2 object-cover"
        />
      </div>
    </ProfileSection>
  );
};
