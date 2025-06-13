
import { useAdminSitters } from "./useAdminSitters";
import { useAdminSitterMutations } from "./useAdminSitterMutations";
import type { UseAdminSittersProps } from "./types";

export const useAdminSittersComplete = (props: UseAdminSittersProps = {}) => {
  const sittersQuery = useAdminSitters(props);
  const mutations = useAdminSitterMutations();

  return {
    ...sittersQuery,
    ...mutations,
  };
};

// Export all individual hooks and types
export { useAdminSitters } from "./useAdminSitters";
export { useAdminSitterMutations } from "./useAdminSitterMutations";
export { useAdminSitterReviews } from "./useAdminSitterReviews";
export type { AdminSitter, AdminReview, UseAdminSittersProps } from "./types";
