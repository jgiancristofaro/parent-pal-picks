
interface ProfileStatsProps {
  followers: number;
  following: number;
}

export const ProfileStats = ({ followers, following }: ProfileStatsProps) => {
  return (
    <div className="flex justify-center pb-4">
      <div className="w-[45%] px-4 py-3 text-center border-r border-gray-200">
        <p className="text-2xl font-bold">{followers}</p>
        <p className="text-purple-500">Followers</p>
      </div>
      <div className="w-[45%] px-4 py-3 text-center">
        <p className="text-2xl font-bold">{following}</p>
        <p className="text-purple-500">Following</p>
      </div>
    </div>
  );
};
