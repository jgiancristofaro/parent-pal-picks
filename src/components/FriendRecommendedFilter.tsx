
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Users } from "lucide-react";

interface FriendRecommendedFilterProps {
  enabled: boolean;
  onToggle: (enabled: boolean) => void;
  friendCount?: number;
}

export const FriendRecommendedFilter = ({ 
  enabled, 
  onToggle, 
  friendCount = 0 
}: FriendRecommendedFilterProps) => {
  return (
    <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200 shadow-sm">
      <div className="flex items-center space-x-3">
        <div className="p-2 bg-purple-100 rounded-full">
          <Users className="h-5 w-5 text-purple-600" />
        </div>
        <div>
          <Label 
            htmlFor="friend-recommended" 
            className="text-base font-semibold text-gray-800 cursor-pointer"
          >
            Friend-Recommended Only
          </Label>
          <p className="text-sm text-gray-500 mt-1">
            Show sitters recommended by people you follow
            {friendCount > 0 && ` (${friendCount} friends)`}
          </p>
        </div>
      </div>
      <Switch
        id="friend-recommended"
        checked={enabled}
        onCheckedChange={onToggle}
        className="data-[state=checked]:bg-purple-500"
      />
    </div>
  );
};
