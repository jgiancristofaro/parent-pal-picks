import { useState, useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Header } from "@/components/Header";
import { BottomNavigation } from "@/components/BottomNavigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

const PrivacySettings = () => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [phoneNumberSearchable, setPhoneNumberSearchable] = useState(false);
  const [profilePrivacySetting, setProfilePrivacySetting] = useState<'public' | 'private'>('private');
  const [phoneValidationError, setPhoneValidationError] = useState<string>('');
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch current profile data
  const { data: profile, isLoading } = useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) throw error;
      return data;
    },
  });

  // Set form values when profile data is loaded
  useEffect(() => {
    if (profile) {
      setPhoneNumber(profile.phone_number || '');
      setPhoneNumberSearchable(profile.phone_number_searchable || false);
      setProfilePrivacySetting(profile.profile_privacy_setting || 'private');
    }
  }, [profile]);

  const validatePhoneNumber = (phone: string) => {
    // Remove all non-digit characters
    const cleanPhone = phone.replace(/\D/g, '');
    
    if (cleanPhone.length === 0) {
      setPhoneValidationError('');
      return true;
    }
    
    if (cleanPhone.length < 10) {
      setPhoneValidationError('Phone number must be at least 10 digits');
      return false;
    }
    
    if (cleanPhone.length > 11) {
      setPhoneValidationError('Phone number must be 10 or 11 digits');
      return false;
    }
    
    // If 11 digits, first digit should be 1 (US country code)
    if (cleanPhone.length === 11 && !cleanPhone.startsWith('1')) {
      setPhoneValidationError('11-digit numbers must start with 1');
      return false;
    }
    
    setPhoneValidationError('');
    return true;
  };

  const handlePhoneNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPhoneNumber(value);
    validatePhoneNumber(value);
  };

  const updateProfileMutation = useMutation({
    mutationFn: async (updates: any) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user.id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      toast({
        title: 'Privacy settings updated',
        description: 'Your privacy settings have been saved successfully.',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: 'Failed to update privacy settings.',
        variant: 'destructive',
      });
    },
  });

  const handleSave = () => {
    // Validate phone number is not empty
    if (!phoneNumber || phoneNumber.trim() === '') {
      toast({
        title: 'Phone number required',
        description: 'Please enter a valid phone number to save your settings.',
        variant: 'destructive',
      });
      return;
    }

    // Check if phone number validation passes
    if (!validatePhoneNumber(phoneNumber)) {
      toast({
        title: 'Invalid phone number',
        description: 'Please enter a valid phone number format.',
        variant: 'destructive',
      });
      return;
    }

    updateProfileMutation.mutate({
      phone_number: phoneNumber,
      phone_number_searchable: phoneNumberSearchable,
      profile_privacy_setting: profilePrivacySetting,
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen pb-20 bg-gray-50">
        <Header title="Privacy Settings" showBack={true} showSettings={false} />
        <div className="px-4 py-6">
          <div className="text-center">Loading...</div>
        </div>
        <BottomNavigation />
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-20 bg-gray-50">
      <Header title="Privacy Settings" showBack={true} showSettings={false} />
      
      <div className="px-4 py-6 space-y-6">
        {/* Phone Number Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Phone Number</CardTitle>
            <CardDescription>
              Manage your phone number and searchability settings
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number *</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="Enter your phone number"
                value={phoneNumber}
                onChange={handlePhoneNumberChange}
                required
                className={phoneValidationError ? 'border-red-500' : ''}
              />
              
              {phoneValidationError && (
                <div className="text-sm text-red-600 flex items-center gap-2">
                  <span>⚠️</span>
                  <span>{phoneValidationError}</span>
                </div>
              )}
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox
                id="phone-searchable"
                checked={phoneNumberSearchable}
                onCheckedChange={(checked) => setPhoneNumberSearchable(checked as boolean)}
              />
              <Label htmlFor="phone-searchable" className="text-sm">
                Allow others to find my profile by my phone number. My phone number will not be publicly displayed.
              </Label>
            </div>
          </CardContent>
        </Card>

        {/* Profile Privacy Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Profile Privacy</CardTitle>
            <CardDescription>
              Control who can follow you and see your activity
            </CardDescription>
          </CardHeader>
          <CardContent>
            <RadioGroup 
              value={profilePrivacySetting} 
              onValueChange={(value) => setProfilePrivacySetting(value as 'public' | 'private')}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="public" id="public" />
                <Label htmlFor="public" className="flex-1">
                  <div className="font-medium">Public</div>
                  <div className="text-sm text-gray-500">
                    Anyone can follow you without approval. Your reviews and activity are visible to all users.
                  </div>
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="private" id="private" />
                <Label htmlFor="private" className="flex-1">
                  <div className="font-medium">Private</div>
                  <div className="text-sm text-gray-500">
                    You must approve follow requests. Only followers can see your reviews and activity.
                  </div>
                </Label>
              </div>
            </RadioGroup>
          </CardContent>
        </Card>

        {/* Save Button */}
        <Button 
          onClick={handleSave} 
          className="w-full"
          disabled={updateProfileMutation.isPending}
        >
          {updateProfileMutation.isPending ? 'Saving...' : 'Save Settings'}
        </Button>
        
        {/* Note about follow requests */}
        {profilePrivacySetting === 'private' && (
          <Card>
            <CardContent className="pt-6">
              <p className="text-sm text-gray-600 text-center">
                Follow requests can be managed in the <strong>Alerts</strong> section.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
      
      <BottomNavigation />
    </div>
  );
};

export default PrivacySettings;
