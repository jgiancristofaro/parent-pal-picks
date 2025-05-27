
import { Button } from "@/components/ui/button";

interface AdditionalFiltersProps {
  onAvailabilityFilter: () => void;
  onExperienceFilter: () => void;
}

export const AdditionalFilters = ({ onAvailabilityFilter, onExperienceFilter }: AdditionalFiltersProps) => {
  return (
    <div className="flex gap-4 mb-6">
      <Button 
        variant="outline" 
        className="flex-1 justify-between py-3 text-left bg-white border-gray-200"
        onClick={onAvailabilityFilter}
      >
        <span>Availability</span>
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
      </Button>
      
      <Button 
        variant="outline" 
        className="flex-1 justify-between py-3 text-left bg-white border-gray-200"
        onClick={onExperienceFilter}
      >
        <span>Experience</span>
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
      </Button>
    </div>
  );
};
