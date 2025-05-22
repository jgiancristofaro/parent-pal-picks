import { Header } from "@/components/Header";
import { BottomNavigation } from "@/components/BottomNavigation";
import { Button } from "@/components/ui/button";
import { StarIcon } from "@/components/StarIcon";

const SitterProfile = () => {
  // Mock data for demonstration
  const sitter = {
    id: "123",
    name: "Sophia Bennett",
    role: "Babysitter",
    rating: 4.9,
    reviewCount: 120,
    profileImage: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    about: "Sophia is a certified babysitter with 5+ years of experience caring for children of all ages. She is CPR and First Aid certified and has a background in early childhood education. Sophia loves engaging kids with fun activities and ensuring their safety and well-being.",
    experience: "2018 - Present",
    certifications: ["CPR & First Aid Certified"],
    rate: "$20/hour",
    availability: "July 2024"
  };

  const reviews = [
    {
      id: "r1",
      userId: "u1",
      userName: "Emily Carter",
      userImage: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=2487&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      rating: 5,
      date: "June 15, 2024",
      content: "Sophia is an amazing babysitter! She is reliable, trustworthy, and great with kids. My children adore her and always have a fantastic time when she's around. I highly recommend her!"
    },
    {
      id: "r2",
      userId: "u2",
      userName: "David Lee",
      userImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=2487&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      rating: 5,
      date: "May 20, 2024",
      content: "Sophia is a fantastic babysitter. She's punctual, responsible, and my kids love her. She always keeps them engaged with fun activities and I feel completely at ease when she's with them."
    }
  ];

  const renderStars = (rating: number) => {
    return Array(5).fill(0).map((_, i) => (
      <StarIcon key={i} filled={i < rating} className="w-5 h-5 text-yellow-500" />
    ));
  };

  return (
    <div className="min-h-screen pb-20 bg-gray-50">
      <Header title="Babysitter Profile" showBack={true} />
      
      <div className="bg-white pb-6">
        <div className="flex flex-col items-center pt-6 pb-4">
          <div className="w-24 h-24 rounded-full overflow-hidden mb-4">
            <img 
              src={sitter.profileImage} 
              alt={sitter.name} 
              className="w-full h-full object-cover"
            />
          </div>
          <h1 className="text-xl font-bold">{sitter.name}</h1>
          <p className="text-purple-500">{sitter.role}</p>
          <div className="flex items-center mt-1">
            <div className="flex">
              {renderStars(Math.floor(sitter.rating))}
            </div>
            <span className="ml-2 text-gray-600">
              {sitter.rating} ({sitter.reviewCount} reviews)
            </span>
          </div>
        </div>
      </div>

      <div className="p-4">
        <section className="mb-6">
          <h2 className="text-xl font-bold mb-2">About</h2>
          <p className="text-gray-700">{sitter.about}</p>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-bold mb-2">Experience</h2>
          <div className="flex items-center">
            <div className="w-8 h-8 bg-purple-100 rounded-md flex items-center justify-center mr-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-purple-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
                <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
              </svg>
            </div>
            <div>
              <p className="font-medium">Babysitter</p>
              <p className="text-gray-500 text-sm">{sitter.experience}</p>
            </div>
          </div>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-bold mb-2">Certifications</h2>
          {sitter.certifications.map((cert, index) => (
            <div key={index} className="flex items-center mb-2">
              <div className="w-8 h-8 bg-purple-100 rounded-md flex items-center justify-center mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-purple-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="9 11 12 14 22 4"></polyline>
                  <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path>
                </svg>
              </div>
              <p>{cert}</p>
            </div>
          ))}
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-bold mb-2">Rates</h2>
          <div className="flex items-center">
            <div className="w-8 h-8 bg-purple-100 rounded-md flex items-center justify-center mr-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-purple-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="1" x2="12" y2="23"></line>
                <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
              </svg>
            </div>
            <p>{sitter.rate}</p>
          </div>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-bold mb-2">Availability</h2>
          <div className="overflow-x-auto">
            <div className="grid grid-cols-7 gap-2">
              <div className="text-center font-medium py-2">S</div>
              <div className="text-center font-medium py-2">M</div>
              <div className="text-center font-medium py-2">T</div>
              <div className="text-center font-medium py-2">W</div>
              <div className="text-center font-medium py-2">T</div>
              <div className="text-center font-medium py-2">F</div>
              <div className="text-center font-medium py-2">S</div>
              
              {/* Calendar days would go here */}
              <div className="text-center py-2 text-gray-400">1</div>
              <div className="text-center py-2 text-gray-400">2</div>
              <div className="text-center py-2 text-gray-400">3</div>
              <div className="text-center py-2 text-gray-400">4</div>
              <div className="text-center py-2 bg-purple-500 text-white rounded-full">5</div>
              <div className="text-center py-2 text-gray-400">6</div>
              <div className="text-center py-2 text-gray-400">7</div>
            </div>
          </div>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-bold mb-2">Reviews</h2>
          <div className="space-y-4">
            {reviews.map((review) => (
              <div key={review.id} className="bg-white p-4 rounded-lg">
                <div className="flex items-center mb-3">
                  <img 
                    src={review.userImage} 
                    alt={review.userName} 
                    className="w-12 h-12 rounded-full mr-3 object-cover"
                  />
                  <div>
                    <p className="font-medium">{review.userName}</p>
                    <p className="text-gray-500 text-sm">{review.date}</p>
                  </div>
                </div>
                <div className="flex mb-2">
                  {renderStars(review.rating)}
                </div>
                <p className="text-gray-700">{review.content}</p>
                <div className="flex items-center mt-3">
                  <button className="flex items-center mr-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500 mr-1" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
                    </svg>
                    <span>{review.id === "r1" ? "2" : "1"}</span>
                  </button>
                  <button className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500 mr-1" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M18 9.5a1.5 1.5 0 11-3 0v-6a1.5 1.5 0 013 0v6zM14 9.667v-5.43a2 2 0 00-1.105-1.79l-.05-.025A4 4 0 0011.055 2H5.64a2 2 0 00-1.962 1.608l-1.2 6A2 2 0 004.44 12H8v4a2 2 0 002 2 1 1 0 001-1v-.667a4 4 0 01.8-2.4l1.4-1.866a4 4 0 00.8-2.4z" />
                    </svg>
                    <span>{review.id === "r2" ? "1" : "0"}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-bold mb-2">Recommended by</h2>
          <div className="flex">
            <img 
              src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=2487&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" 
              alt="Recommender" 
              className="w-10 h-10 rounded-full border-2 border-white object-cover"
            />
            <img 
              src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=2487&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" 
              alt="Recommender" 
              className="w-10 h-10 rounded-full border-2 border-white -ml-2 object-cover"
            />
            <img 
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=2564&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" 
              alt="Recommender" 
              className="w-10 h-10 rounded-full border-2 border-white -ml-2 object-cover"
            />
          </div>
        </section>

        <Button className="w-full py-6 bg-purple-500 hover:bg-purple-600 mb-6">
          Book Now
        </Button>
      </div>
      
      <BottomNavigation />
    </div>
  );
};

export default SitterProfile;
