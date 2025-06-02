
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Edit, Trash2, Home, Building, MapPin } from "lucide-react";
import { LocationForm } from "./LocationForm";

interface UserLocation {
  id: string;
  location_nickname: string;
  building_identifier: string | null;
  dwelling_type: string;
  zip_code: string;
  address_details: any;
  is_primary: boolean;
  latitude: number | null;
  longitude: number | null;
  created_at: string;
  updated_at: string;
}

interface LocationCardProps {
  location: UserLocation;
  editingLocation: UserLocation | null;
  onEdit: (location: UserLocation | null) => void;
  onDelete: (locationId: string) => void;
  onLocationSaved: () => void;
}

export const LocationCard = ({ 
  location, 
  editingLocation, 
  onEdit, 
  onDelete, 
  onLocationSaved 
}: LocationCardProps) => {
  const getDwellingTypeLabel = (type: string) => {
    switch (type) {
      case 'APARTMENT_BUILDING': return 'Apartment Building';
      case 'SINGLE_FAMILY_HOME': return 'Single Family Home';
      case 'TOWNHOUSE': return 'Townhouse';
      default: return type;
    }
  };

  const getDwellingIcon = (type: string) => {
    switch (type) {
      case 'APARTMENT_BUILDING': return Building;
      case 'SINGLE_FAMILY_HOME': return Home;
      case 'TOWNHOUSE': return Home;
      default: return Home;
    }
  };

  const DwellingIcon = getDwellingIcon(location.dwelling_type);

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center">
            <DwellingIcon className="w-5 h-5 mr-2 text-blue-600" />
            {location.location_nickname}
            {location.is_primary && (
              <span className="ml-2 px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                Primary
              </span>
            )}
          </CardTitle>
          <div className="flex space-x-2">
            <Dialog 
              open={editingLocation?.id === location.id} 
              onOpenChange={(open) => onEdit(open ? location : null)}
            >
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <Edit className="w-4 h-4" />
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px] max-h-[80vh] p-0">
                <DialogHeader className="p-6 pb-0">
                  <DialogTitle>Edit Home Location</DialogTitle>
                </DialogHeader>
                <div className="p-6 pt-2">
                  <LocationForm 
                    initialData={location} 
                    onSuccess={onLocationSaved} 
                  />
                </div>
              </DialogContent>
            </Dialog>

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <Trash2 className="w-4 h-4 text-red-600" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete Location</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to delete "{location.location_nickname}"? 
                    This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => onDelete(location.id)}
                    className="bg-red-600 hover:bg-red-700"
                  >
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div>
            <span className="text-sm font-medium text-gray-500">Type:</span>
            <p className="text-gray-900">{getDwellingTypeLabel(location.dwelling_type)}</p>
          </div>
          
          <div className="flex items-center">
            <MapPin className="w-4 h-4 text-gray-500 mr-1" />
            <span className="text-sm font-medium text-gray-500">ZIP Code:</span>
            <p className="text-gray-900 ml-1">{location.zip_code}</p>
          </div>

          {location.building_identifier && (
            <div>
              <span className="text-sm font-medium text-gray-500">Building:</span>
              <p className="text-gray-900">{location.building_identifier}</p>
            </div>
          )}
          
          {location.address_details && (
            <div>
              <span className="text-sm font-medium text-gray-500">Address:</span>
              <p className="text-gray-900">
                {typeof location.address_details === 'object' 
                  ? Object.values(location.address_details).filter(Boolean).join(', ')
                  : location.address_details
                }
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
