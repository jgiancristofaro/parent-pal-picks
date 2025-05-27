
import { useState } from "react";

export const useSearchFilters = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [friendRecommendedOnly, setFriendRecommendedOnly] = useState(false);
  const [selectedUserHomeId, setSelectedUserHomeId] = useState<string | null>(null);
  const [localSearchScope, setLocalSearchScope] = useState<string>("ANY");

  return {
    searchTerm,
    setSearchTerm,
    friendRecommendedOnly,
    setFriendRecommendedOnly,
    selectedUserHomeId,
    setSelectedUserHomeId,
    localSearchScope,
    setLocalSearchScope,
  };
};
