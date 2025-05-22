
import { Header } from "@/components/Header";
import { BottomNavigation } from "@/components/BottomNavigation";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SitterCard } from "@/components/SitterCard";

const Profile = () => {
  // Mock data for demonstration
  const profileData = {
    name: "Sophia Carter",
    role: "Mom",
    joinedYear: 2021,
    profileImage: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=2487&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    followers: 12,
    following: 34
  };

  const recommendedSitters = [
    {
      id: "101",
      name: "Emily Bennett",
      image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=2461&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      rating: 4.9,
      experience: "5 years experience",
      recommendedBy: "3 friends"
    },
    {
      id: "102",
      name: "Olivia Harper",
      image: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?q=80&w=2671&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      rating: 4.7,
      experience: "4 years experience",
      recommendedBy: "2 friends"
    }
  ];

  return (
    <div className="min-h-screen pb-20 bg-gray-50">
      <Header title="Profile" showBack={true} />
      
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
          <p className="text-purple-500">{profileData.role}</p>
          <p className="text-gray-500 text-sm">Joined {profileData.joinedYear}</p>
        </div>
        
        <div className="flex justify-center pb-4">
          <div className="w-[45%] px-4 py-3 text-center border-r border-gray-200">
            <p className="text-2xl font-bold">{profileData.followers}</p>
            <p className="text-purple-500">Followers</p>
          </div>
          <div className="w-[45%] px-4 py-3 text-center">
            <p className="text-2xl font-bold">{profileData.following}</p>
            <p className="text-purple-500">Following</p>
          </div>
        </div>
      </div>

      <div className="mt-6 px-4">
        <h2 className="text-2xl font-bold mb-4">Recommendations</h2>
        <Tabs defaultValue="babysitters">
          <TabsList className="grid grid-cols-2 mb-6">
            <TabsTrigger value="babysitters" className="text-base">Babysitters</TabsTrigger>
            <TabsTrigger value="products" className="text-base">Products</TabsTrigger>
          </TabsList>
          <TabsContent value="babysitters" className="space-y-4">
            {recommendedSitters.map((sitter) => (
              <SitterCard
                key={sitter.id}
                id={sitter.id}
                name={sitter.name}
                image={sitter.image}
                rating={sitter.rating}
                experience={sitter.experience}
                recommendedBy={sitter.recommendedBy}
              />
            ))}
          </TabsContent>
          <TabsContent value="products">
            <div className="bg-white rounded-lg p-8 text-center">
              <p className="text-gray-500">No product recommendations yet.</p>
              <Button className="mt-4 bg-purple-500 hover:bg-purple-600">
                Browse Products
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </div>
      
      <BottomNavigation />
    </div>
  );
};

export default Profile;
