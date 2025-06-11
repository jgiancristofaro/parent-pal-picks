
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { LocationFormData, DwellingType } from "./types";
import { validateFormData } from "./utils";

export const useLocationForm = (initialData?: any, onSuccess?: () => void) => {
  const [formData, setFormData] = useState<LocationFormData>({
    location_nickname: initialData?.location_nickname || "",
    building_identifier: initialData?.building_identifier || "",
    dwelling_type: (initialData?.dwelling_type as DwellingType) || "APARTMENT_BUILDING",
    zip_code: initialData?.zip_code || "",
    street: initialData?.address_details?.street || "",
    city: initialData?.address_details?.city || "",
    is_primary: initialData?.is_primary || false,
    google_place_id: initialData?.google_place_id || undefined,
    standardized_address: initialData?.standardized_address || undefined,
    latitude: initialData?.latitude || undefined,
    longitude: initialData?.longitude || undefined,
  });
  
  const { toast } = useToast();

  const saveLocationMutation = useMutation({
    mutationFn: async (data: LocationFormData) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const locationData = {
        location_nickname: data.location_nickname,
        building_identifier: data.building_identifier || null,
        dwelling_type: data.dwelling_type,
        zip_code: data.zip_code,
        address_details: {
          street: data.street,
          city: data.city,
        },
        is_primary: data.is_primary,
        user_id: user.id,
        // New Google Places fields
        google_place_id: data.google_place_id || null,
        standardized_address: data.standardized_address || null,
        latitude: data.latitude || null,
        longitude: data.longitude || null,
      };

      if (initialData) {
        const { error } = await supabase
          .from('user_locations')
          .update(locationData)
          .eq('id', initialData.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('user_locations')
          .insert(locationData);

        if (error) throw error;
      }
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Location saved successfully with Google Places data!",
      });
      if (onSuccess) onSuccess();
    },
    onError: (error) => {
      toast({
        title: "Error saving location",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const errors = validateFormData(formData);
    if (errors.length > 0) {
      toast({
        title: "Validation Error",
        description: errors[0],
        variant: "destructive",
      });
      return;
    }

    saveLocationMutation.mutate(formData);
  };

  const handleInputChange = (field: keyof LocationFormData, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleDwellingTypeChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      dwelling_type: value as DwellingType,
    }));
  };

  const handlePlaceSelect = (placeData: {
    googlePlaceId: string;
    standardizedAddress: string;
    latitude: number;
    longitude: number;
    extractedComponents: any;
  }) => {
    setFormData(prev => ({
      ...prev,
      google_place_id: placeData.googlePlaceId,
      standardized_address: placeData.standardizedAddress,
      latitude: placeData.latitude,
      longitude: placeData.longitude,
      // Auto-fill zip code if available from Google
      zip_code: placeData.extractedComponents.zip_code || prev.zip_code,
    }));
  };

  return {
    formData,
    handleSubmit,
    handleInputChange,
    handleDwellingTypeChange,
    handlePlaceSelect,
    saveLocationMutation,
  };
};
