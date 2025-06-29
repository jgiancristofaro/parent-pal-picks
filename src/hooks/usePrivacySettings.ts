
import { useState, useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { validatePhoneNumber } from "@/utils/phoneValidation";

export const usePrivacySettings = () => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [phoneNumberSearchable, setPhoneNumberSearchable] = useState(false);
  const [profilePrivacySetting, setProfilePrivacySetting] = useState<'public' | 'private'>('private');
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
    const validation = validatePhoneNumber(phoneNumber);
    if (!validation.isValid) {
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

  return {
    phoneNumber,
    setPhoneNumber,
    phoneNumberSearchable,
    setPhoneNumberSearchable,
    profilePrivacySetting,
    setProfilePrivacySetting,
    isLoading,
    handleSave,
    isSaving: updateProfileMutation.isPending,
  };
};
