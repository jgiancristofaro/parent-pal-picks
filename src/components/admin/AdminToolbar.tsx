
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdmin } from '@/hooks/useAdmin';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Settings, Users, UserCheck, Package, Flag, Upload } from 'lucide-react';

export const AdminToolbar = () => {
  const { isAdmin } = useAdmin();
  const navigate = useNavigate();

  if (!isAdmin) return null;

  return (
    <Card className="fixed bottom-4 right-4 z-50 p-3 shadow-lg bg-background border">
      <div className="flex items-center gap-2">
        <span className="text-xs font-medium text-muted-foreground mr-2">Admin</span>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate('/admin')}
          className="h-8 w-8 p-0"
          title="Admin Dashboard"
        >
          <Settings className="h-4 w-4" />
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate('/admin/users')}
          className="h-8 w-8 p-0"
          title="Manage Users"
        >
          <Users className="h-4 w-4" />
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate('/admin/sitters')}
          className="h-8 w-8 p-0"
          title="Manage Sitters"
        >
          <UserCheck className="h-4 w-4" />
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate('/admin/products')}
          className="h-8 w-8 p-0"
          title="Manage Products"
        >
          <Package className="h-4 w-4" />
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate('/admin/content-moderation')}
          className="h-8 w-8 p-0"
          title="Content Moderation"
        >
          <Flag className="h-4 w-4" />
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate('/admin/import')}
          className="h-8 w-8 p-0"
          title="Bulk Import"
        >
          <Upload className="h-4 w-4" />
        </Button>
      </div>
    </Card>
  );
};
