
import React from "react";
import { ProfileSection } from "./ProfileSection";

interface Review {
  id: string;
  userId: string;
  userName: string;
  userImage: string;
  rating: number;
  date: string;
  content: string;
}

interface ReviewsSectionProps {
  reviews: Review[];
  renderStars: (rating: number) => React.ReactNode;
}

export const ReviewsSection = ({ reviews, renderStars }: ReviewsSectionProps) => {
  return (
    <ProfileSection title="Reviews">
      <div className="space-y-4">
        {reviews.map((review) => (
          <div key={review.id} className="bg-white p-4 rounded-lg">
            <div className="flex items-center mb-3">
              <img 
                src={review.userImage} 
                alt={review.userName} 
                className="w-12 h-12 rounded-full mr-3 object-cover"
              />
              <div>
                <p className="font-medium">{review.userName}</p>
                <p className="text-gray-500 text-sm">{review.date}</p>
              </div>
            </div>
            <div className="flex mb-2">
              {renderStars(review.rating)}
            </div>
            <p className="text-gray-700">{review.content}</p>
            <div className="flex items-center mt-3">
              <button className="flex items-center mr-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
                </svg>
                <span>{review.id === "r1" ? "2" : "1"}</span>
              </button>
              <button className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M18 9.5a1.5 1.5 0 11-3 0v-6a1.5 1.5 0 013 0v6zM14 9.667v-5.43a2 2 0 00-1.105-1.79l-.05-.025A4 4 0 0011.055 2H5.64a2 2 0 00-1.962 1.608l-1.2 6A2 2 0 004.44 12H8v4a2 2 0 002 2 1 1 0 001-1v-.667a4 4 0 01.8-2.4l1.4-1.866a4 4 0 00.8-2.4z" />
                </svg>
                <span>{review.id === "r2" ? "1" : "0"}</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </ProfileSection>
  );
};
