
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { AuthDebugger } from "@/components/AuthDebugger";
import { Skeleton } from "@/components/ui/skeleton";

const Index = () => {
  const navigate = useNavigate();
  const { session, isLoading } = useAuth();
  const [showDebug, setShowDebug] = useState(false);
  const [timeoutReached, setTimeoutReached] = useState(false);

  console.log('Index: Component rendering', { session: !!session, isLoading });

  // Fallback timeout for Index component
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      console.warn('Index: Timeout reached, showing fallback UI');
      setTimeoutReached(true);
    }, 15000); // 15 second timeout for Index

    return () => clearTimeout(timeoutId);
  }, []);

  // Enable debug mode with keyboard shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'D') {
        setShowDebug(!showDebug);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showDebug]);

  useEffect(() => {
    if (isLoading && !timeoutReached) {
      console.log('Index: Still loading auth, waiting...');
      return; // Wait for auth to load
    }

    console.log('Index: Auth loaded or timeout reached, processing navigation');

    if (session) {
      // User is authenticated, redirect to home
      console.log('Index: User authenticated, redirecting to home');
      navigate("/home");
      return;
    }

    // User is not authenticated, check onboarding status
    const hasSeenOnboarding = localStorage.getItem('hasSeenParentPalOnboarding');
    
    if (!hasSeenOnboarding || hasSeenOnboarding !== 'true') {
      // First-time user, redirect to onboarding
      console.log('Index: First-time user, redirecting to onboarding');
      navigate("/onboarding");
    } else {
      // Returning user, proceed to signup (they can navigate to login from there)
      console.log('Index: Returning user, redirecting to signup');
      navigate("/signup");
    }
  }, [navigate, session, isLoading, timeoutReached]);

  if (timeoutReached) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-purple-50 p-6">
        <AuthDebugger visible={showDebug} />
        <div className="max-w-md w-full text-center">
          <h1 className="text-2xl font-bold mb-4">ParentPal</h1>
          <p className="text-gray-600 mb-6">
            Taking longer than expected to load. Let's get you started!
          </p>
          <div className="space-y-3">
            <button
              onClick={() => navigate('/onboarding')}
              className="w-full bg-purple-600 text-white py-3 px-4 rounded-lg hover:bg-purple-700"
            >
              Get Started
            </button>
            <button
              onClick={() => navigate('/login')}
              className="w-full border border-purple-600 text-purple-600 py-3 px-4 rounded-lg hover:bg-purple-50"
            >
              Sign In
            </button>
          </div>
          <p className="text-xs text-gray-400 mt-4">
            Press Ctrl+Shift+D to toggle debug info
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-purple-50">
      <AuthDebugger visible={showDebug} />
      <div className="space-y-4 w-full max-w-md px-6">
        <Skeleton className="h-8 w-32 mx-auto" />
        <Skeleton className="h-64 w-full" />
        <Skeleton className="h-12 w-full" />
        <p className="text-center text-sm text-gray-500">
          Loading ParentPal...
        </p>
      </div>
    </div>
  );
};

export default Index;
