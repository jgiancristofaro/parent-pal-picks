
import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface UnitNumberFieldProps {
  value: string;
  onChange: (value: string) => void;
}

export const UnitNumberField = ({ value, onChange }: UnitNumberFieldProps) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="unit-number">Unit/Apt # (Optional)</Label>
      <Input
        id="unit-number"
        type="text"
        placeholder="e.g., 4B, Unit 205"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full"
      />
    </div>
  );
};
