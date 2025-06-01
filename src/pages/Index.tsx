
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user has seen onboarding
    const hasSeenOnboarding = localStorage.getItem('hasSeenParentPalOnboarding');
    
    if (!hasSeenOnboarding || hasSeenOnboarding !== 'true') {
      // First-time user, redirect to onboarding
      navigate("/onboarding");
    } else {
      // Returning user, proceed to login
      navigate("/login");
    }
  }, [navigate]);

  return null;
};

export default Index;
