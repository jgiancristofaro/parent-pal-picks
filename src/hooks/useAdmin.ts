
import { useAuth } from '@/contexts/AuthContext';

interface UseAdminReturn {
  isAdmin: boolean;
}

export const useAdmin = (): UseAdminReturn => {
  const { isAdmin } = useAuth();
  
  return {
    isAdmin
  };
};
