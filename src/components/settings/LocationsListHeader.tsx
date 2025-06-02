
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import { LocationForm } from "./LocationForm";

interface LocationsListHeaderProps {
  locationCount: number;
  isAddDialogOpen: boolean;
  onAddDialogChange: (open: boolean) => void;
  onLocationSaved: () => void;
}

export const LocationsListHeader = ({ 
  locationCount, 
  isAddDialogOpen, 
  onAddDialogChange, 
  onLocationSaved 
}: LocationsListHeaderProps) => {
  return (
    <div className="flex justify-between items-center mb-6">
      <h2 className="text-lg font-semibold text-gray-900">
        Your Homes ({locationCount})
      </h2>
      <Dialog open={isAddDialogOpen} onOpenChange={onAddDialogChange}>
        <DialogTrigger asChild>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Add New Home
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px] max-h-[80vh] p-0">
          <DialogHeader className="p-6 pb-0">
            <DialogTitle>Add New Home Location</DialogTitle>
          </DialogHeader>
          <div className="p-6 pt-2">
            <LocationForm onSuccess={onLocationSaved} />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
