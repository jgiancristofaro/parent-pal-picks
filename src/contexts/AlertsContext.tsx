
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

interface AlertsContextType {
  hasNewAlerts: boolean;
  refreshAlerts: () => void;
  isLoading: boolean;
}

const AlertsContext = createContext<AlertsContextType | undefined>(undefined);

export const useAlertsContext = () => {
  const context = useContext(AlertsContext);
  if (context === undefined) {
    throw new Error('useAlertsContext must be used within an AlertsProvider');
  }
  return context;
};

interface AlertsProviderProps {
  children: React.ReactNode;
}

export const AlertsProvider = ({ children }: AlertsProviderProps) => {
  const { user } = useAuth();
  const [hasNewAlerts, setHasNewAlerts] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const fetchAlertsStatus = async () => {
    if (!user?.id) return;
    
    try {
      setIsLoading(true);
      const { data, error } = await supabase.rpc('get_new_alerts_status', {
        user_id: user.id
      });

      if (error) throw error;
      
      const alertsData = data as unknown as { has_new_alerts: boolean };
      setHasNewAlerts(alertsData?.has_new_alerts || false);
    } catch (error) {
      console.error('Error fetching alerts status:', error);
      setHasNewAlerts(false);
    } finally {
      setIsLoading(false);
    }
  };

  const refreshAlerts = () => {
    fetchAlertsStatus();
  };

  useEffect(() => {
    if (user?.id) {
      fetchAlertsStatus();
      
      // Set up periodic refresh every 30 seconds
      const interval = setInterval(fetchAlertsStatus, 30000);
      
      return () => clearInterval(interval);
    }
  }, [user?.id]);

  const value = {
    hasNewAlerts,
    refreshAlerts,
    isLoading,
  };

  return (
    <AlertsContext.Provider value={value}>
      {children}
    </AlertsContext.Provider>
  );
};
