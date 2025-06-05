
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useDebouncedSearch } from './useDebouncedSearch';

export const useUsernameAvailability = (username: string) => {
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null);
  const [isChecking, setIsChecking] = useState(false);
  const debouncedUsername = useDebouncedSearch(username, 500);

  useEffect(() => {
    const checkAvailability = async () => {
      if (!debouncedUsername || debouncedUsername.length < 3) {
        setIsAvailable(null);
        return;
      }

      setIsChecking(true);
      try {
        const { data, error } = await supabase.rpc('check_username_availability', {
          p_username: debouncedUsername
        });

        if (error) throw error;
        setIsAvailable(data?.available ?? false);
      } catch (error) {
        console.error('Error checking username availability:', error);
        setIsAvailable(null);
      } finally {
        setIsChecking(false);
      }
    };

    checkAvailability();
  }, [debouncedUsername]);

  return { isAvailable, isChecking };
};
