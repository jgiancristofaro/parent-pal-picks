
interface ProfileHeaderProps {
  profileData: {
    name: string;
    role: string;
    joinedYear: number;
    profileImage: string;
    bio?: string;
    username?: string;
  };
}

export const ProfileHeader = ({ profileData }: ProfileHeaderProps) => {
  return (
    <div className="bg-white pb-6">
      <div className="flex flex-col items-center pt-6 pb-4">
        <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-white shadow-md mb-4">
          <img 
            src={profileData.profileImage} 
            alt={profileData.name} 
            className="w-full h-full object-cover"
          />
        </div>
        <h1 className="text-2xl font-bold">{profileData.name}</h1>
        {profileData.username && (
          <p className="text-gray-500 text-sm">@{profileData.username}</p>
        )}
        <p className="text-purple-500">{profileData.role}</p>
        <p className="text-gray-500 text-sm">Joined {profileData.joinedYear}</p>
        {profileData.bio && (
          <p className="text-gray-600 text-center mt-3 px-6 max-w-md">{profileData.bio}</p>
        )}
      </div>
    </div>
  );
};
