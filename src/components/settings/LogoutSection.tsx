
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";

export const LogoutSection = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    if (isLoggingOut) return; // Prevent multiple logout attempts
    
    setIsLoggingOut(true);
    
    try {
      console.log('Attempting to sign out...');
      
      // Sign out from Supabase with global scope to ensure complete logout
      const { error } = await supabase.auth.signOut({ scope: 'global' });
      
      if (error) {
        console.error('Logout error:', error);
        toast({
          title: "Logout failed",
          description: error.message,
          variant: "destructive",
        });
        return;
      }

      // Clear storage after successful logout
      localStorage.clear();
      sessionStorage.clear();
      
      // Show success message
      toast({
        title: "Logged out successfully",
        description: "You have been logged out of your account.",
      });
      
      // Navigate to login page
      navigate("/");
      
    } catch (error) {
      console.error('Unexpected logout error:', error);
      toast({
        title: "Logout failed",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <div className="mt-8">
      <div className="bg-white rounded-lg shadow-sm">
        <Button
          onClick={handleLogout}
          disabled={isLoggingOut}
          variant="ghost"
          className="w-full flex items-center justify-start p-4 h-auto text-left hover:bg-red-50 text-red-600 hover:text-red-700 rounded-lg"
        >
          <div className="flex-shrink-0 mr-4">
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
              <LogOut className="w-6 h-6 text-red-600" />
            </div>
          </div>
          
          <div className="flex-grow">
            <h3 className="text-base font-medium">
              {isLoggingOut ? 'Logging Out...' : 'Log Out'}
            </h3>
            <p className="text-sm text-red-500 mt-1">Sign out of your account</p>
          </div>
        </Button>
      </div>
    </div>
  );
};
