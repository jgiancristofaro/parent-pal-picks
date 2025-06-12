
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const { profile } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">Welcome back, {profile?.full_name}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">User Management</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">Manage users, view profiles, and handle suspensions.</p>
              <button 
                onClick={() => navigate('/admin/users')}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors"
              >
                Manage Users
              </button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Sitter Management</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">Edit sitter profiles, verify accounts, and manage reviews.</p>
              <button 
                onClick={() => navigate('/admin/sitters')}
                className="w-full bg-purple-600 text-white py-2 px-4 rounded hover:bg-purple-700 transition-colors"
              >
                Manage Sitters
              </button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Product Management</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">Edit product listings, verify items, and moderate content.</p>
              <button 
                onClick={() => navigate('/admin/products')}
                className="w-full bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 transition-colors"
              >
                Manage Products
              </button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Content Moderation</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">Review flagged content and moderate reviews.</p>
              <button 
                onClick={() => navigate('/admin/content-moderation')}
                className="w-full bg-orange-600 text-white py-2 px-4 rounded hover:bg-orange-700 transition-colors"
              >
                Review Content
              </button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Analytics</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">View platform statistics and user engagement.</p>
              <button className="w-full bg-indigo-600 text-white py-2 px-4 rounded hover:bg-indigo-700 transition-colors">
                View Analytics
              </button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Bulk Import</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">Import multiple sitters or products from CSV files.</p>
              <button 
                onClick={() => navigate('/admin/import')}
                className="w-full bg-teal-600 text-white py-2 px-4 rounded hover:bg-teal-700 transition-colors"
              >
                Import Data
              </button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
