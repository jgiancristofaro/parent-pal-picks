import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const useAdminSitterMutations = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const updateSitterMutation = useMutation({
    mutationFn: async (params: {
      sitterId: string;
      name?: string;
      profileImageUrl?: string;
      bio?: string;
      experience?: string;
      hourlyRate?: number;
      phoneNumber?: string;
      email?: string;
      certifications?: string[];
    }) => {
      const { data, error } = await supabase.rpc('admin_update_sitter_details', {
        target_sitter_id: params.sitterId,
        new_name: params.name,
        new_profile_image_url: params.profileImageUrl,
        new_bio: params.bio,
        new_experience: params.experience,
        new_hourly_rate: params.hourlyRate,
        new_phone_number: params.phoneNumber,
        new_email: params.email,
        new_certifications: params.certifications,
      });

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-sitters'] });
      toast({
        title: "Success",
        description: "Sitter updated successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: `Failed to update sitter: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  const setVerifiedStatusMutation = useMutation({
    mutationFn: async ({ sitterId, verified }: { sitterId: string; verified: boolean }) => {
      const { data, error } = await supabase.rpc('admin_set_verified_status', {
        item_type: 'sitter',
        item_id: sitterId,
        verified_status: verified,
      });

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-sitters'] });
      toast({
        title: "Success",
        description: "Sitter verification status updated",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: `Failed to update verification: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  const mergeDuplicatesMutation = useMutation({
    mutationFn: async ({ sourceId, targetId, reason }: { sourceId: string; targetId: string; reason?: string }) => {
      const { data, error } = await supabase.rpc('admin_merge_duplicates', {
        item_type: 'sitter',
        source_id: sourceId,
        target_id: targetId,
        merge_reason: reason || 'Duplicate merge',
      });

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-sitters'] });
      toast({
        title: "Success",
        description: "Sitters merged successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: `Failed to merge sitters: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  const deleteSitterMutation = useMutation({
    mutationFn: async ({ sitterId, reason }: { sitterId: string; reason?: string }) => {
      const { data, error } = await supabase.rpc('admin_delete_sitter', {
        target_sitter_id: sitterId,
        deletion_reason: reason || 'Admin deletion',
      });

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-sitters'] });
      toast({
        title: "Success",
        description: "Sitter deleted successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: `Failed to delete sitter: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  return {
    updateSitter: updateSitterMutation.mutate,
    setVerifiedStatus: setVerifiedStatusMutation.mutate,
    mergeDuplicates: mergeDuplicatesMutation.mutate,
    deleteSitter: deleteSitterMutation.mutate,
    isUpdating: updateSitterMutation.isPending,
    isSettingVerification: setVerifiedStatusMutation.isPending,
    isMerging: mergeDuplicatesMutation.isPending,
    isDeleting: deleteSitterMutation.isPending,
  };
};
