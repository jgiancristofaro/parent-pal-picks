
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface AdminSitter {
  id: string;
  name: string;
  profile_image_url: string | null;
  bio: string | null;
  experience: string | null;
  hourly_rate: number | null;
  phone_number: string | null;
  email: string | null;
  certifications: string[] | null;
  rating: number | null;
  review_count: number | null;
  is_verified: boolean;
  created_at: string;
  updated_at: string;
}

interface UpdateSitterData {
  name?: string;
  profile_image_url?: string;
  bio?: string;
  experience?: string;
  hourly_rate?: number;
  phone_number?: string;
  email?: string;
  certifications?: string[];
}

export const useAdminSitters = () => {
  const [sitters, setSitters] = useState<AdminSitter[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(0);
  const [hasMorePages, setHasMorePages] = useState(true);
  const { toast } = useToast();

  const pageSize = 25;

  const fetchSitters = async (search = searchTerm, page = 0, reset = false) => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase.rpc('admin_get_all_sitters', {
        search_term: search,
        page_limit: pageSize,
        page_offset: page * pageSize
      });

      if (error) {
        console.error('Error fetching sitters:', error);
        toast({
          title: "Error",
          description: "Failed to load sitters",
          variant: "destructive",
        });
        return;
      }

      const newSitters = data || [];
      
      if (reset || page === 0) {
        setSitters(newSitters);
      } else {
        setSitters(prev => [...prev, ...newSitters]);
      }
      
      setHasMorePages(newSitters.length === pageSize);
      setCurrentPage(page);
      
    } catch (error) {
      console.error('Error in fetchSitters:', error);
      toast({
        title: "Error",
        description: "Failed to load sitters",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateSitter = async (sitterId: string, updateData: UpdateSitterData) => {
    try {
      const { data, error } = await supabase.rpc('admin_update_sitter_details', {
        target_sitter_id: sitterId,
        new_name: updateData.name,
        new_profile_image_url: updateData.profile_image_url,
        new_bio: updateData.bio,
        new_experience: updateData.experience,
        new_hourly_rate: updateData.hourly_rate,
        new_phone_number: updateData.phone_number,
        new_email: updateData.email,
        new_certifications: updateData.certifications
      });

      if (error) {
        console.error('Error updating sitter:', error);
        toast({
          title: "Error",
          description: "Failed to update sitter",
          variant: "destructive",
        });
        return false;
      }

      toast({
        title: "Success",
        description: "Sitter updated successfully",
      });

      return true;
    } catch (error) {
      console.error('Error in updateSitter:', error);
      return false;
    }
  };

  const setVerifiedStatus = async (sitterId: string, verified: boolean) => {
    try {
      const { data, error } = await supabase.rpc('admin_set_verified_status', {
        item_type: 'sitter',
        item_id: sitterId,
        verified_status: verified
      });

      if (error) {
        console.error('Error setting verified status:', error);
        toast({
          title: "Error",
          description: "Failed to update verified status",
          variant: "destructive",
        });
        return false;
      }

      // Update local state
      setSitters(prev => prev.map(sitter => 
        sitter.id === sitterId 
          ? { ...sitter, is_verified: verified }
          : sitter
      ));

      toast({
        title: "Success",
        description: `Sitter ${verified ? 'verified' : 'unverified'} successfully`,
      });

      return true;
    } catch (error) {
      console.error('Error in setVerifiedStatus:', error);
      return false;
    }
  };

  const mergeDuplicates = async (sourceId: string, targetId: string, reason: string) => {
    try {
      const { data, error } = await supabase.rpc('admin_merge_duplicates', {
        item_type: 'sitter',
        source_id: sourceId,
        target_id: targetId,
        merge_reason: reason
      });

      if (error) {
        console.error('Error merging sitters:', error);
        toast({
          title: "Error",
          description: "Failed to merge sitters",
          variant: "destructive",
        });
        return false;
      }

      // Remove source sitter from local state
      setSitters(prev => prev.filter(sitter => sitter.id !== sourceId));

      toast({
        title: "Success",
        description: "Sitters merged successfully",
      });

      return true;
    } catch (error) {
      console.error('Error in mergeDuplicates:', error);
      return false;
    }
  };

  const searchSitters = (term: string) => {
    setSearchTerm(term);
    fetchSitters(term, 0, true);
  };

  const loadMoreSitters = () => {
    if (!loading && hasMorePages) {
      fetchSitters(searchTerm, currentPage + 1, false);
    }
  };

  useEffect(() => {
    fetchSitters();
  }, []);

  return {
    sitters,
    loading,
    searchTerm,
    searchSitters,
    updateSitter,
    setVerifiedStatus,
    mergeDuplicates,
    loadMoreSitters,
    hasMorePages,
    refreshSitters: () => fetchSitters(searchTerm, 0, true)
  };
};
