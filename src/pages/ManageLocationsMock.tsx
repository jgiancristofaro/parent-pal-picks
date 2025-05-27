
import { useState } from "react";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Plus, Edit, Trash2, Home, Building, MapPin } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useMockUserLocations } from "@/hooks/useMockUserLocations";

const MockLocationForm = ({ initialData, onSuccess }: { initialData?: any; onSuccess: () => void }) => {
  const [formData, setFormData] = useState({
    location_nickname: initialData?.location_nickname || "",
    building_identifier: initialData?.building_identifier || "",
    dwelling_type: initialData?.dwelling_type || "APARTMENT_BUILDING",
    zip_code: initialData?.zip_code || "",
    street: initialData?.address_details?.street || "",
    city: initialData?.address_details?.city || "",
    is_primary: initialData?.is_primary || false,
  });

  const { addLocation, updateLocation } = useMockUserLocations();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const locationData = {
      location_nickname: formData.location_nickname,
      building_identifier: formData.building_identifier || null,
      dwelling_type: formData.dwelling_type,
      zip_code: formData.zip_code,
      address_details: {
        street: formData.street,
        city: formData.city,
      },
      is_primary: formData.is_primary,
      latitude: null,
      longitude: null,
    };

    if (initialData) {
      updateLocation(initialData.id, locationData);
    } else {
      addLocation(locationData);
    }
    
    onSuccess();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <label htmlFor="location_nickname" className="text-sm font-medium">
          Location Nickname *
        </label>
        <input
          id="location_nickname"
          type="text"
          placeholder="My Home"
          value={formData.location_nickname}
          onChange={(e) => setFormData(prev => ({...prev, location_nickname: e.target.value}))}
          className="w-full p-2 border rounded"
          required
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="dwelling_type" className="text-sm font-medium">
          Dwelling Type *
        </label>
        <select
          id="dwelling_type"
          value={formData.dwelling_type}
          onChange={(e) => setFormData(prev => ({...prev, dwelling_type: e.target.value}))}
          className="w-full p-2 border rounded"
        >
          <option value="APARTMENT_BUILDING">Apartment Building</option>
          <option value="SINGLE_FAMILY_HOME">Single Family Home</option>
          <option value="TOWNHOUSE">Townhouse</option>
        </select>
      </div>

      {formData.dwelling_type === 'APARTMENT_BUILDING' && (
        <div className="space-y-2">
          <label htmlFor="building_identifier" className="text-sm font-medium">
            Building Identifier *
          </label>
          <input
            id="building_identifier"
            type="text"
            placeholder="e.g., The Grand Plaza Main Tower"
            value={formData.building_identifier}
            onChange={(e) => setFormData(prev => ({...prev, building_identifier: e.target.value}))}
            className="w-full p-2 border rounded"
            required
          />
        </div>
      )}

      <div className="space-y-2">
        <label htmlFor="zip_code" className="text-sm font-medium">
          ZIP Code *
        </label>
        <input
          id="zip_code"
          type="text"
          placeholder="10001"
          value={formData.zip_code}
          onChange={(e) => setFormData(prev => ({...prev, zip_code: e.target.value}))}
          className="w-full p-2 border rounded"
          required
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="street" className="text-sm font-medium">
          Street Address (Optional)
        </label>
        <input
          id="street"
          type="text"
          placeholder="123 Main Street"
          value={formData.street}
          onChange={(e) => setFormData(prev => ({...prev, street: e.target.value}))}
          className="w-full p-2 border rounded"
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="city" className="text-sm font-medium">
          City (Optional)
        </label>
        <input
          id="city"
          type="text"
          placeholder="New York"
          value={formData.city}
          onChange={(e) => setFormData(prev => ({...prev, city: e.target.value}))}
          className="w-full p-2 border rounded"
        />
      </div>

      <div className="flex items-center space-x-2">
        <input
          id="is_primary"
          type="checkbox"
          checked={formData.is_primary}
          onChange={(e) => setFormData(prev => ({...prev, is_primary: e.target.checked}))}
        />
        <label htmlFor="is_primary" className="text-sm font-medium">
          Set as primary home
        </label>
      </div>

      <div className="flex justify-end space-x-2 pt-4">
        <Button type="submit">
          {initialData ? "Update Location" : "Add Location"}
        </Button>
      </div>
    </form>
  );
};

const ManageLocationsMock = () => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingLocation, setEditingLocation] = useState<any>(null);
  const { toast } = useToast();
  const { data: locations = [], isLoading, deleteLocation } = useMockUserLocations();

  const handleLocationSaved = () => {
    setIsAddDialogOpen(false);
    setEditingLocation(null);
    toast({
      title: "Location saved",
      description: "Your home location has been successfully saved.",
    });
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
        <Header title="My Homes (Mock)" showBack={true} backTo="/settings" showSettings={false} />
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
      <Header title="My Homes (Mock)" showBack={true} backTo="/settings" showSettings={false} />
      
      <div className="px-4 py-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Manage Your Locations</h1>
          <p className="text-gray-600">
            Add your home locations to get hyper-local sitter recommendations from neighbors in your building.
          </p>
          <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-700">
              <strong>Demo Mode:</strong> This is a mock version with sample data for testing. In the real app, this would connect to your authenticated account.
            </p>
          </div>
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
                  <MockLocationForm onSuccess={handleLocationSaved} />
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
                  <MockLocationForm onSuccess={handleLocationSaved} />
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
                              <MockLocationForm 
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
