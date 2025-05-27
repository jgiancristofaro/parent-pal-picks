
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Plus, Edit, Trash2, Home } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { LocationForm } from "@/components/settings/LocationForm";

interface UserLocation {
  id: string;
  location_nickname: string;
  building_identifier: string;
  address_details: any;
  is_primary: boolean;
  created_at: string;
  updated_at: string;
}

const ManageLocations = () => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingLocation, setEditingLocation] = useState<UserLocation | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch user locations
  const { data: locations = [], isLoading, error } = useQuery({
    queryKey: ['user-locations'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('user_locations')
        .select('*')
        .eq('user_id', user.id)
        .order('is_primary', { ascending: false })
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as UserLocation[];
    },
  });

  // Delete location mutation
  const deleteLocationMutation = useMutation({
    mutationFn: async (locationId: string) => {
      const { error } = await supabase
        .from('user_locations')
        .delete()
        .eq('id', locationId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-locations'] });
      toast({
        title: "Location deleted",
        description: "Your home location has been successfully removed.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error deleting location",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleLocationSaved = () => {
    setIsAddDialogOpen(false);
    setEditingLocation(null);
    queryClient.invalidateQueries({ queryKey: ['user-locations'] });
    toast({
      title: "Location saved",
      description: "Your home location has been successfully saved.",
    });
  };

  const handleDeleteLocation = (locationId: string) => {
    deleteLocationMutation.mutate(locationId);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header title="My Homes" showBack={true} backTo="/settings" showSettings={false} />
        <div className="px-4 py-6">
          <div className="text-center py-8">
            <p className="text-gray-500">Loading your home locations...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header title="My Homes" showBack={true} backTo="/settings" showSettings={false} />
        <div className="px-4 py-6">
          <div className="text-center py-8">
            <p className="text-red-500">Error loading locations</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header title="My Homes" showBack={true} backTo="/settings" showSettings={false} />
      
      <div className="px-4 py-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Manage Your Locations</h1>
          <p className="text-gray-600">
            Add your home locations to get hyper-local sitter recommendations from neighbors in your building.
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
              {locations.map((location) => (
                <Card key={location.id}>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg flex items-center">
                        <Home className="w-5 h-5 mr-2 text-blue-600" />
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
                        <span className="text-sm font-medium text-gray-500">Building:</span>
                        <p className="text-gray-900">{location.building_identifier}</p>
                      </div>
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
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ManageLocations;
