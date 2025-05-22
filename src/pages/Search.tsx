
import { Header } from "@/components/Header";
import { BottomNavigation } from "@/components/BottomNavigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search as SearchIcon } from "lucide-react";

const Search = () => {
  return (
    <div className="min-h-screen pb-20 bg-purple-50">
      <Header title="Find a sitter" showBack={true} />
      
      <div className="p-4">
        <div className="relative mb-6">
          <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <Input 
            className="pl-10 py-6 bg-white rounded-lg border-gray-200" 
            placeholder="Search by location"
          />
        </div>
        
        <div className="mb-6">
          <label className="block text-xl font-semibold mb-2">Date</label>
          <div className="relative">
            <Button 
              variant="outline" 
              className="w-full justify-between py-6 text-left bg-white border-gray-200"
            >
              <span className="text-gray-500">Select date</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </Button>
          </div>
        </div>
        
        <div className="mb-6">
          <label className="block text-xl font-semibold mb-2">Time</label>
          <div className="relative">
            <Button 
              variant="outline" 
              className="w-full justify-between py-6 text-left bg-white border-gray-200"
            >
              <span className="text-gray-500">Select time</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </Button>
          </div>
        </div>
        
        <div className="flex gap-4 mb-6">
          <Button 
            variant="outline" 
            className="flex-1 justify-between py-3 text-left bg-white border-gray-200"
          >
            <span>Availability</span>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </Button>
          
          <Button 
            variant="outline" 
            className="flex-1 justify-between py-3 text-left bg-white border-gray-200"
          >
            <span>Experience</span>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </Button>
          
          <Button 
            variant="outline" 
            className="flex-1 justify-between py-3 text-left bg-white border-gray-200"
          >
            <span>Recommended</span>
          </Button>
        </div>
        
        <Button className="w-full py-6 bg-purple-500 hover:bg-purple-600 text-white rounded-lg">
          Search
        </Button>
      </div>
      
      <BottomNavigation />
    </div>
  );
};

export default Search;
