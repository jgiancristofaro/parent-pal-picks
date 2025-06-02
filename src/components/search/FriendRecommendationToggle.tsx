
import { Switch } from "@/components/ui/switch";

interface FriendRecommendationToggleProps {
  friendRecommendedOnly: boolean;
  onToggle: (value: boolean) => void;
}

export const FriendRecommendationToggle = ({ friendRecommendedOnly, onToggle }: FriendRecommendationToggleProps) => {
  return (
    <div className="flex items-center justify-between mb-1 p-3 bg-white rounded-lg border border-gray-200">
      <span className="text-sm font-medium text-gray-700">Recommended by People I Follow</span>
      <Switch
        checked={friendRecommendedOnly}
        onCheckedChange={onToggle}
      />
    </div>
  );
};
