import { useSessionTimeout } from '@/hooks/useSessionTimeout';

export const SessionTimeoutManager = () => {
  // Initialize session timeout functionality
  useSessionTimeout({
    sessionTimeoutMs: 30 * 60 * 1000, // 30 minutes
    warningTimeMs: 5 * 60 * 1000,     // 5 minutes warning
    enabled: true,
  });

  // This component doesn't render anything, it just manages session timeout
  return null;
};