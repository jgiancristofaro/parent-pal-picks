import { useEffect, useCallback, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface SessionTimeoutConfig {
  warningTimeMs: number; // Time before session expires to show warning
  sessionTimeoutMs: number; // Total session timeout duration
  enabled: boolean;
}

const DEFAULT_CONFIG: SessionTimeoutConfig = {
  warningTimeMs: 5 * 60 * 1000, // 5 minutes warning
  sessionTimeoutMs: 30 * 60 * 1000, // 30 minutes total
  enabled: true,
};

export const useSessionTimeout = (config: Partial<SessionTimeoutConfig> = {}) => {
  const { session, user } = useAuth();
  const { toast } = useToast();
  const finalConfig = { ...DEFAULT_CONFIG, ...config };
  
  const warningTimeoutRef = useRef<NodeJS.Timeout>();
  const sessionTimeoutRef = useRef<NodeJS.Timeout>();
  const lastActivityRef = useRef<number>(Date.now());

  const handleSessionTimeout = useCallback(async () => {
    try {
      await supabase.auth.signOut();
      toast({
        title: "Session Expired",
        description: "Your session has expired for security. Please log in again.",
        variant: "destructive",
      });
    } catch (error) {
      console.error('Error during session timeout logout:', error);
    }
  }, [toast]);

  const showWarning = useCallback(() => {
    toast({
      title: "Session Expiring Soon",
      description: "Your session will expire in 5 minutes due to inactivity. Click anywhere to extend.",
      duration: 10000, // Show warning for 10 seconds
    });
  }, [toast]);

  const resetTimeout = useCallback(() => {
    if (!finalConfig.enabled || !session) return;

    lastActivityRef.current = Date.now();

    // Clear existing timeouts
    if (warningTimeoutRef.current) {
      clearTimeout(warningTimeoutRef.current);
    }
    if (sessionTimeoutRef.current) {
      clearTimeout(sessionTimeoutRef.current);
    }

    // Set warning timeout
    warningTimeoutRef.current = setTimeout(() => {
      showWarning();
    }, finalConfig.sessionTimeoutMs - finalConfig.warningTimeMs);

    // Set session timeout
    sessionTimeoutRef.current = setTimeout(() => {
      handleSessionTimeout();
    }, finalConfig.sessionTimeoutMs);
  }, [finalConfig, session, showWarning, handleSessionTimeout]);

  const handleActivity = useCallback(() => {
    if (!finalConfig.enabled || !session) return;
    
    const now = Date.now();
    const timeSinceLastActivity = now - lastActivityRef.current;
    
    // Only reset if more than 1 minute has passed since last activity
    if (timeSinceLastActivity > 60 * 1000) {
      resetTimeout();
    }
  }, [resetTimeout, finalConfig.enabled, session]);

  useEffect(() => {
    if (!finalConfig.enabled || !user) {
      // Clear timeouts if session timeout is disabled or user is not logged in
      if (warningTimeoutRef.current) {
        clearTimeout(warningTimeoutRef.current);
      }
      if (sessionTimeoutRef.current) {
        clearTimeout(sessionTimeoutRef.current);
      }
      return;
    }

    // Set initial timeout
    resetTimeout();

    // Add event listeners for user activity
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];
    
    events.forEach(event => {
      document.addEventListener(event, handleActivity, { passive: true });
    });

    return () => {
      // Clean up event listeners
      events.forEach(event => {
        document.removeEventListener(event, handleActivity);
      });
      
      // Clear timeouts
      if (warningTimeoutRef.current) {
        clearTimeout(warningTimeoutRef.current);
      }
      if (sessionTimeoutRef.current) {
        clearTimeout(sessionTimeoutRef.current);
      }
    };
  }, [user, finalConfig.enabled, resetTimeout, handleActivity]);

  return {
    resetTimeout,
    timeUntilWarning: () => {
      if (!session || !finalConfig.enabled) return null;
      const elapsed = Date.now() - lastActivityRef.current;
      const timeUntilWarning = finalConfig.sessionTimeoutMs - finalConfig.warningTimeMs - elapsed;
      return Math.max(0, timeUntilWarning);
    },
    timeUntilExpiry: () => {
      if (!session || !finalConfig.enabled) return null;
      const elapsed = Date.now() - lastActivityRef.current;
      const timeUntilExpiry = finalConfig.sessionTimeoutMs - elapsed;
      return Math.max(0, timeUntilExpiry);
    },
  };
};