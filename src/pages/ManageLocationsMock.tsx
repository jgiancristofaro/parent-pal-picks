
import { useState } from "react";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Plus, Edit, Trash2, Home, Building, MapPin } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { LocationForm } from "@/components/settings/LocationForm";
import { useMockUserLocations } from "@/hooks/useMockUserLocations";

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

const ManageLocationsMock = () => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingLocation, setEditingLocation] = useState<UserLocation | null>(null);
  const { toast } = useToast();

  // Use the mock locations hook
  const { 
    data: locations = [], 
    isLoading, 
    addLocation, 
    updateLocation, 
    deleteLocation 
  } = useMockUserLocations();

  const handleLocationSaved = (location: any) => {
    if (editingLocation) {
      updateLocation(editingLocation.id, location);
      toast({
        title: "Location updated",
        description: "Your home location has been successfully updated.",
      });
    } else {
      addLocation(location);
      toast({
        title: "Location added",
        description: "Your home location has been successfully added.",
      });
    }
    setIsAddDialogOpen(false);
    setEditingLocation(null);
  };

  const handleDeleteLocation = (locationId: string) => {
    deleteLocation(locationId);
    toast({
      title: "Location deleted",
      description: "Your home location has been successfully removed.",
    });
  };

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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header title="My Homes (Mock)" showBack={true} backTo="/" showSettings={false} />
        <div className="px-4 py-6">
          <div className="text-center py-8">
            <p className="text-gray-500">Loading your home locations...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header title="My Homes (Mock)" showBack={true} backTo="/" showSettings={false} />
      
      <div className="px-4 py-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Manage Your Locations (Mock Data)</h1>
          <p className="text-gray-600">
            This page uses mock data for testing purposes.
          </p>
        </div>

        {locations.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <Home className="w-16 h-16 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No home locations yet
              </h3>
              <p className="text-gray-600 mb-6">
                You haven't added any home locations yet. Add a home to get hyper-local sitter recommendations!
              </p>
              <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    Add New Home
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Add New Home Location</DialogTitle>
                  </DialogHeader>
                  <LocationForm onSuccess={handleLocationSaved} />
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>
        ) : (
          <>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-semibold text-gray-900">
                Your Homes ({locations.length})
              </h2>
              <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    Add New Home
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Add New Home Location</DialogTitle>
                  </DialogHeader>
                  <LocationForm onSuccess={handleLocationSaved} />
                </DialogContent>
              </Dialog>
            </div>

            <div className="space-y-4">
              {locations.map((location) => {
                const DwellingIcon = getDwellingIcon(location.dwelling_type);
                return (
                  <Card key={location.id}>
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
                            onOpenChange={(open) => setEditingLocation(open ? location : null)}
                          >
                            <DialogTrigger asChild>
                              <Button variant="outline" size="sm">
                                <Edit className="w-4 h-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[425px]">
                              <DialogHeader>
                                <DialogTitle>Edit Home Location</DialogTitle>
                              </DialogHeader>
                              <LocationForm 
                                initialData={location} 
                                onSuccess={handleLocationSaved} 
                              />
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
                                  onClick={() => handleDeleteLocation(location.id)}
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
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ManageLocationsMock;
