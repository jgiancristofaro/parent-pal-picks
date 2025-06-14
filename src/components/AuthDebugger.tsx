
import { useAuth } from '@/contexts/AuthContext';

interface AuthDebuggerProps {
  visible?: boolean;
}

export const AuthDebugger = ({ visible = false }: AuthDebuggerProps) => {
  const { session, user, profile, isLoading, isAdmin } = useAuth();

  if (!visible) return null;

  return (
    <div className="fixed top-4 right-4 bg-black bg-opacity-80 text-white p-4 rounded-lg text-xs z-50 max-w-sm">
      <h3 className="font-bold mb-2">Auth Debug Info</h3>
      <div className="space-y-1">
        <div>Loading: {isLoading ? 'true' : 'false'}</div>
        <div>Session: {session ? 'exists' : 'null'}</div>
        <div>User: {user ? user.id : 'null'}</div>
        <div>Profile: {profile ? profile.id : 'null'}</div>
        <div>Is Admin: {isAdmin ? 'true' : 'false'}</div>
        <div>Current Time: {new Date().toLocaleTimeString()}</div>
      </div>
    </div>
  );
};
