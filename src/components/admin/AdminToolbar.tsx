
import React from 'react';
import { Link } from 'react-router-dom';
import { Settings, Users, User, Package, Flag } from 'lucide-react';
import { useAdmin } from '@/hooks/useAdmin';

export const AdminToolbar = () => {
  const { isAdmin } = useAdmin();

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="fixed bottom-20 left-4 right-4 bg-red-600 text-white rounded-lg shadow-lg p-2 z-50">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">Admin Tools</span>
        <div className="flex items-center gap-2">
          <Link
            to="/admin"
            className="p-2 hover:bg-red-700 rounded transition-colors"
            title="Dashboard"
          >
            <Settings className="h-4 w-4" />
          </Link>
          <Link
            to="/admin/users"
            className="p-2 hover:bg-red-700 rounded transition-colors"
            title="Users"
          >
            <Users className="h-4 w-4" />
          </Link>
          <Link
            to="/admin/sitters"
            className="p-2 hover:bg-red-700 rounded transition-colors"
            title="Sitters"
          >
            <User className="h-4 w-4" />
          </Link>
          <Link
            to="/admin/products"
            className="p-2 hover:bg-red-700 rounded transition-colors"
            title="Products"
          >
            <Package className="h-4 w-4" />
          </Link>
          <Link
            to="/admin/flags"
            className="p-2 hover:bg-red-700 rounded transition-colors"
            title="Flags"
          >
            <Flag className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
};
