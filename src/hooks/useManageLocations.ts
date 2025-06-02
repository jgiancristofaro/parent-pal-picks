
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

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

export const useManageLocations = () => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingLocation, setEditingLocation] = useState<UserLocation | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Delete location mutation
  const deleteLocationMutation = useMutation({
    mutationFn: async (locationId: string) => {
      console.log('ManageLocations: Deleting location:', locationId);
      const { error } = await supabase
        .from('user_locations')
        .delete()
        .eq('id', locationId);

      if (error) {
        console.error('ManageLocations: Error deleting location:', error);
        throw error;
      }
      console.log('ManageLocations: Successfully deleted location:', locationId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-locations'] });
      toast({
        title: "Location deleted",
        description: "Your home location has been successfully removed.",
      });
    },
    onError: (error) => {
      console.error('ManageLocations: Delete mutation error:', error);
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

  return {
    isAddDialogOpen,
    setIsAddDialogOpen,
    editingLocation,
    setEditingLocation,
    handleLocationSaved,
    handleDeleteLocation,
  };
};
