
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

  return {
    formData,
    handleSubmit,
    handleInputChange,
    handleDwellingTypeChange,
    saveLocationMutation,
  };
};
