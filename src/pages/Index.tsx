
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const Index = () => {
  const navigate = useNavigate();
  const { session, isLoading } = useAuth();

  useEffect(() => {
    if (isLoading) return; // Wait for auth to load

    if (session) {
      // User is authenticated, redirect to home
      navigate("/home");
      return;
    }

    // User is not authenticated, check onboarding status
    const hasSeenOnboarding = localStorage.getItem('hasSeenParentPalOnboarding');
    
    if (!hasSeenOnboarding || hasSeenOnboarding !== 'true') {
      // First-time user, redirect to onboarding
      navigate("/onboarding");
    } else {
      // Returning user, redirect to onboarding with parameter to show last slide
      navigate("/onboarding?returning=true");
    }
  }, [navigate, session, isLoading]);

  return null;
};

export default Index;
