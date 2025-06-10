
import React from "react";
import { Header } from "@/components/Header";
import { BottomNavigation } from "@/components/BottomNavigation";
import { AddReviewFlow } from "@/components/review/AddReviewFlow";

const AddReview = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header title="Add Review" showBack={true} />
      
      <div className="px-4 py-6 pb-20">
        <AddReviewFlow />
      </div>

      <BottomNavigation />
    </div>
  );
};

export default AddReview;
