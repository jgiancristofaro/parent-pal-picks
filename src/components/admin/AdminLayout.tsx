
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Skeleton } from '@/components/ui/skeleton';

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
  const { isLoading, isAdmin, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        // Not logged in, redirect to login
        navigate('/login');
      } else if (!isAdmin) {
        // Logged in but not admin, redirect to home
        navigate('/home');
      }
    }
  }, [isLoading, isAdmin, user, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="space-y-4 w-full max-w-md px-6">
          <Skeleton className="h-8 w-48 mx-auto" />
          <Skeleton className="h-64 w-full" />
          <Skeleton className="h-12 w-full" />
        </div>
      </div>
    );
  }

  if (!user || !isAdmin) {
    return null; // Will redirect in useEffect
  }

  return <>{children}</>;
};

export default AdminLayout;
