
import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

interface ManualAddressFormProps {
  formData: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
  };
  onChange: (field: string, value: string) => void;
  onBackToAutocomplete: () => void;
}

export const ManualAddressForm = ({ 
  formData, 
  onChange, 
  onBackToAutocomplete 
}: ManualAddressFormProps) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <Button 
          type="button" 
          variant="ghost" 
          size="sm" 
          onClick={onBackToAutocomplete}
          className="p-1 h-8 w-8"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <Label className="text-base font-medium">Enter Address Manually</Label>
      </div>
      
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="street">Street Address</Label>
          <Input
            id="street"
            type="text"
            placeholder="123 Main Street"
            value={formData.street}
            onChange={(e) => onChange('street', e.target.value)}
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
              onChange={(e) => onChange('city', e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="state">State</Label>
            <Input
              id="state"
              type="text"
              placeholder="NY"
              value={formData.state}
              onChange={(e) => onChange('state', e.target.value)}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="zipCode">ZIP Code</Label>
          <Input
            id="zipCode"
            type="text"
            placeholder="10001"
            value={formData.zipCode}
            onChange={(e) => onChange('zipCode', e.target.value)}
          />
        </div>
      </div>
    </div>
  );
};
