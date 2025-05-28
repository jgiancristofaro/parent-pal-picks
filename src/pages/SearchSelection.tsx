
import React from "react";
import { Header } from "@/components/Header";
import { BottomNavigation } from "@/components/BottomNavigation";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const SearchSelection = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50">
      <Header title="Search" showBack={true} backTo="/" />
      
      <div className="px-4 py-6 pb-20">
        <div className="space-y-6">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              What are you looking for?
            </h2>
            <p className="text-gray-600">
              Find what you need in your community
            </p>
          </div>

          <div className="space-y-4">
            <Button
              onClick={() => navigate("/find-sitter")}
              className="w-full h-16 bg-purple-500 hover:bg-purple-600 text-white rounded-lg flex items-center justify-center space-x-3"
            >
              <span className="text-2xl">👩‍🍼</span>
              <div className="text-left">
                <div className="font-semibold">Find a Sitter</div>
                <div className="text-sm opacity-90">Trusted babysitters near you</div>
              </div>
            </Button>

            <Button
              onClick={() => navigate("/shop")}
              className="w-full h-16 bg-blue-500 hover:bg-blue-600 text-white rounded-lg flex items-center justify-center space-x-3"
            >
              <span className="text-2xl">🍼</span>
              <div className="text-left">
                <div className="font-semibold">Shop Products</div>
                <div className="text-sm opacity-90">Baby essentials & gear</div>
              </div>
            </Button>

            <Button
              onClick={() => navigate("/find-parents")}
              className="w-full h-16 bg-green-500 hover:bg-green-600 text-white rounded-lg flex items-center justify-center space-x-3"
            >
              <span className="text-2xl">👨‍👩‍👧‍👦</span>
              <div className="text-left">
                <div className="font-semibold">Find Parents</div>
                <div className="text-sm opacity-90">Connect with other families</div>
              </div>
            </Button>
          </div>
        </div>
      </div>

      <BottomNavigation />
    </div>
  );
};

export default SearchSelection;
