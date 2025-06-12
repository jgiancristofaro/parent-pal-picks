
import React from 'react';
import { Header } from '@/components/Header';
import { useAuth } from '@/contexts/AuthContext';

const AdminDashboard = () => {
  const { profile } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      <Header title="Admin Dashboard" showBack={true} />
      
      <div className="p-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Welcome to Admin Dashboard
            </h1>
            <p className="text-gray-600 mb-4">
              Hello, {profile?.full_name}. You have administrator privileges.
            </p>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-semibold text-blue-900 mb-2">Administrator Features</h3>
              <p className="text-blue-700 text-sm">
                This is a protected admin area. Only users with ADMIN role can access this dashboard.
              </p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="font-semibold text-gray-900 mb-2">User Management</h3>
              <p className="text-gray-600 text-sm">
                Manage user accounts, roles, and permissions.
              </p>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="font-semibold text-gray-900 mb-2">Content Moderation</h3>
              <p className="text-gray-600 text-sm">
                Review and moderate user-generated content.
              </p>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="font-semibold text-gray-900 mb-2">Analytics</h3>
              <p className="text-gray-600 text-sm">
                View platform statistics and usage analytics.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
