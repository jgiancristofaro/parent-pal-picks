
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";

type DwellingType = "APARTMENT_BUILDING" | "SINGLE_FAMILY_HOME" | "TOWNHOUSE";

interface LocationFormData {
  location_nickname: string;
  building_identifier: string;
  dwelling_type: DwellingType;
  zip_code: string;
  street: string;
  city: string;
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
          .insert(locationData);

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

    if (!formData.zip_code.trim()) {
      toast({
        title: "Validation Error",
        description: "ZIP code is required.",
        variant: "destructive",
      });
      return;
    }

    // Only require building identifier for apartment buildings
    if (formData.dwelling_type === 'APARTMENT_BUILDING' && !formData.building_identifier.trim()) {
      toast({
        title: "Validation Error",
        description: "Building identifier is required for apartment buildings.",
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

  const getDwellingTypeLabel = (type: string) => {
    switch (type) {
      case 'APARTMENT_BUILDING': return 'Apartment Building';
      case 'SINGLE_FAMILY_HOME': return 'Single Family Home';
      case 'TOWNHOUSE': return 'Townhouse';
      default: return type;
    }
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
        <Label htmlFor="dwelling_type">Dwelling Type *</Label>
        <Select value={formData.dwelling_type} onValueChange={handleDwellingTypeChange}>
          <SelectTrigger>
            <SelectValue placeholder="Select dwelling type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="APARTMENT_BUILDING">Apartment Building</SelectItem>
            <SelectItem value="SINGLE_FAMILY_HOME">Single Family Home</SelectItem>
            <SelectItem value="TOWNHOUSE">Townhouse</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="zip_code">ZIP Code *</Label>
        <Input
          id="zip_code"
          type="text"
          placeholder="e.g., 10001"
          value={formData.zip_code}
          onChange={(e) => handleInputChange('zip_code', e.target.value)}
          required
        />
      </div>

      {formData.dwelling_type === 'APARTMENT_BUILDING' && (
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
      )}

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
