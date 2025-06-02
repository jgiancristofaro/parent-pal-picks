
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Home } from "lucide-react";
import { LocationForm } from "./LocationForm";

interface EmptyLocationsStateProps {
  isAddDialogOpen: boolean;
  onAddDialogChange: (open: boolean) => void;
  onLocationSaved: () => void;
}

export const EmptyLocationsState = ({ 
  isAddDialogOpen, 
  onAddDialogChange, 
  onLocationSaved 
}: EmptyLocationsStateProps) => {
  return (
    <Card className="text-center py-12">
      <CardContent>
        <Home className="w-16 h-16 mx-auto text-gray-400 mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          No home locations yet
        </h3>
        <p className="text-gray-600 mb-6">
          You haven't added any home locations yet. Add a home to get hyper-local sitter recommendations!
        </p>
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
      </CardContent>
    </Card>
  );
};
