
import { useState } from "react";
import { UserListModal } from "./UserListModal";

interface User {
  id: string;
  full_name: string;
  avatar_url: string | null;
}

interface ProfileStatsProps {
  followers: number;
  following: number;
  followersData?: User[];
  followingData?: User[];
}

export const ProfileStats = ({ followers, following, followersData = [], followingData = [] }: ProfileStatsProps) => {
  const [showFollowersModal, setShowFollowersModal] = useState(false);
  const [showFollowingModal, setShowFollowingModal] = useState(false);

  return (
    <>
      <div className="flex justify-center pb-4">
        <button 
          onClick={() => setShowFollowersModal(true)}
          className="w-[45%] px-4 py-3 text-center border-r border-gray-200 hover:bg-gray-50 transition-colors"
        >
          <p className="text-2xl font-bold">{followers}</p>
          <p className="text-purple-500">Followers</p>
        </button>
        <button 
          onClick={() => setShowFollowingModal(true)}
          className="w-[45%] px-4 py-3 text-center hover:bg-gray-50 transition-colors"
        >
          <p className="text-2xl font-bold">{following}</p>
          <p className="text-purple-500">Following</p>
        </button>
      </div>

      <UserListModal
        isOpen={showFollowersModal}
        onClose={() => setShowFollowersModal(false)}
        title="Followers"
        users={followersData}
      />

      <UserListModal
        isOpen={showFollowingModal}
        onClose={() => setShowFollowingModal(false)}
        title="Following"
        users={followingData}
      />
    </>
  );
};
