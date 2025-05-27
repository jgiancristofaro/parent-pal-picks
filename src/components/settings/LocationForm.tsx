
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";

interface LocationFormData {
  location_nickname: string;
  building_identifier: string;
  street: string;
  city: string;
  zip: string;
  is_primary: boolean;
}

interface LocationFormProps {
  initialData?: any;
  onSuccess: () => void;
}

export const LocationForm = ({ initialData, onSuccess }: LocationFormProps) => {
  const [formData, setFormData] = useState<LocationFormData>({
    location_nickname: initialData?.location_nickname || "",
    building_identifier: initialData?.building_identifier || "",
    street: initialData?.address_details?.street || "",
    city: initialData?.address_details?.city || "",
    zip: initialData?.address_details?.zip || "",
    is_primary: initialData?.is_primary || false,
  });
  
  const { toast } = useToast();

  const saveLocationMutation = useMutation({
    mutationFn: async (data: LocationFormData) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const locationData = {
        location_nickname: data.location_nickname,
        building_identifier: data.building_identifier,
        address_details: {
          street: data.street,
          city: data.city,
          zip: data.zip,
        },
        is_primary: data.is_primary,
        user_id: user.id,
      };

      if (initialData) {
        // Update existing location
        const { error } = await supabase
          .from('user_locations')
          .update(locationData)
          .eq('id', initialData.id);

        if (error) throw error;
      } else {
        // Create new location
        const { error } = await supabase
          .from('user_locations')
          .insert([locationData]);

        if (error) throw error;
      }
    },
    onSuccess: () => {
      onSuccess();
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
    
    if (!formData.location_nickname.trim()) {
      toast({
        title: "Validation Error",
        description: "Location nickname is required.",
        variant: "destructive",
      });
      return;
    }

    if (!formData.building_identifier.trim()) {
      toast({
        title: "Validation Error",
        description: "Building identifier is required.",
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

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="location_nickname">Location Nickname *</Label>
        <Input
          id="location_nickname"
          type="text"
          placeholder="e.g., Main Home, Downtown Apartment"
          value={formData.location_nickname}
          onChange={(e) => handleInputChange('location_nickname', e.target.value)}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="building_identifier">Building Identifier *</Label>
        <Input
          id="building_identifier"
          type="text"
          placeholder="e.g., The Grand Plaza Main Tower"
          value={formData.building_identifier}
          onChange={(e) => handleInputChange('building_identifier', e.target.value)}
          required
        />
        <p className="text-sm text-gray-500">
          Use a consistent name that neighbors in your building would recognize and use.
        </p>
      </div>

      <div className="space-y-4">
        <Label className="text-base font-medium">Address Details (Optional)</Label>
        <p className="text-sm text-gray-500">These details are for your reference only.</p>
        
        <div className="space-y-2">
          <Label htmlFor="street">Street Address</Label>
          <Input
            id="street"
            type="text"
            placeholder="123 Main Street, Apt 4B"
            value={formData.street}
            onChange={(e) => handleInputChange('street', e.target.value)}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="city">City</Label>
            <Input
              id="city"
              type="text"
              placeholder="New York"
              value={formData.city}
              onChange={(e) => handleInputChange('city', e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="zip">ZIP Code</Label>
            <Input
              id="zip"
              type="text"
              placeholder="10001"
              value={formData.zip}
              onChange={(e) => handleInputChange('zip', e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox
          id="is_primary"
          checked={formData.is_primary}
          onCheckedChange={(checked) => handleInputChange('is_primary', checked as boolean)}
        />
        <Label htmlFor="is_primary" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
          Set as primary home
        </Label>
      </div>

      <div className="flex justify-end space-x-2 pt-4">
        <Button 
          type="submit" 
          disabled={saveLocationMutation.isPending}
        >
          {saveLocationMutation.isPending 
            ? "Saving..." 
            : (initialData ? "Update Location" : "Add Location")
          }
        </Button>
      </div>
    </form>
  );
};
