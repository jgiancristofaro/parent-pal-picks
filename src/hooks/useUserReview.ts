
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

interface UserReview {
  id: string;
  rating: number;
  title: string;
  content: string;
  created_at: string;
  updated_at: string;
}

export const useUserReview = (productId?: string, sitterId?: string) => {
  const [userReview, setUserReview] = useState<UserReview | null>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchUserReview = async () => {
      if (!user || (!productId && !sitterId)) {
        setLoading(false);
        return;
      }

      try {
        let query = supabase
          .from("reviews")
          .select("id, rating, title, content, created_at, updated_at")
          .eq("user_id", user.id);

        if (productId) {
          query = query.eq("product_id", productId);
        } else if (sitterId) {
          query = query.eq("sitter_id", sitterId);
        }

        const { data, error } = await query.maybeSingle();

        if (error) {
          console.error("Error fetching user review:", error);
          return;
        }

        setUserReview(data);
      } catch (error) {
        console.error("Error fetching user review:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserReview();
  }, [user, productId, sitterId]);

  const refreshUserReview = async () => {
    if (!user || (!productId && !sitterId)) return;

    try {
      let query = supabase
        .from("reviews")
        .select("id, rating, title, content, created_at, updated_at")
        .eq("user_id", user.id);

      if (productId) {
        query = query.eq("product_id", productId);
      } else if (sitterId) {
        query = query.eq("sitter_id", sitterId);
      }

      const { data, error } = await query.maybeSingle();

      if (!error) {
        setUserReview(data);
      }
    } catch (error) {
      console.error("Error refreshing user review:", error);
    }
  };

  return { userReview, loading, refreshUserReview };
};
