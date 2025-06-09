
import React, { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface Sitter {
  id: string;
  name: string;
  phone_number: string | null;
}

interface CreateSitterFormProps {
  onNext: (sitter: Sitter) => void;
  onCancel: () => void;
}

export const CreateSitterForm = ({ onNext, onCancel }: CreateSitterFormProps) => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to create a sitter profile",
        variant: "destructive",
      });
      return;
    }

    if (!firstName.trim() || !lastName.trim()) {
      toast({
        title: "Error",
        description: "Please enter both first and last name",
        variant: "destructive",
      });
      return;
    }

    if (!email.trim() && !phoneNumber.trim()) {
      toast({
        title: "Error",
        description: "Please provide either an email or phone number",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const { data, error } = await supabase.functions.invoke('create_sitter_profile', {
        body: {
          first_name: firstName.trim(),
          last_name: lastName.trim(),
          email: email.trim() || undefined,
          phone_number: phoneNumber.trim() || undefined,
          user_id: user.id
        }
      });

      if (error) {
        console.error("Error calling create_sitter_profile function:", error);
        toast({
          title: "Error",
          description: "Failed to create sitter profile",
          variant: "destructive",
        });
        return;
      }

      if (data?.error) {
        toast({
          title: "Error",
          description: data.error,
          variant: "destructive",
        });
        return;
      }

      if (data?.success && data?.sitter) {
        toast({
          title: "Success",
          description: "Sitter profile created successfully!",
        });
        onNext(data.sitter);
      } else {
        toast({
          title: "Error",
          description: "An unexpected error occurred",
          variant: "destructive",
        });
      }
    } catch (err) {
      console.error("Unexpected error:", err);
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Add New Sitter
        </h2>
        <p className="text-gray-600">
          First, let's create a profile for the sitter you want to review
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="firstName">
              First Name <span className="text-red-500">*</span>
            </Label>
            <Input
              id="firstName"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="Enter first name"
              required
            />
          </div>
          <div>
            <Label htmlFor="lastName">
              Last Name <span className="text-red-500">*</span>
            </Label>
            <Input
              id="lastName"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder="Enter last name"
              required
            />
          </div>
        </div>

        <div>
          <Label htmlFor="email">Email Address</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter email address (optional)"
          />
        </div>

        <div>
          <Label htmlFor="phoneNumber">Phone Number</Label>
          <Input
            id="phoneNumber"
            type="tel"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            placeholder="Enter phone number (optional)"
          />
        </div>

        <p className="text-sm text-gray-500">
          <span className="text-red-500">*</span> At least one contact method (email or phone) is required
        </p>

        <div className="flex space-x-4 pt-4">
          <Button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 bg-purple-500 hover:bg-purple-600 text-white"
          >
            {isSubmitting ? "Creating..." : "Next: Add Review"}
          </Button>
          <Button
            type="button"
            onClick={onCancel}
            variant="outline"
            className="px-6"
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
};
