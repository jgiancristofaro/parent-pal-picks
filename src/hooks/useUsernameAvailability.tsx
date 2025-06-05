
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
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          setIsAvailable(null);
          return;
        }

        const { data: existingUser } = await supabase
          .from('profiles')
          .select('id')
          .eq('username', debouncedUsername)
          .neq('id', user.id)
          .single();

        setIsAvailable(!existingUser);
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
