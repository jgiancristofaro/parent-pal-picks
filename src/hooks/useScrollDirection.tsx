
import { useState, useEffect } from "react";

type ScrollDirection = "up" | "down" | null;

export const useScrollDirection = () => {
  const [scrollDirection, setScrollDirection] = useState<ScrollDirection>(null);
  const [prevScrollY, setPrevScrollY] = useState(0);
  const [visible, setVisible] = useState(true);
  
  useEffect(() => {
    const threshold = 5;
    let lastScrollY = window.scrollY;
    
    const updateScrollDirection = () => {
      const scrollY = window.scrollY;
      const direction = scrollY > lastScrollY ? "down" : "up";
      
      if (Math.abs(scrollY - lastScrollY) < threshold) {
        return;
      }
      
      // Update visibility based on direction and position
      if (direction === "down" && scrollY > 100) {
        setVisible(false);
      } else if (direction === "up") {
        setVisible(true);
      }
      
      setScrollDirection(direction);
      setPrevScrollY(scrollY > 0 ? scrollY : 0);
      lastScrollY = scrollY > 0 ? scrollY : 0;
    };
    
    window.addEventListener("scroll", updateScrollDirection);
    
    return () => {
      window.removeEventListener("scroll", updateScrollDirection);
    };
  }, []);
  
  return { scrollDirection, prevScrollY, visible };
};
